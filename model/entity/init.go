package entity

import "github.com/caoyongzheng/gotest/env"

var DBName string

func init() {
	DBName = env.GetConfig("DBName")
}
