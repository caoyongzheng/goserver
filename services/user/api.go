package user

import (
	"github.com/caoyongzheng/goserver/env"
	"github.com/caoyongzheng/goserver/model/entity"
	"github.com/caoyongzheng/goserver/services/user/auth"
	"github.com/martini-contrib/binding"
)

func init() {
	env.R.Post("/signin", binding.Bind(entity.User{}), SignIn) //用户登录
	env.R.Post("/signup", binding.Bind(entity.User{}), SignUp) //用户注册
	env.R.Get("/signout", SignOut)                             //用户登出
	env.R.Get("/tokenUser", getTokenUser)

	env.R.Put("/user/headerIcon", auth.RequireUser, SetHeaderIcon)
}
