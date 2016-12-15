package env

import (
	"github.com/caoyongzheng/gotest/token"
	"github.com/caoyongzheng/gotest/token/redis"
)

var TokenManager token.Manager

func init() {
	initDB()
	initSessions()
	initRouter()
	TokenManager = redis.NewManager(&redis.Config{})
}
