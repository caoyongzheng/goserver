package user

import (
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
)

func init() {
	env.R.Group("/api/user", func(r martini.Router) {
		r.Post("/signin", binding.Bind(entity.User{}), SignIn) //用户登录
		r.Post("/signup", binding.Bind(entity.User{}), SignUp) //用户注册
		r.Get("/signout", SignOut)                             //用户登出
	})
	env.R.Get("/tokenUser", getTokenUser)
}
