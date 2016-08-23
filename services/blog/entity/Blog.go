package entity

import (
	"time"

	"github.com/caoyongzheng/gotest/env"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//ContentTypes 博文内容类型
var ContentTypes = []string{"markdown"}

//Blog 博文
type Blog struct {
	ID          string    `bson:"_id" json:"id" form:"id"`
	Title       string    `bson:"title" json:"title" form:"title"`
	Content     string    `bson:"content" json:"content" form:"content"`
	ContentType string    `bson:"contentType" json:"contentType" form:"contentType"`
	UserID      string    `bson:"userId" json:"userId" from:"userId"`
	ViewTimes   int       `bson:"viewTimes" json:"viewTimes" from:"viewTimes"`    //浏览次数
	AuthorName  string    `bson:"authorName" json:"authorName" form:"authorName"` //作者姓名
	CreateDate  time.Time `bson:"createDate" json:"createDate" form:"createDate"` //创建日期
	UpdateDate  time.Time `bson:"updateDate" json:"updateDate" form:"updateDate"` //修改日期
}

//Add 新增博客
func Add(blog Blog) (err error) {
	blog.ID = bson.NewObjectId().Hex()
	blog.CreateDate = time.Now()
	blog.UpdateDate = time.Now()
	query := func(c *mgo.Collection) {
		err = c.Insert(&blog)
	}
	env.WitchCollection("Blog", query)
	return
}

//Edit 修改博客
func Edit(b Blog) (err error) {
	b.UpdateDate = time.Now()
	query := func(c *mgo.Collection) {
		err = c.Update(bson.M{"_id": b.ID}, bson.M{"$set": bson.M{
			"title":      b.Title,
			"content":    b.Content,
			"updateDate": b.UpdateDate,
		}})
	}
	env.WitchCollection("Blog", query)
	return
}

//UpdateViews 更新浏览次数
func UpdateViews(id string) {
	query := func(c *mgo.Collection) {
		c.Update(bson.M{"_id": id}, bson.M{"$inc": bson.M{
			"viewTimes": 1,
		}})
	}
	env.WitchCollection("Blog", query)
	return
}

//GetByID 获取博客
func GetByID(blogID string) (b Blog, err error) {
	query := func(c *mgo.Collection) {
		err = c.FindId(blogID).One(&b)
	}
	env.WitchCollection("Blog", query)
	return
}

//IsExist 根据ID判断是否存在
func IsExist(id string) bool {
	var n int
	query := func(c *mgo.Collection) {
		n, _ = c.Find(bson.M{"_id": id}).Count()
	}
	env.WitchCollection("Blog", query)
	return n == 1
}