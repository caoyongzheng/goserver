package static

import (
	"github.com/caoyongzheng/test/env"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

func init() {
	//html
	env.Router.Get("/", func(r render.Render) {
		r.HTML(
			200,
			"template",
			map[string][]string{
				"script": []string{"vendor", "app"},
			},
		)
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
