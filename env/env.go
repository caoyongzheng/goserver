package env

import "flag"

var host = flag.String("host", "127.0.0.1:3000", "server listen address")
var mongodbName = flag.String("momgodbName", "gotest", "momgodb名字")
var mongodbAddr = flag.String("momgodbAddr", "127.0.0.1:27017", "mongo地址")
var redisAddr = flag.String("redisAddr", "0.0.0.0:6379", "redis地址")

// GetHost 监听地址
func GetHost() string {
	return *host
}

// GetMongoDBName mongo数据库名
func GetMongoDBName() string {
	return *mongodbName
}

// GetMongoDBAddr mongo地址
func GetMongoDBAddr() string {
	return *mongodbAddr
}

// GetRedisAddr redis地址
func GetRedisAddr() string {
	return *redisAddr
}

func init() {
	flag.Parse()
	initDB()
	initRouter()
}
