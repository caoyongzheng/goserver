package entity

import (
	"github.com/caoyongzheng/gotest/env"
	mgo "gopkg.in/mgo.v2"
)

type UserRole int

const (
	Guest  UserRole = 0 //游客
	Normal UserRole = 2 //普通用户
	Admin  UserRole = 4 //管理员
)

func init() {
	var err error
	env.MgoOpInst.WithC("User", func(c *mgo.Collection) {
		index := mgo.Index{
			Key:    []string{"username", "password"},
			Unique: true,
			Sparse: true,
		}
		err = c.EnsureIndex(index)
	})
	if err != nil {
		panic(err)
	}
}

//User 用户
type User struct {
	ID         string   `bson:"_id" json:"id" form:"id"`
	Username   string   `bson:"username" json:"username" form:"username"` //账户名
	Password   string   `bson:"password" json:"password" form:"password"` //密码
	HeaderIcon string   `bson:"headerIcon" json:"headerIcon" form:"headerIcon"`
	Role       UserRole `bson:"role" form:"-" json:"role"`
}

func (u *User) CollectionName() string {
	return "User"
}
