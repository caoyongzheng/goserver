package blog

import (
	"net/http"
	"strconv"

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
	env.Router.Group("/api/blogComment", func(r martini.Router) {
		r.Post("", auth.Great(1), binding.Bind(PostComment{}), verifyAddComment, AddComment)
		r.Get("", verifyPageQuery, Get)
	})
}

//PostComment 添加评论
type PostComment struct {
	model.Comment
	BlogID string `json:"blogId" form:"blogId"`
}

//AddComment 添加评论
func AddComment(pc PostComment, sess session.Store, r render.Render, req *http.Request) {
	u := sess.Get("user").(userM.User)
	pc.UserID = u.ID
	newC, err := entity.AddCommont(pc.BlogID, pc.Comment)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "新增评论失败", nil))
	}
	r.JSON(200, model.NewResult(true, 0, "新增评论成功", newC))
}

func verifyAddComment(pc PostComment, req *http.Request, r render.Render) {
	if pc.Content == "" {
		r.JSON(200, model.NewResult(false, 0, "评论不能为空", nil))
	}
	exist := entity.IsExist(pc.BlogID)
	if !exist {
		r.JSON(200, model.NewResult(false, 0, "博客不存在", nil))
		return
	}
}

//Comment 评论
type Comment struct {
	model.Comment
	HeaderIcon string `json:"headerIcon"`
	Name       string `json:"name"`
}

//Get 获取博客评论
func Get(r render.Render, req *http.Request) {
	blogID := req.URL.Query().Get("blogId")
	page, _ := strconv.Atoi(req.URL.Query().Get("page"))
	pagesize, _ := strconv.Atoi(req.URL.Query().Get("pagesize"))

	bc, _ := entity.GetPage(blogID, page, pagesize)
	data := make(map[string]interface{})
	comments := make([]Comment, len(bc.Comments))
	for i, c := range bc.Comments {
		comments[i].Comment = c
		u := userM.GetByID(c.UserID)
		comments[i].HeaderIcon = u.HeaderIcon
		comments[i].Name = u.Name
	}
	data["size"] = bc.Size
	data["comments"] = comments
	r.JSON(200, model.NewResult(true, 0, "", data))
}

func verifyPageQuery(r render.Render, req *http.Request) {
	blogID := req.URL.Query().Get("blogId")
	if blogID == "" {
		r.JSON(200, model.NewResult(false, 0, "博客id不能为空", nil))
		return
	}

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
}
