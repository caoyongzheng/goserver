package user

import (
	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/test/model"
	"github.com/caoyongzheng/test/services/user/model/user"
	"github.com/martini-contrib/render"
)

//SignIn 登录
func SignIn(postedUser userM.User, r render.Render, sess session.Store) {
	u, err := userM.GetByUsernameAndPassword(postedUser.Username, postedUser.Password)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, err.Error(), nil))
		return
	}
	sess.Set("user", u)
	r.JSON(200, model.NewResult(true, 0, "登录成功", nil))
}

//SignUp 注册
func SignUp(postedUser userM.User, r render.Render, sess session.Store) {
	err := userM.Add(postedUser)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, err.Error(), nil))
	} else {
		u, err := userM.GetByUsernameAndPassword(postedUser.Username, postedUser.Password)
		if err != nil {
			r.JSON(200, model.NewResult(false, 0, err.Error(), nil))
			return
		}
		sess.Set("user", u)
		r.JSON(200, model.NewResult(true, 0, "注册成功", nil))
	}
}

//SignOut 登出
func SignOut(r render.Render, sess session.Store) {
	sess.Delete("user")
	r.JSON(200, model.NewResult(true, 0, "登出成功", nil))
}

//GetSessionUser 获取当前会话用户
func GetSessionUser(r render.Render, sess session.Store) {
	u := sess.Get("user")
	if u == nil {
		r.JSON(200, model.NewResult(false, 0, "用户不存在", nil))
		return
	}
	uu := u.(*userM.User)
	uu.Password = ""
	r.JSON(200, model.NewResult(true, 0, "用户存在", uu))
}
