package user

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/caoyongzheng/gotest/context"
	"github.com/caoyongzheng/gotest/env"
	"github.com/martini-contrib/render"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//SetHeaderIcon 设置用户的头像
func SetHeaderIcon(req *http.Request, ctx *context.Context, r render.Render, mgoOp *env.MgoOp) {
	var err error
	payload := map[string]string{}
	err = json.NewDecoder(req.Body).Decode(&payload)
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "failed to parse payload"})
		return
	}

	headerIcon := payload["headerIcon"]
	u := ctx.GetUser()
	log.Println(u)
	mgoOp.WithC("User", func(c *mgo.Collection) {
		err = c.UpdateId(u.ID, bson.M{
			"$set": bson.M{"headerIcon": headerIcon},
		})
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "更新头像失败"})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "desc": "更新头像成功", "data": headerIcon})
}
