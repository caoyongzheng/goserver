package env

import (
	"os"

	"gopkg.in/mgo.v2"
)

//MgoOpInst
var MgoOpInst *MgoOp

func initDB() {
	dbIP := os.Getenv("MONGODB_PORT_27017_TCP_ADDR")
	if dbIP == "" {
		dbIP = GetConfig("DBIP")
	}
	dbUrl := dbIP + ":27017"
	MgoOpInst = &MgoOp{url: dbUrl, name: GetConfig("DBName")}
}

// 数据库操作
type MgoOp struct {
	url     string
	name    string
	session *mgo.Session
}

func (mgoOp *MgoOp) getSession() *mgo.Session {
	if mgoOp.session == nil {
		var err error
		mgoOp.session, err = mgo.Dial(mgoOp.url)
		if err != nil {
			panic(err) //直接终止程序运行
		}
	}
	//最大连接池默认为4096
	return mgoOp.session.Clone()
}

func (mgoOp *MgoOp) WithDB(collectionName string, dbFn func(*mgo.Database)) {
	session := mgoOp.getSession()
	defer session.Close()
}

func (mgoOp *MgoOp) WithC(collectionName string, q func(*mgo.Collection)) {
	session := mgoOp.getSession()
	defer session.Close()
	c := session.DB(mgoOp.name).C(collectionName)
	q(c)
}

//FindId find Document by ID
func (mgoOp *MgoOp) FindId(collectionName string, id interface{}, result interface{}) error {
	session := mgoOp.getSession()
	defer session.Close()
	return session.DB(mgoOp.name).C(collectionName).FindId(id).One(result)
}

func (mgoOp *MgoOp) RemoveId(collectionName string, id interface{}) error {
	session := mgoOp.getSession()
	defer session.Close()
	return session.DB(mgoOp.name).C(collectionName).RemoveId(id)
}

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
