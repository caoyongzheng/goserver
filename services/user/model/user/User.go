package userM

import (
	"github.com/caoyongzheng/test/env"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const (
	roleGuest  = 0 //游客
	roleSignUp = 2 //普通用户
	roleAdmin  = 4 //管理员
)

func init() {
	var err error
	query := func(c *mgo.Collection) {
		index := mgo.Index{
			Key:    []string{"username"},
			Unique: true,
			Sparse: true,
		}
		err = c.EnsureIndex(index)
	}
	env.WitchCollection("User", query)
	if err != nil {
		panic(err)
	}
}

//Info 基本信息
type Info struct {
	Name       string `bson:"name" json:"name" form:"name"`
	HeaderIcon string `bson:"headerIcon" json:"headerIcon" form:"headerIcon"`
}

//User 用户
type User struct {
	ID       string `bson:"_id" json:"id" form:"id"`
	Username string `bson:"username" json:"username" form:"username"`
	Password string `bson:"password" json:"password" form:"password"`
	Info
	Role int `bson:"role" form:"-"`
}

//UpdateHeaderIcon 修改头像
func (u *User) UpdateHeaderIcon(headerIcon string) (err error) {
	query := func(c *mgo.Collection) {
		err = c.Update(
			bson.M{"_id": u.ID},
			bson.M{
				"$set": bson.M{"info.headerIcon": headerIcon},
			},
		)
	}
	env.WitchCollection("User", query)
	return
}

//Add 新增用户
func Add(u User) (err error) {
	u.ID = bson.NewObjectId().Hex()
	if u.Role == 0 {
		u.Role = 1
	}
	query := func(c *mgo.Collection) {
		err = c.Insert(&u)
	}
	env.WitchCollection("User", query)
	return
}

//GetByUsernameAndPassword 根据用户名和密码获取用户
func GetByUsernameAndPassword(username, password string) (u *User, err error) {
	u = &User{}
	query := func(c *mgo.Collection) {
		err = c.Find(bson.M{"username": username, "password": password}).One(u)
	}
	env.WitchCollection("User", query)
	return
}

// GenerateAnonymousUser should generate an anonymous user model
// for all sessions. This should be an unauthenticated 0 value struct.
func GenerateAnonymousUser() *User {
	return &User{}
}

//GetByID 根据ID获取User
func GetByID(id string) *User {
	var u User
	query := func(c *mgo.Collection) {
		c.Find(bson.M{"_id": id}).One(&u)
	}
	env.WitchCollection("User", query)
	return &u
}
