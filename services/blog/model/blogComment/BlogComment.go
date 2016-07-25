package blogCommentM

import (
	"github.com/caoyongzheng/test/env"
	"github.com/caoyongzheng/test/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

func init() {
	var err error
	query := func(c *mgo.Collection) {
		index := mgo.Index{
			Key:    []string{"blogId"},
			Unique: true,
			Sparse: true,
		}
		err = c.EnsureIndex(index)
	}
	env.WitchCollection("BlogComment", query)
	if err != nil {
		panic(err)
	}
}

//BlogComment 博客评论
type BlogComment struct {
	ID       string          `bson:"_id" json:"id" form:"id"`
	Size     int             `bson:"size" json:"size" form:"size"`
	Comments []model.Comment `bson:"comments" json:"comments" form:"comments"`
}

//GetPage 获取评论分页
func GetPage(id string, page, pagesize int) (bc BlogComment, err error) {
	query := func(c *mgo.Collection) {
		err = c.Find(bson.M{"_id": id}).Select(
			bson.M{
				"_id":  1,
				"size": 1,
				"comments": bson.M{
					"$slice": []int{(page - 1) * pagesize, pagesize},
				},
			}).One(&bc)
	}
	env.WitchCollection("BlogComment", query)
	return
}

//AddCommont 添加评论
func AddCommont(id string, comment model.Comment) (newC model.Comment, err error) {
	comment.Date = time.Now()
	comment.ID = bson.NewObjectId().String()
	query := func(c *mgo.Collection) {
		_, err = c.UpsertId(id, bson.M{
			"$push": bson.M{"comments": comment},
			"$inc":  bson.M{"size": 1},
		})
	}
	env.WitchCollection("BlogComment", query)
	newC = comment
	return
}

func GetSize(id string) int {
	var bc BlogComment
	query := func(c *mgo.Collection) {
		c.Find(bson.M{"_id": id}).Select(
			bson.M{
				"size": 1,
			}).One(&bc)
	}
	env.WitchCollection("BlogComment", query)
	return bc.Size
}
