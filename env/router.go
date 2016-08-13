package env

import (
	"html/template"
	"net/http"

	"github.com/astaxie/beego/session"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

//Router 路由
var Router *martini.ClassicMartini

func initRouter() {
	Router = martini.Classic()

	Router.Use(render.Renderer(render.Options{
		Directory:  "resources/webpack/assets/template", // Specify what path to load the templates from.
		Extensions: []string{".tmpl", ".html"},          // Specify extensions to load for templates.
		Funcs: []template.FuncMap{
			template.FuncMap{
				"ScriptURL": ScriptURL,
				"CSSURL":    CSSURL,
			},
		}, // Specify helper function maps for templates to access.
		Charset:    "UTF-8", // Sets encoding for json and html content-types. Default is "UTF-8".
		IndentJSON: true,    // Output human readable JSON
	}))

	Router.Use(func(w http.ResponseWriter, r *http.Request, c martini.Context) {
		sess, _ := Sessions.SessionStart(w, r)
		defer sess.SessionRelease(w)
		c.MapTo(sess, (*session.Store)(nil))
		c.Next()
	})
}

//ScriptURL 返回script文件路由
func ScriptURL(args ...interface{}) (url string) {
	url = GetConfig("assetsAddr") + "/assets/js/" + args[0].(string) + ".bundle.js"
	return
}

//CSSURL 返回css文件路由
func CSSURL(args ...interface{}) (url string) {
	url = GetConfig("assetsAddr") + "/assets/css/" + args[0].(string) + ".bundle.css"
	return
}
