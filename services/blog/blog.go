package blog

import (
	"net/http"
	"strconv"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/asaskevich/govalidator"
	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model"
	"github.com/caoyongzheng/gotest/services/blog/entity"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/caoyongzheng/gotest/services/user/model/user"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
)

func init() {
	env.Router.Group("/api/blog", func(r martini.Router) {
		r.Post("/new", auth.Great(1), binding.Bind(entity.Blog{}), verifyNewBlog, NewBlog)
		r.Get("/page", GetBlogPage)
		r.Get("", GetBlog)
		r.Put("", auth.Great(1), binding.Bind(entity.Blog{}), verifyPutBlog, PutBlog)
	})
}

type Result map[string]interface{}

//NewBlog 新建博客
func NewBlog(b entity.Blog, sess session.Store, r render.Render) {
	u := sess.Get("user").(userM.User)
	b.UserID = u.ID
	b.AuthorName = u.Name
	err := entity.Add(b)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "新建博客失败", nil))
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
	if pagesize < 1 {
		r.JSON(200, Result{"success": false, "desc": "每页大小pagesize不能小于1"})
		return
	}

	// 2. 查询blog对应分页数据([]Blog)，获取每一博文对应user数据(name, headerIcon),然后和博文组合返回
	var blogPage []Result //博客分页
	var total int         //博文总的条数
	mgoOp.WithC("Blog", func(c *mgo.Collection) {
		total, err = c.Find(nil).Count()
		err = c.Find(nil).Skip((page - 1) * pagesize).Limit(pagesize).All(&blogPage) //获取分页数据
		if err != nil {
			r.JSON(200, Result{"success": false, "desc": "获取分页数据失败", "error": err.Error()})
			return
		}
		for _, b := range blogPage {
			var u userM.User
			var blogComment entity.BlogComment
			c.Database.C("User").FindId(b["userId"]).One(&u)
			c.Database.C("BlogComment").FindId(b["_id"]).Select(bson.M{
				"size": 1,
			}).One(&blogComment)
			b["authorIcon"] = u.HeaderIcon
			b["authorName"] = u.Name
			b["commentSize"] = blogComment.Size
		}
	})

	r.JSON(200, Result{"success": true, "desc": "获取分页数据成功", "elements": blogPage, "total": total})
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
	var data Result
	var err error
	mgoOp.WithC("Blog", func(c *mgo.Collection) {
		err = c.FindId(blogID).One(&data)
	})
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "博客不存在", nil))
		return
	}

	data["authorIcon"] = userM.GetByID(data["userId"].(string)).HeaderIcon
	data["commentSize"] = entity.GetSize(blogID)
	r.JSON(200, model.NewResult(true, 0, "获取成功", data))
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
	if originBlog.UserID != sess.Get("user").(userM.User).ID {
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
