package novel

import (
	"errors"
	"time"

	"github.com/caoyongzheng/gotest/env"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Novel 小说
type Novel struct {
	ID          string         `bson:"_id" json:"id" form:"id"`
	Name        string         `bson:"name" json:"name" form:"name"`                      //书籍名称
	Author      string         `bson:"author" json:"author" form:"author"`                //书籍作者
	CreateDate  time.Time      `bson:"createDate" json:"createDate" form:"createDate"`    //创建时间
	UserID      string         `bson:"userId" json:"userId" form:"userId"`                //书籍录入者，拥有修改权限
	SectionKeys []string       `bson:"sectionKeys" json:"sectionKeys" form:"sectionKeys"` //书籍所有章节key值
	Sections    []NovelSection `bson:"-" json:"sections" form:"sections"`                 //书籍所有章节
}

// Section 章节
type NovelSection struct {
	ID         string    `bson:"_id" json:"id" form:"id"`
	NovelID    string    `bson:"novelId" json:"novelId" form:"novelId"`
	Name       string    `bson:"name" json:"name" form:"name"`                   //章节名称
	CreateDate time.Time `bson:"createDate" json:"createDate" form:"createDate"` //创建时间
	Content    string    `bson:"content" json:"content" form:"content"`          //章节内容
	UserID     string    `bson:"userId" json:"userId" form:"userId"`             //章节录入者，拥有删除权限
}

func Get(id string) (n Novel, err error) {
	if id == "" {
		err = errors.New("id is nil")
		return
	}
	query := func(c *mgo.Collection) {
		err = c.FindId(id).One(&n)
	}
	env.WitchCollection("Novel", query)
	return
}

func GetByUserID(userID string) (ns []Novel, err error) {
	query := func(c *mgo.Collection) {
		err = c.Find(bson.M{"userId": userID}).All(&ns)
	}
	env.WitchCollection("Novel", query)
	return
}

//GetCatalog 获取小说所有章节目录
func GetCatalog(id string) (n Novel, err error) {
	env.WitchCollection("Novel", func(c *mgo.Collection) {
		err = c.FindId(id).One(&n)
	})
	if err != nil {
		return
	}
	env.WitchCollection("NovelSection", func(c *mgo.Collection) {
		err = c.Find(bson.M{"novelId": id}).Select(bson.M{"paragraphs": 0}).All(&n.Sections)
	})
	return
}
