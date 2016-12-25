package novel

import (
	"time"

	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/env"
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
	env.R.Group("/api/novel", func(r martini.Router) {
		r.Post("", auth.Great(1), binding.Bind(Novel{}), AddNovel)
		r.Get("/userId/:userId", GetUserNovelsHandler)
		r.Get("/catalog/:novelId", GetCatalogHandler)
		r.Get("/section/:sectionId", GetSection)
		r.Post("/section", auth.Great(1), binding.Bind(NovelSection{}), AddSection)
		r.Put("/section", auth.Great(1), binding.Bind(NovelSection{}), EditSection)
	})
}

// EditSection 修改小说章节
func EditSection(s NovelSection, r render.Render, sess session.Store, mgoOp env.MgoOp) {
	/**
	 * 1. 章节数据格式是否符合(ID, Name, Content)
	 * 2. 用户是否有权限修改章节
	 * 3. 修改章节到数据库
	 */

	// 1. 章节数据格式是否符合(ID, Name, Content)
	if s.ID == "" {
		r.JSON(200, Result{"success": false, "desc": "章节ID不能为空"})
		return
	}
	if s.Name == "" {
		r.JSON(200, Result{"success": false, "desc": "章节Name不能为空"})
		return
	}
	if s.Content == "" {
		r.JSON(200, Result{"success": false, "desc": "章节Content不能为空"})
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
			"name":    s.Name,
			"content": s.Content,
		})
	})
	if err != nil {
		r.JSON(200, Result{"success": false, "desc": "修改章节失败", "error": err.Error()})
		return
	}
	r.JSON(200, Result{"success": true, "desc": "修改章节成功", "section": s})
}

// AddSection 添加小说章节
func AddSection(mgoOp env.MgoOp, s NovelSection, r render.Render, sess session.Store) {
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
	if s.Content == "" {
		r.JSON(200, Result{"success": false, "desc": "章节Content不能为空"})
		return
	}

	// 2. 小说是否存在
	var err error
	var n Novel
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
		s.CreateDate = time.Now()
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
func GetSection(params martini.Params, r render.Render, mgoOp *env.MgoOp) {
	var sec NovelSection
	var err error
	mgoOp.WithC("NovelSection", func(c *mgo.Collection) {
		err = c.FindId(params["sectionId"]).One(&sec)
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": err.Error()})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "data:": sec, "desc": "获取成功"})
	return
}

// GetCatalog 获取小说章节列表
func GetCatalogHandler(params martini.Params, r render.Render) {
	novelID := params["novelId"]
	if novelID == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "novelId can not be empty"})
	}
	n, err := GetCatalog(novelID)
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "can not find novel by novelID:" + novelID})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "data": n})
	return
}

// GetUserNovels 获取用户所有小说信息
func GetUserNovelsHandler(params martini.Params, r render.Render) {
	ns, _ := GetByUserID(params["userId"])
	r.JSON(200, ns)
}

// AddNovel 添加小说
func AddNovel(n Novel, sess session.Store, r render.Render, mgoOp *env.MgoOp) {
	/**
	 * 1. 小说数据格式是否符合 (Name, Author)
	 * 2. 添加小说到数据库
	 */

	// 1. 小说数据格式是否符合 (Name, Author)
	if n.Name == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "小说Name不能为空"})
		return
	}
	if n.Author == "" {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "小说Author不能为空"})
		return
	}

	// 2. 添加小说到数据库
	u := sess.Get("user").(userM.User)
	var err error
	mgoOp.WithC("Novel", func(c *mgo.Collection) {
		n.ID = bson.NewObjectId().Hex()
		n.UserID = u.ID
		n.CreateDate = time.Now()
		err = c.Insert(&n)
	})
	if err != nil {
		r.JSON(200, map[string]interface{}{"success": false, "desc": "添加小说失败", "err": err.Error()})
		return
	}
	r.JSON(200, map[string]interface{}{"success": true, "desc": "新增书籍成功", "novel": n})
	return
}
