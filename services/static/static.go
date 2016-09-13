package static

import (
	"net/http"

	"github.com/caoyongzheng/gotest/env"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

func init() {
	//html
	env.Router.Get("/", func(r render.Render) {
		r.Redirect("/app/", http.StatusMovedPermanently)
	})
	env.Router.Get("/app/**", func(r render.Render) {
		r.HTML(200, "app", nil)
	})
	//webfront js,css,image etc.
	env.Router.Use(martini.Static(
		env.GetConfig("assets"),
		martini.StaticOptions{Prefix: "/assets"},
	))
	//images
	env.Router.Use(martini.Static(
		env.GetConfig("resources.imgs"),
		martini.StaticOptions{Prefix: "/resources/imgs"},
	))
	//images
	env.Router.Use(martini.Static(
		env.GetConfig("resources.videos"),
		martini.StaticOptions{Prefix: "/resources/videos"},
	))
}
