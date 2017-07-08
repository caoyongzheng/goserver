package auth

import (
	"net/http"

	"github.com/caoyongzheng/goserver/context"
)

// RequireUser 需要用户权限
func RequireUser(ctx *context.Context) {
	if ctx.GetUserID() == "" {
		ctx.W.WriteHeader(http.StatusForbidden)
	}
}
