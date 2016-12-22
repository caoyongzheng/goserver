package entity

import (
	"time"

	"github.com/caoyongzheng/gotest/env"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func init() {
	var err error
	env.MgoOpInst.WithC("Blog", func(c *mgo.Collection) {
		index := mgo.Index{
			Key:    []string{"-updateDate"},
			Unique: true,
			Sparse: true,
		}
		err = c.EnsureIndex(index)
	})
	if err != nil {
		panic(err)
	}
}

//ContentTypes 博文内容类型
var ContentTypes = []string{"markdown"}

//Blog 博文
type Blog struct {
	ID          string    `bson:"_id" json:"id" form:"id"`
	Title       string    `bson:"title" json:"title" form:"title"`
	Content     string    `bson:"content" json:"content" form:"content"`
	ContentType string    `bson:"contentType" json:"contentType" form:"contentType"`
	ViewTimes   int       `bson:"viewTimes" json:"viewTimes" from:"viewTimes"`    //浏览次数
	CreateDate  time.Time `bson:"createDate" json:"createDate" form:"createDate"` //创建日期
	UpdateDate  time.Time `bson:"updateDate" json:"updateDate" form:"updateDate"` //修改日期
	AuthorRef   mgo.DBRef `bson:"authorRef" json:"-" form:"-"`                    //作者
	UserId      string    `bson:"userId" json:"userId" form:"userId"`             // 用户ID
	Visibility  int       `bson:"visibility" json:"visibility" form:"visibility"` //可见性 0:对外可见 1:作者可见
}

func (b *Blog) GetCollectionName() string {
	return "Blog"
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
			"visibility": b.Visibility,
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
