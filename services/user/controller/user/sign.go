package user

import (
	"crypto/md5"
	"fmt"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/martini-contrib/render"
)

//SignIn 登录
func SignIn(u entity.User, r render.Render, sess session.Store, mgoOp *env.MgoOp) {
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
	sess.Set("user", u)
	r.JSON(200, map[string]interface{}{"success": true, "desc": "登录成功"})
}

//SignUp 注册
func SignUp(u entity.User, r render.Render, sess session.Store, mgoOp *env.MgoOp) {
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

	// 3. 添加用户到数据库
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
	r.JSON(200, map[string]interface{}{"success": true, "desc": "注册成功"})
}

//SignOut 登出
func SignOut(r render.Render, sess session.Store) {
	sess.Delete("user")
	r.JSON(200, map[string]interface{}{"success": true, "desc": "登出成功"})
}

//GetSessionUser 获取当前会话用户
func GetSessionUser(r render.Render, sess session.Store) {
	u := sess.Get("user")
	if u == nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "用户不存在"})
		return
	}
	uu := u.(entity.User)
	uu.Password = ""
	r.JSON(200, map[string]interface{}{"success": true, "desc": "用户存在", "data": uu})
}
