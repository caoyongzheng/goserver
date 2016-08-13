package novelC

import (
	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/env"
	novel "github.com/caoyongzheng/gotest/services/novel/model"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/caoyongzheng/gotest/services/user/model/user"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
)

func init() {
	env.Router.Group("/api/novel", func(r martini.Router) {
		r.Post("/add", auth.Great(1), binding.Bind(novel.Novel{}), AddNovel)
	})
}

func AddNovel(n novel.Novel, sess session.Store) map[string]interface{} {
	if n.Author == "" || n.Name == "" {
		return map[string]interface{}{"success": false, "desc": "小说名字和作者不能为空"}
	}
	u := sess.Get("user").(*userM.User)
	n.UserID = u.ID
	err := novel.Add(n)
	if err != nil {
		return map[string]interface{}{"success": false, "desc": err.Error()}
	}
	return map[string]interface{}{"success": true, "desc": "新增书籍成功", "data": n}
}
