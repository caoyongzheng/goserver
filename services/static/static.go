package static

import (
	"net/http"

	"github.com/caoyongzheng/gotest/env"
	"github.com/go-martini/martini"
)

func init() {
	//html
	// env.Router.Get("/", func(r render.Render) {
	// 	r.Redirect("/app/", http.StatusMovedPermanently)
	// })
	// favicon.ico
	env.Router.Get("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, env.GetConfig("resources.favicon"))
	})
	// env.Router.Get("/app/**", func(r render.Render) {
	// 	r.HTML(200, "app", nil)
	// })
	//webfront js,css,image etc.
	env.Router.Use(martini.Static(
		env.GetConfig("assets"),
		martini.StaticOptions{Prefix: "/assets"},
	))
	//images
	env.Router.Use(martini.Static(
		env.GetConfig("resources.imgs"),
		martini.StaticOptions{
			Prefix:      "/resources/imgs",
			SkipLogging: true,
		},
	))
	//images
	env.Router.Use(martini.Static(
		env.GetConfig("resources.videos"),
		martini.StaticOptions{
			Prefix:      "/resources/videos",
			SkipLogging: true,
		},
	))
}
