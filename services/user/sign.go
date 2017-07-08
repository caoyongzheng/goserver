package user

import (
	"crypto/md5"
	"fmt"
	"net/http"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/caoyongzheng/goserver/context"
	"github.com/caoyongzheng/goserver/env"
	"github.com/caoyongzheng/goserver/model/entity"
	"github.com/martini-contrib/render"
)

//SignIn 登录
func SignIn(u entity.User, r render.Render, mgoOp *env.MgoOp, ctx *context.Context) {
	/**
	 * 1. 对用户password进行hash加密
	 * 2. 查找数据库，验证Username和password 是否匹配
	 * 3. 添加用户到当前会话
	 */

	// 1. 对用户password进行hash加密
	u.Password = fmt.Sprintf("%x", md5.Sum([]byte(u.Password)))

	// 2. 查找数据库，验证Username和password 是否匹配
	var err error
	mgoOp.WithC("User", func(c *mgo.Collection) {
		err = c.Find(bson.M{"username": u.Username, "password": u.Password}).
			Select(bson.M{"password": 0}).One(&u)
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": err.Error()})
		return
	}

	// 3. 添加用户到当前会话
	token, _ := ctx.P.New()
	ctx.P.SetItem(token, "userId", u.ID)
	r.JSON(200, map[string]interface{}{"success": true, "desc": "登录成功", "token": token})
}

//SignUp 注册
func SignUp(u entity.User, r render.Render, mgoOp *env.MgoOp, ctx *context.Context) {
	/**
	 * 1. 验证提交用户(username, password)
	 * 2. 对用户password进行hash加密
	 * 3. 添加用户到数据库
	 * 3. 添加用户到当前会话
	 */

	// 1. 验证提交用户(username, password)
	if u.Username == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "Username不能为空"})
		return
	}
	if u.Password == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "Password不能为空"})
		return
	}

	// 2. 对用户password进行hash加密
	u.Password = fmt.Sprintf("%x", md5.Sum([]byte(u.Password)))

	// 3 验证用户名是否已存在
	var n int
	mgoOp.WithC("User", func(c *mgo.Collection) {
		n, _ = c.Find(bson.M{"username": u.Username}).Count()
	})
	if n > 0 {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "用户名已存在"})
		return
	}

	// 4. 添加用户到数据库
	var err error
	mgoOp.WithC("User", func(c *mgo.Collection) {
		u.ID = bson.NewObjectId().Hex()
		u.Role = entity.Normal
		err = c.Insert(&u)
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "添加用户到数据库失败", "error": err.Error()})
		return
	}

	// 生成Token记录
	token, _ := ctx.P.New()
	ctx.P.SetItem(token, "userId", u.ID)
	r.JSON(200, map[string]interface{}{"success": true, "desc": "注册成功", "token": token})
}

//SignOut 登出
func SignOut(r render.Render, req *http.Request, ctx *context.Context) {
	token := req.Header.Get("token")
	ctx.P.Del(token)
	r.JSON(200, map[string]interface{}{"success": true, "desc": "登出成功"})
}

func getTokenUser(req *http.Request, r render.Render, mgoOps *env.MgoOp, ctx *context.Context) {
	userID := ctx.GetUserID()
	if userID == "" {
		r.JSON(200, nil)
		return
	}
	var u entity.User
	err := mgoOps.FindId("User", userID, &u)
	if err != nil {
		r.JSON(200, nil)
		return
	}

	r.JSON(200, map[string]interface{}{
		"userId":     u.ID,
		"headerIcon": u.HeaderIcon,
		"username":   u.Username,
	})
}
