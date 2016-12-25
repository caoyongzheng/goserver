package main

import (
	"github.com/caoyongzheng/gotest/context"
	"github.com/caoyongzheng/gotest/env"
	// _ "github.com/caoyongzheng/gotest/services/admin"
	_ "github.com/caoyongzheng/gotest/services/blog"
	// _ "github.com/caoyongzheng/gotest/services/image/controller/image"
	_ "github.com/caoyongzheng/gotest/services/static"
	_ "github.com/caoyongzheng/gotest/services/user"
	"github.com/caoyongzheng/gotest/session/redis"
)

func main() {
	// 注册全局mongo数据库服务
	env.R.Map(env.MgoOpInst)
	// 提供会话管理器
	env.R.Use(context.EnableContext(redis.New()))
	env.R.RunOnAddr(env.GetConfig("port"))
}
