package env

import "github.com/go-martini/martini"

var devConfig = map[string]string{
	"host":              "localhost",
	"port":              ":3000",
	"db.name":           "gotest",
	"db.host":           "0.0.0.0",
	"db.port":           "27017",
	"resources.imgs":    "/resources/gotest/imgs",
	"resources.videos":  "/resources/gotest/videos",
	"resources.favicon": "/resources/gotest/favicon.ico",
	"assets":            "/Users/caoyongzheng/Projects/webapps/gotest-webfont/assets",
}

var prodConfig = map[string]string{
	"host":              "localhost",
	"port":              ":3000",
	"db.name":           "gotest",
	"db.host":           "0.0.0.0",
	"db.port":           "27017",
	"resources.imgs":    "/resources/gotest/imgs",
	"resources.videos":  "/resources/gotest/videos",
	"resources.favicon": "/resources/gotest/favicon.ico",
	"assets":            "/gotest/assets",
}

// IsDev 是否是开发环境
func IsDev() bool {
	return martini.Env == martini.Dev
}

// GetConfig 获取配置信息
func GetConfig(key string) string {
	if IsDev() {
		return devConfig[key]
	}
	return prodConfig[key]
}
