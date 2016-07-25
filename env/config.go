package env

import (
	"encoding/json"
	"github.com/go-martini/martini"
	"io/ioutil"
)

var config map[string]string

func initConfig() {
	b, err := ioutil.ReadFile(getConfigFilename())
	checkErr(err)

	err = json.Unmarshal(b, &config)
	checkErr(err)
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func getConfigFilename() string {
	if IsDev() {
		return "env/config/development.json"
	}
	return "env/config/production.json"
}

func IsDev() bool {
	return martini.Env == martini.Dev
}

func GetConfig(key string) string {
	return config[key]
}
