package imageM

import (
	"github.com/caoyongzheng/gotest/env"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func init() {
	var err error
	query := func(c *mgo.Collection) {
		index := mgo.Index{
			Key:    []string{"filename"},
			Unique: true,
			Sparse: true,
		}
		err = c.EnsureIndex(index)
	}
	env.WitchCollection("Image", query)
	if err != nil {
		panic(err)
	}
}

//Image 图片
type Image struct {
	ID       string `bson:"_id" json:"id" form:"id"`
	Desc     string `bson:"desc" json:"desc" form:"desc"`             //图片描述
	Filename string `bson:"filename" json:"filename" form:"filename"` //图片文件名，唯一
	URL      string `bson:"-" json:"url" form:"url"`
	FileType string `bson:"-" json:"fileType" form:"fileType"` //图片类型
}

//Add 新增
func Add(i Image) (err error) {
	i.ID = bson.NewObjectId().Hex()
	query := func(c *mgo.Collection) {
		err = c.Insert(&i)
	}
	env.WitchCollection("Image", query)
	return
}

//GetByFilename 获取图片 (by Filename)
func GetByFilename(filename string) (i Image, err error) {
	query := func(c *mgo.Collection) {
		err = c.Find(bson.M{"filename": filename}).One(&i)
	}
	env.WitchCollection("Image", query)
	return
}
