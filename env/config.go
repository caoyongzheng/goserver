package env

import "github.com/go-martini/martini"

var devConfig = map[string]string{
	"host":             "localhost",
	"port":             ":3000",
	"db.name":          "gotest",
	"db.host":          "0.0.0.0",
	"db.port":          "27017",
	"resources.imgs":   "/resources/gotest/imgs",
	"resources.videos": "/resources/gotest/videos",
	"assets":           "/Users/caoyongzheng/Projects/webapps/gotest-webfont/assets",
}

var prodConfig = map[string]string{
	"host":             "localhost",
	"port":             ":80",
	"db.name":          "gotest",
	"db.host":          "0.0.0.0",
	"db.port":          "27017",
	"resources.imgs":   "/resources/gotest/imgs",
	"resources.videos": "/resources/gotest/videos",
	"assets":           "/gotest/assets",
}

func IsDev() bool {
	return martini.Env == martini.Dev
}

func GetConfig(key string) string {
	if IsDev() {
		return devConfig[key]
	}
	return prodConfig[key]
}
