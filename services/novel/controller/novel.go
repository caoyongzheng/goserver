package novelC

import (
	"time"

	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/env"
	novel "github.com/caoyongzheng/gotest/services/novel/model"
	"github.com/caoyongzheng/gotest/services/user/auth"
	"github.com/caoyongzheng/gotest/services/user/model/user"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Result map[string]interface{}

func init() {
	env.Router.Group("/api/novel", func(r martini.Router) {
		r.Post("/add", auth.Great(1), binding.Bind(novel.Novel{}), AddNovel)
		r.Get("/userId/:userId", GetUserNovels)
		r.Get("/catalog/:novelId", GetCatalog)
		r.Get("/section/:sectionId", GetSection)
		r.Post("/section", auth.Great(1), binding.Bind(novel.NovelSection{}), AddSection)
		r.Put("/section", auth.Great(1), binding.Bind(novel.NovelSection{}), EditSection)
	})
}

// EditSection 修改小说章节
func EditSection(s novel.NovelSection, r render.Render, sess session.Store, mgoOp env.MgoOp) {
	/**
	 * 1. 章节数据格式是否符合(ID, Name, Paragraphs)
	 * 2. 用户是否有权限修改章节
	 * 3. 修改章节到数据库
	 */

	// 1. 章节数据格式是否符合(ID, Name, Paragraphs)
	if s.ID == "" {
		r.JSON(200, Result{"success": false, "desc": "章节ID不能为空"})
		return
	}
	if s.Name == "" {
		r.JSON(200, Result{"success": false, "desc": "章节Name不能为空"})
		return
	}
	if s.Paragraphs == nil {
		r.JSON(200, Result{"success": false, "desc": "章节Paragraphs不能为空"})
		return
	}

	// 2. 用户是否有权限修改章节
	u := sess.Get("user").(userM.User)
	if u.ID != s.UserID {
		r.JSON(200, Result{"success": false, "desc": "无权限修改章节"})
		return
	}

	// 3. 修改章节到数据库
	var err error
	mgoOp.WithC("NovelSection", func(c *mgo.Collection) {
		err = c.UpdateId(s.ID, bson.M{
			"name":       s.Name,
			"paragraphs": s.Paragraphs,
		})
	})
	if err != nil {
		r.JSON(200, Result{"success": false, "desc": "修改章节失败", "error": err.Error()})
		return
	}
	r.JSON(200, Result{"success": true, "desc": "修改章节成功", "section": s})
}

// AddSection 添加小说章节
func AddSection(mgoOp env.MgoOp, s novel.NovelSection, r render.Render, sess session.Store) {
	/**
	 * 1. 章节数据格式是否符合 (NovelID, Name, Paragraphs)
	 * 2. 章节所属小说是否存在
	 * 3. 用户是否有权限添加章节
	 * 4. 添加章节到数据库
	 */

	// 1. 章节数据格式是否符合(novelID, Name, Paragraphs)
	if s.NovelID == "" {
		r.JSON(200, Result{"success": false, "desc": "章节NovelID不能为空"})
		return
	}
	if s.Name == "" {
		r.JSON(200, Result{"success": false, "desc": "章节Name不能为空"})
		return
	}
	if s.Paragraphs == nil {
		r.JSON(200, Result{"success": false, "desc": "章节Paragraphs不能为空"})
		return
	}

	// 2. 小说是否存在
	var err error
	var n novel.Novel
	mgoOp.WithC("NovelSection", func(c *mgo.Collection) {
		err = c.FindId(s.NovelID).Select(bson.M{"userId": 1}).One(&n)
	})
	if err != nil {
		r.JSON(200, Result{"success": false, "desc": "小说不存在"})
		return
	}

	// 3. 用户是否有权限添加章节(判断小说的userId 是否与 当前会话用户Id 一致)
	u := sess.Get("user").(userM.User)
	if u.ID != n.UserID {
		r.JSON(200, Result{"success": false, "desc": "无权限修改小说"})
		return
	}

	// 4. 添加章节到数据库
	mgoOp.WithC("NovelSection", func(c *mgo.Collection) {
		s.ID = bson.NewObjectId().Hex()
		s.Time = time.Now()
		s.UserID = u.ID
		err = c.Insert(&s)
		if err != nil {
			return
		}
		c.Database.C("Novel").UpdateId(s.NovelID, bson.M{
			"$push": bson.M{"sections": s},
		})
	})
	if err != nil {
		r.JSON(200, Result{"success": false, "desc": "添加章节到数据库失败"})
		return
	}
	r.JSON(200, Result{"success": true, "desc": "添加成功", "section": s})
}

// GetSection 获取小说章节
func GetSection(params martini.Params, r render.Render) {
	s, err := novel.GetSection(params["sectionId"])
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": err.Error()})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "data:": s, "desc": "获取成功"})
	return
}

// GetCatalog 获取小说章节列表
func GetCatalog(params martini.Params, r render.Render) {
	novelID := params["novelId"]
	if novelID == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "novelId can not be empty"})
	}
	n, err := novel.GetCatalog(novelID)
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "can not find novel by novelID:" + novelID})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "data": n})
	return
}

// GetUserNovels 获取用户所有小说信息
func GetUserNovels(params martini.Params, r render.Render) {
	ns, _ := novel.GetByUserID(params["userId"])
	r.JSON(200, ns)
}

// AddNovel 添加小说
func AddNovel(n novel.Novel, sess session.Store, r render.Render) {
	if n.Author == "" || n.Name == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "小说名字和作者不能为空"})
		return
	}
	u := sess.Get("user").(userM.User)
	n.UserID = u.ID
	err := novel.Add(n)
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": err.Error()})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "desc": "新增书籍成功", "data": n})
	return
}
