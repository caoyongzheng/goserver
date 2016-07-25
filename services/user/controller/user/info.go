package user

import (
	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/test/model"
	"github.com/caoyongzheng/test/services/user/model/user"
	"github.com/martini-contrib/render"
	"net/http"
)

//SetHeaderIcon 设置用户的头像
func SetHeaderIcon(req *http.Request, sess session.Store, r render.Render) {
	req.ParseForm()
	filename := req.FormValue("filename")

	u := sess.Get("user").(*userM.User)
	err := u.UpdateHeaderIcon(filename)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, "更新头像失败", nil))
		return
	}
	u.HeaderIcon = filename
	r.JSON(200, model.NewResult(true, 0, "更新头像成功", filename))
}
