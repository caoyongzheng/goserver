package static

import (
	"net/http"

	"github.com/caoyongzheng/gotest/env"
	"github.com/go-martini/martini"
)

func init() {
	//html
	// env.R.Get("/", func(r render.Render) {
	// 	r.Redirect("/app/", http.StatusMovedPermanently)
	// })
	// favicon.ico
	env.R.Get("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, env.GetConfig("resources.favicon"))
	})
	// env.R.Get("/app/**", func(r render.Render) {
	// 	r.HTML(200, "app", nil)
	// })
	//webfront js,css,image etc.
	env.R.Use(martini.Static(
		env.GetConfig("assets"),
		martini.StaticOptions{Prefix: "/assets"},
	))
	//images
	env.R.Use(martini.Static(
		env.GetConfig("resources.imgs"),
		martini.StaticOptions{
			Prefix:      "/resources/imgs",
			SkipLogging: true,
		},
	))
	//images
	env.R.Use(martini.Static(
		env.GetConfig("resources.videos"),
		martini.StaticOptions{
			Prefix:      "/resources/videos",
			SkipLogging: true,
		},
	))
}
