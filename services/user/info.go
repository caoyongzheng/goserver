package user

import (
	"net/http"

	"github.com/caoyongzheng/gotest/context"
	"github.com/caoyongzheng/gotest/env"
	"github.com/martini-contrib/render"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//SetHeaderIcon 设置用户的头像
func SetHeaderIcon(req *http.Request, ctx *context.Context, r render.Render, mgoOp *env.MgoOp) {
	req.ParseForm()
	filename := req.FormValue("filename")

	u := ctx.GetUser()
	var err error
	mgoOp.WithC("User", func(c *mgo.Collection) {
		err = c.UpdateId(u.ID, bson.M{
			"$set": bson.M{"headerIcon": filename},
		})
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "更新头像失败"})
		return
	}
	u.HeaderIcon = filename
	r.JSON(200, map[string]interface{}{"success": true, "desc": "更新头像成功", "data": filename})
}
