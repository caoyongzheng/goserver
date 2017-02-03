package user

import (
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/martini-contrib/binding"
)

func init() {
	env.R.Post("/signin", binding.Bind(entity.User{}), SignIn) //用户登录
	env.R.Post("/signup", binding.Bind(entity.User{}), SignUp) //用户注册
	env.R.Get("/signout", SignOut)                             //用户登出
	env.R.Get("/tokenUser", getTokenUser)

	env.R.Put("/user/headerIcon", auth.RequireUser, SetHeaderIcon)
}
