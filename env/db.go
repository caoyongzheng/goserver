package env

import (
	"gopkg.in/mgo.v2"
	"os"
)

var mgoSession *mgo.Session

//GetSession 获取连接数据库的会话
func GetSession() *mgo.Session {
	if mgoSession == nil {
		var err error
		db := os.Getenv("MONGODB_PORT_27017_TCP_ADDR")
		if db == "" {
			db = GetConfig("DB")
		}
		mgoSession, err = mgo.Dial(db + ":27017")
		if err != nil {
			panic(err) //直接终止程序运行
		}
	}
	//最大连接池默认为4096
	return mgoSession.Clone()
}

//WitchCollection 获取collection对象,并执行条件语句
func WitchCollection(collection string, s func(*mgo.Collection)) {
	session := GetSession()
	defer session.Close()
	c := session.DB(GetConfig("DBName")).C(collection)
	s(c)
}
