package env

import (
	"github.com/go-martini/martini"
	"github.com/martini-contrib/cors"
	"github.com/martini-contrib/render"
)

//R 路由
var R *martini.ClassicMartini

func initRouter() {
	R = martini.Classic()
	// 注册全局渲染器
	R.Use(render.Renderer(render.Options{
		Charset:    "UTF-8", // Sets encoding for json and html content-types. Default is "UTF-8".
		IndentJSON: true,    // Output human readable JSON
	}))
	R.Use(cors.Allow(&cors.Options{
		AllowOrigins:     []string{"http://localhost:3001", "http://www.caoyongzheng.com"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowMethods:     []string{"POST", "PUT"},
		AllowHeaders:     []string{"token", "Content-Type"},
		AllowCredentials: true,
	}))
}
