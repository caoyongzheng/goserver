package env

import (
	"time"

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
		AllowAllOrigins: true,
		// AllowOrigins: []string{
		// 	"https://www.caoyongzheng.com",
		// 	"https://caoyongzheng.github.io",
		// },
		ExposeHeaders:    []string{"Content-Length"},
		AllowMethods:     []string{"POST", "PUT", "DELETE", "GET"},
		AllowHeaders:     []string{"token", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           3600 * 24 * 30 * time.Second,
	}))
}
