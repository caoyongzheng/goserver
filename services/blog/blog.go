package blog

import (
	"net/http"
	"strconv"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/asaskevich/govalidator"
	"github.com/caoyongzheng/gotest/context"
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
)

func init() {
	env.R.Group("/api/blog", func(r martini.Router) {
		r.Get("/page", GetBlogPage)
		// r.Delete("", auth.Great(entity.Normal), delBlog)
		r.Get("/title", getTitle)
	})
	env.R.Get("/blog", getPage)
	env.R.Get("/blog/:blogId", getBlog)
	env.R.Put("/blog/:blogId", auth.RequireUser, binding.Bind(entity.Blog{}), verifyPutBlog, PutBlog)
	env.R.Put("/blog/:blogId/viewtimes", viewTimes)
	env.R.Post("/blog", auth.RequireUser, binding.Bind(entity.Blog{}), verifyNewBlog, newBlog)
}

type Result map[string]interface{}

func getBlog(params martini.Params, r render.Render, mgoOp *env.MgoOp) {
	blogID := params["blogId"]
	data := make(map[string]interface{})
	var err error
	mgoOp.WithDB(func(db *mgo.Database) {
		var b entity.Blog
		var u entity.User
		err = db.C("Blog").FindId(blogID).One(&b)
		if err != nil {
			return
		}
		if b.UserId != "" {
			u.ID = b.UserId
		} else {
			u.ID = b.AuthorRef.Id.(string)
		}
		db.C("User").FindId(u.ID).Select(bson.M{
			"headerIcon": 1,
			"username":   1,
		}).One(&u)
		data["id"] = b.ID
		data["title"] = b.Title
		data["content"] = b.Content
		data["author"] = map[string]interface{}{
			"id": u.ID, "headerIcon": u.HeaderIcon, "username": u.Username,
		}
		data["views"] = b.ViewTimes
		data["update"] = b.UpdateDate
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{
			"success": false, "error": err.Error(),
		})
		return
	}
	r.JSON(200, map[string]interface{}{
		"success": true, "data": data,
	})
}

func getPage(req *http.Request, r render.Render, mgoOp *env.MgoOp) {
	var err error
	// 1. 获取参数：offset, limit, filter
	var offset, limit int
	offsetQ := req.URL.Query().Get("offset")
	if offsetQ != "" {
		offset, err = strconv.Atoi(req.URL.Query().Get("offsetQ"))
		if err != nil {
			r.JSON(200, Result{"success": false, "desc": "解析offset失败"})
			return
		}
	}

	limitQ := req.URL.Query().Get("offset")
	if limitQ != "" {
		limit, err = strconv.Atoi(req.URL.Query().Get("limit"))
		if err != nil {
			r.JSON(200, Result{"success": false, "desc": "解析limit失败"})
			return
		}
		if limit > 50 {
			r.JSON(200, Result{"success": false, "desc": "limit不能大于50"})
		}
	} else {
		limit = 15
	}
	// 2. 获取分页数据
	var total int
	var elems []map[string]interface{}

	filter := bson.M{}
	mgoOp.WithDB(func(db *mgo.Database) {
		total, err = db.C("Blog").Find(filter).Count()
		if err != nil {
			return
		}
		var blogs []entity.Blog
		err = db.C("Blog").Find(filter).Sort("-updateDate").Skip(offset).Limit(limit).All(&blogs)
		if err != nil {
			return
		}
		elems = make([]map[string]interface{}, len(blogs))
		for k, b := range blogs {
			elem := make(map[string]interface{})
			elem["id"] = b.ID
			elem["title"] = b.Title
			elem["content"] = b.Content
			var u entity.User
			if b.UserId != "" {
				u.ID = b.UserId
			} else {
				u.ID = b.AuthorRef.Id.(string)
			}
			db.C("User").FindId(u.ID).Select(bson.M{"headerIcon": 1, "username": 1}).One(&u)
			elem["author"] = map[string]interface{}{
				"id":         u.ID,
				"headerIcon": u.HeaderIcon,
				"username":   u.Username,
			}
			elem["views"] = b.ViewTimes
			elem["update"] = b.UpdateDate
			elems[k] = elem
		}
	})
	if err != nil {
		r.JSON(200, Result{"success": false, "desc": err.Error()})
		return
	}
	r.JSON(200, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"total": total,
			"blogs": elems,
		},
	})
}

func newBlog(b entity.Blog, ctx *context.Context, r render.Render, mgoOp *env.MgoOp) {
	userID := ctx.GetUserID()
	b.UserId = userID
	b.ID = bson.NewObjectId().Hex()
	b.CreateDate = time.Now()
	b.UpdateDate = time.Now()
	err := mgoOp.Insert(b.GetCollectionName(), &b)
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "msg": err.Error()})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "data": b.ID})
}

func viewTimes(p martini.Params, r render.Render, mgoOp *env.MgoOp) {
	blogID := p["blogId"]
	err := mgoOp.UpdateId("Blog", blogID, bson.M{"$inc": bson.M{"viewTimes": 1}})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "msg": err.Error()})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true})
}

func getTitle(r render.Render, mgoOp *env.MgoOp, req *http.Request) {
	// 1. 获取并验证blogID
	blogID := req.URL.Query().Get("blogId")
	if blogID == "" {
		r.JSON(200, map[string]interface{}{"success": false})
		return
	}
	// 2. 根据blogID查询title
	var b entity.Blog
	var err error
	mgoOp.WithC(b.GetCollectionName(), func(c *mgo.Collection) {
		err = c.FindId(blogID).Select(bson.M{"title": 1}).One(&b)
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "博文不存在"})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "data": b.Title})
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
	query := bson.M{"visibility": bson.M{"$eq": 0}}
	userId := req.URL.Query().Get("userId")
	if userId != "" {
		query["authorRef.$id"] = userId
	}

	//sort
	mgoOp.WithDB(func(db *mgo.Database) {
		total, err = db.C("Blog").Find(query).Count()
		err = db.C("Blog").Find(query).Sort("-updateDate").Skip((page - 1) * pagesize).Limit(pagesize).All(&blogElems) //获取分页数据
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

//PutBlog 修改博客（字段为：title,content）
func PutBlog(b entity.Blog, r render.Render) {
	err := entity.Edit(b)
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "msg": "修改博客失败"})
	}
	r.JSON(200, map[string]interface{}{"success": true, "msg": "修改博客成功"})
}

func verifyPutBlog(b entity.Blog, r render.Render, ctx *context.Context) {
	originBlog, err := entity.GetByID(b.ID)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "博客不存在，修改失败", nil))
		return
	}
	if originBlog.UserId != ctx.GetUserID() && originBlog.AuthorRef.Id != ctx.GetUserID() {
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
func delBlog(req *http.Request, r render.Render, mgoOp *env.MgoOp, ctx *context.Context) {
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
	u := ctx.GetUser()
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
