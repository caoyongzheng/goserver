package env

import (
	"github.com/caoyongzheng/gotest/token"
	"github.com/caoyongzheng/gotest/token/memory"
)

var TokenManager token.Manager

func init() {
	initDB()
	initSessions()
	initRouter()
	TokenManager = memory.NewManager(memory.Config{})
	go TokenManager.GCLoop()
}
