package user

import (
	"net/http"

	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/model"
	"github.com/caoyongzheng/gotest/services/user/model/user"
	"github.com/martini-contrib/render"
)

//SetHeaderIcon 设置用户的头像
func SetHeaderIcon(req *http.Request, sess session.Store, r render.Render) {
	req.ParseForm()
	filename := req.FormValue("filename")

	u := sess.Get("user").(userM.User)
	err := u.UpdateHeaderIcon(filename)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "更新头像失败", nil))
		return
	}
	u.HeaderIcon = filename
	sess.Set("user", u)
	r.JSON(200, model.NewResult(true, 0, "更新头像成功", filename))
}
