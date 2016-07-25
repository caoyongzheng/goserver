package main

import (
	"github.com/caoyongzheng/test/env"
	_ "github.com/caoyongzheng/test/services/blog/controller/blog"
	_ "github.com/caoyongzheng/test/services/blog/controller/blogComment"
	_ "github.com/caoyongzheng/test/services/image/controller/image"
	_ "github.com/caoyongzheng/test/services/static/controller"
	_ "github.com/caoyongzheng/test/services/user/controller/user"
)

func main() {
	env.Router.RunOnAddr(env.GetConfig("port"))
}
