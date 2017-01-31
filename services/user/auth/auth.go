package auth

import (
	"log"
	"net/http"

	"github.com/caoyongzheng/gotest/context"
)

// RequireUser 需要用户权限
func RequireUser(ctx *context.Context) {
	log.Println(ctx.GetUserID())
	if ctx.GetUserID() == "" {
		ctx.W.WriteHeader(http.StatusForbidden)
	}
}
