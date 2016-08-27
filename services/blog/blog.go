package blog

import (
	"log"
	"net/http"
	"strconv"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/asaskevich/govalidator"
	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
)

func init() {
	env.Router.Group("/api/blog", func(r martini.Router) {
		r.Post("/new", auth.Great(entity.Normal), binding.Bind(entity.Blog{}), verifyNewBlog, NewBlog)
		r.Get("/page", GetBlogPage)
		r.Get("", GetBlog)
		r.Put("", auth.Great(entity.Normal), binding.Bind(entity.Blog{}), verifyPutBlog, PutBlog)
		r.Delete("", auth.Great(entity.Normal), delBlog)
	})
}

type Result map[string]interface{}

//NewBlog 新建博客
func NewBlog(b entity.Blog, sess session.Store, r render.Render, mgoOp *env.MgoOp) {
	u := sess.Get("user").(entity.User)
	b.AuthorRef = mgo.DBRef{
		Collection: u.CollectionName(),
		Id:         u.ID,
		Database:   entity.DBName,
	}
	b.ID = bson.NewObjectId().Hex()
	b.CreateDate = time.Now()
	b.UpdateDate = time.Now()
	err := mgoOp.Insert(b.GetCollectionName(), &b)
	log.Println(b.GetCollectionName())
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "新建博客失败", nil))
		return
	}
	r.JSON(200, model.NewResult(true, 0, "新建博客成功", nil))
}

func verifyNewBlog(b entity.Blog, r render.Render) {
	if govalidator.IsNull(b.Title) {
		r.JSON(200, model.NewResult(false, 0, "博客标题不能为空", nil))
		return
	}
	if govalidator.IsNull(b.Content) {
		r.JSON(200, model.NewResult(false, 0, "博客内容不能为空", nil))
		return
	}
}

//GetPage 获取分页
func GetBlogPage(req *http.Request, r render.Render, mgoOp *env.MgoOp) {
	/**
	 * 1. 获取blog页码('page')和每页大小('pagesize'),如不存在则返回错误
	 * 2. 查询blog对应分页数据([]Blog)，获取每一博文对应user数据(name, headerIcon),然后和博文组合返回
	 */

	// 1. 获取blog 页码('page')和每页大小('pagesize'),如不存在则返回错误
	page, err := strconv.Atoi(req.URL.Query().Get("page"))
	if err != nil {
		r.JSON(200, Result{"success": false, "desc": "获取页码page失败", "error": err.Error()})
		return
	}
	if page < 1 {
		r.JSON(200, Result{"success": false, "desc": "页码page不能小于1"})
		return
	}
	pagesize, err := strconv.Atoi(req.URL.Query().Get("pagesize"))
	if err != nil {
		r.JSON(200, Result{"success": false, "desc": "获取每页大小pagesize失败", "error": err.Error()})
		return
	}
	if pagesize < 1 && pagesize <= 50 {
		r.JSON(200, Result{"success": false, "desc": "每页大小pagesize不能小于1和大于50 "})
		return
	}

	// 2. 查询blog对应分页数据([]Blog)，获取每一博文对应user数据(name, headerIcon),然后和博文组合返回
	var blogElems []*struct {
		entity.Blog `bson:",inline"`
		Author      entity.User `json:"author"`
		CommentSize int         `json:"commentSize"`
	}
	var total int //博文总的条数

	//query
	query := bson.M{}
	userId := req.URL.Query().Get("userId")
	log.Println(userId)
	if userId != "" {
		query["authorRef.$id"] = userId
	}

	mgoOp.WithDB(func(db *mgo.Database) {
		total, err = db.C("Blog").Find(query).Count()
		err = db.C("Blog").Find(query).Skip((page - 1) * pagesize).Limit(pagesize).All(&blogElems) //获取分页数据
		if err != nil {
			r.JSON(200, Result{"success": false, "desc": "获取分页数据失败", "error": err.Error()})
			return
		}
		for _, b := range blogElems {
			var bc entity.BlogComment
			db.FindRef(&b.AuthorRef).Select(bson.M{"headerIcon": 1, "username": 1}).One(&b.Author)
			db.C("BlogComment").FindId(b.ID).Select(bson.M{
				"size": 1,
			}).One(&bc)
			b.CommentSize = bc.Size
		}
	})

	r.JSON(200, Result{"success": true, "desc": "获取分页数据成功", "elements": blogElems, "total": total})
	return
}

//GetBlog 获取博客
func GetBlog(req *http.Request, r render.Render, mgoOp *env.MgoOp) {
	blogID := req.URL.Query().Get("blogId")
	if blogID == "" {
		r.JSON(200, model.NewResult(false, 0, "blogID不能为空", nil))
		return
	}
	entity.UpdateViews(blogID)
	var blogElem struct {
		entity.Blog `bson:",inline"`
		CommentSize int         `json:"commentSize"`
		Author      entity.User `json:"author"`
	}
	var err error
	mgoOp.WithDB(func(db *mgo.Database) {
		err = db.C("Blog").FindId(blogID).One(&blogElem)
		db.FindRef(&blogElem.AuthorRef).Select(bson.M{
			"headerIcon": 1,
			"username":   1,
		}).One(&blogElem.Author)
	})
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "博客不存在", nil))
		return
	}
	blogElem.CommentSize = entity.GetSize(blogID)
	r.JSON(200, model.NewResult(true, 0, "获取成功", blogElem))
}

//PutBlog 修改博客（字段为：title,content）
func PutBlog(b entity.Blog, r render.Render) {
	err := entity.Edit(b)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "修改博客失败", nil))
	}
	r.JSON(200, model.NewResult(true, 0, "修改博客成功", nil))
}

func verifyPutBlog(b entity.Blog, r render.Render, sess session.Store) {
	originBlog, err := entity.GetByID(b.ID)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "博客不存在，修改失败", nil))
		return
	}
	if originBlog.AuthorRef.Id != sess.Get("user").(entity.User).ID {
		r.JSON(http.StatusForbidden, model.NewResult(false, 0, "没权权限修改博客博客", nil))
		return
	}
	if govalidator.IsNull(b.Title) {
		r.JSON(200, model.NewResult(false, 0, "博客标题不能为空", nil))
		return
	}
	if govalidator.IsNull(b.Content) {
		r.JSON(200, model.NewResult(false, 0, "博客内容不能为空", nil))
		return
	}
}

// delBlog 完全删除博文(包括评论)
func delBlog(req *http.Request, r render.Render, mgoOp *env.MgoOp, sess session.Store) {
	/**
	 * 1. 读取blogId
	 * 2. 验证权限(当前用户是否是博文拥有者)
	 * 3. 删除博文和评论
	 */

	// 1. 读取blogId
	blogID := req.URL.Query().Get("blogId")
	if blogID == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "blogId不能为空"})
		return
	}

	//验证权限(当前用户是否是博文拥有者)
	var b entity.Blog
	err := mgoOp.FindId("Blog", blogID, &b)
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "博文不存在", "error": err.Error()})
		return
	}
	u := sess.Get("user").(entity.User)
	if u.ID != b.AuthorRef.Id {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "权限不足"})
		return
	}

	// 3. 删除博文和评论
	mgoOp.RemoveId("Blog", blogID)
	mgoOp.RemoveId("BlogComment", blogID)
	r.JSON(200, map[string]interface{}{"success": true, "desc": "删除成功"})
	return
}
