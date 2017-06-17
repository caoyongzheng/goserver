package main

import (
	"log"

	"github.com/caoyongzheng/gotest/context"
	"github.com/caoyongzheng/gotest/env"
	// _ "github.com/caoyongzheng/gotest/services/admin"
	_ "github.com/caoyongzheng/gotest/services/blog"
	_ "github.com/caoyongzheng/gotest/services/proxy"
	_ "github.com/caoyongzheng/gotest/services/user"
	_ "github.com/caoyongzheng/gotest/services/utils"
	"github.com/caoyongzheng/gotest/session/redis"
)

func main() {
	log.Printf("host=%s", env.GetHost())
	log.Printf("mongodb=%s", env.GetMongoDBAddr())
	log.Printf("redisdb=%s", env.GetRedisAddr())
	// 注册全局mongo数据库服务
	env.R.Map(env.MgoOpInst)
	// 提供会话管理器
	env.R.Use(context.EnableContext(redis.New()))
	env.R.RunOnAddr(env.GetHost())
}
