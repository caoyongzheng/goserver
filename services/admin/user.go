package admin

import (
	"crypto/md5"
	"fmt"
	"net/http"
	"strconv"

	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func init() {
	env.Router.Group("/api/admin", func(r martini.Router) {
		r.Get("/userpage", auth.Great(entity.Admin), getUserPage)
		r.Delete("/user/:userId", auth.Great(entity.Admin), delUser)
		r.Post("/user", auth.Great(entity.Admin), binding.Bind(entity.User{}), addUser)
	})
}

func addUser(u entity.User, r render.Render, mgoOp *env.MgoOp) {
	/**
	 * 1. 验证提交用户(username, password)
	 * 2. 对用户password进行hash加密
	 * 3. 添加用户到数据库
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
	r.JSON(200, map[string]interface{}{"success": true, "desc": "添加成功"})
}

func delUser(params martini.Params, mgoOp *env.MgoOp, r render.Render) {
	err := mgoOp.RemoveId("User", params["userId"])
	if err != nil {
		r.JSON(200, false)
		return
	}
	r.JSON(200, true)
}

func getUserPage(req *http.Request, r render.Render, mgoOp *env.MgoOp) {
	/**
	 * 1. 获取页码('page')和每页大小('pagesize'),如不存在则返回错误
	 * 2. 查询user对应分页数据([]user)
	 */

	// 1. 获取页码('page')和每页大小('pagesize'),如不存在则返回错误
	page, err := strconv.Atoi(req.URL.Query().Get("page"))
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "获取页码page失败", "error": err.Error()})
		return
	}
	if page < 1 {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "页码page不能小于1"})
		return
	}
	pagesize, err := strconv.Atoi(req.URL.Query().Get("pagesize"))
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "获取每页大小pagesize失败", "error": err.Error()})
		return
	}
	if pagesize < 1 && pagesize <= 50 {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "每页大小pagesize不能小于1和大于50 "})
		return
	}

	// 2. 查询user对应分页数据([]user)
	userPage := struct {
		Elements []entity.User `json:"elements"`
		Total    int           `json:"total"`    //总的条数
		Page     int           `json:"page"`     //页码
		Pagesize int           `json:"pagesize"` //每页容量
	}{Pagesize: pagesize}

	//query
	query := bson.M{}
	mgoOp.WithDB(func(db *mgo.Database) {
		userPage.Total, err = db.C("User").Find(query).Count()
		err = db.C("User").Find(query).Skip((page - 1) * pagesize).Limit(pagesize).All(&userPage.Elements) //获取分页数据
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "获取分页数据失败", "error": err.Error()})
		return
	}
	maxPage := userPage.Total / pagesize
	if userPage.Total%pagesize > 0 {
		maxPage++
	}
	if maxPage < page {
		page = maxPage
	}
	userPage.Page = page
	r.JSON(200, map[string]interface{}{"success": true, "desc": "获取分页数据成功", "data": userPage})
	return
}
