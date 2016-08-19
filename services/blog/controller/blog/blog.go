package blogC

import (
	"net/http"
	"strconv"

	"github.com/asaskevich/govalidator"
	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model"
	"github.com/caoyongzheng/gotest/services/blog/model/blog"
	"github.com/caoyongzheng/gotest/services/blog/model/blogComment"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/caoyongzheng/gotest/services/user/model/user"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
	"gopkg.in/mgo.v2/bson"
)

func init() {
	env.Router.Group("/api/blog", func(r martini.Router) {
		r.Post("/new", auth.Great(1), binding.Bind(blogM.Blog{}), verifyNewBlog, NewBlog)
		r.Get("/page", GetPage)
		r.Get("", GetBlog)
		r.Put("", auth.Great(1), binding.Bind(blogM.Blog{}), verifyPutBlog, PutBlog)
	})
}

//NewBlog 新建博客
func NewBlog(b blogM.Blog, sess session.Store, r render.Render) {
	u := sess.Get("user").(userM.User)
	b.UserID = u.ID
	b.AuthorName = u.Name
	err := blogM.Add(b)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "新建博客失败", nil))
	}
	r.JSON(200, model.NewResult(true, 0, "新建博客成功", nil))
}

func verifyNewBlog(b blogM.Blog, r render.Render) {
	if govalidator.IsNull(b.Title) {
		r.JSON(200, model.NewResult(false, 0, "博客标题不能为空", nil))
		return
	}
	if govalidator.IsNull(b.Content) {
		r.JSON(200, model.NewResult(false, 0, "博客内容不能为空", nil))
		return
	}
}

//Elem 返回blog元素
type Elem struct {
	blogM.Blog
	HeaderIcon  string `json:"headerIcon"`
	CommentSize int    `json:"commentSize"`
}

//GetPage 获取分页
func GetPage(req *http.Request, r render.Render) {
	//verify request URL Query
	page, err := strconv.Atoi(req.URL.Query().Get("page"))
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, err.Error(), nil))
		return
	}
	if page < 1 {
		r.JSON(200, model.NewResult(false, 1, "page不能小于1", nil))
		return
	}
	pagesize, err := strconv.Atoi(req.URL.Query().Get("pagesize"))
	if err != nil {
		r.JSON(200, model.NewResult(false, 2, err.Error(), nil))
		return
	}
	if pagesize < 1 {
		r.JSON(200, model.NewResult(false, 3, "page不能小于1", nil))
		return
	}

	// query
	var query bson.M
	userId := req.URL.Query().Get("userId")
	if userId != "" {
		query = bson.M{"userId": userId}
	}
	//获取博客分页
	pageResult, err := blogM.GetPage(query, page, pagesize)
	if err != nil {
		r.JSON(200, model.NewResult(false, 4, err.Error(), nil))
		return
	}
	elems := pageResult.Elements.([]blogM.Blog)
	newElems := make([]Elem, len(elems))
	for k, e := range elems {
		newElems[k].Blog = e
		newElems[k].HeaderIcon = userM.GetByID(e.UserID).HeaderIcon
		newElems[k].CommentSize = blogCommentM.GetSize(e.ID)
	}
	pageResult.Elements = newElems
	r.JSON(200, model.NewResult(true, 0, "获取成功", pageResult))
}

//GetBlog 获取博客
func GetBlog(req *http.Request, r render.Render) {
	blogID := req.URL.Query().Get("blogId")
	if blogID == "" {
		r.JSON(200, model.NewResult(false, 0, "blogID不能为空", nil))
		return
	}
	blogM.UpdateViews(blogID)
	b, err := blogM.GetByID(blogID)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "博客不存在", nil))
		return
	}
	var blogElem Elem
	blogElem.Blog = b
	blogElem.HeaderIcon = userM.GetByID(b.UserID).HeaderIcon
	blogElem.CommentSize = blogCommentM.GetSize(b.ID)
	r.JSON(200, model.NewResult(true, 0, "获取成功", blogElem))
}

//PutBlog 修改博客（字段为：title,content）
func PutBlog(b blogM.Blog, r render.Render) {
	err := blogM.Edit(b)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "修改博客失败", nil))
	}
	r.JSON(200, model.NewResult(true, 0, "修改博客成功", nil))
}

func verifyPutBlog(b blogM.Blog, r render.Render, sess session.Store) {
	originBlog, err := blogM.GetByID(b.ID)
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
