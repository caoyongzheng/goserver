package main

import (
	"github.com/caoyongzheng/gotest/env"
	_ "github.com/caoyongzheng/gotest/services/admin"
	_ "github.com/caoyongzheng/gotest/services/blog"
	_ "github.com/caoyongzheng/gotest/services/image/controller/image"
	_ "github.com/caoyongzheng/gotest/services/static"
	_ "github.com/caoyongzheng/gotest/services/user"
)

func main() {
	env.Router.RunOnAddr(env.GetConfig("port"))
}
