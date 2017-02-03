package context

import (
	"log"
	"net/http"
	"time"

	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/caoyongzheng/gotest/session"
	"github.com/go-martini/martini"
)

// Context 请求上下文
type Context struct {
	W     http.ResponseWriter
	R     *http.Request
	P     session.Provider
	Token string
	MgoOp *env.MgoOp
}

// UpdateExpire 更新过期时间
func (c *Context) UpdateExpire() {
	if c.Token == "" || !c.P.IsExist(c.Token) {
		return
	}
	c.P.SetExpire(c.Token, time.Now().Add(time.Duration(3600)*time.Second))
}

// GetUserID 获取用户ID
func (c *Context) GetUserID() string {
	if c.Token == "" || !c.P.IsExist(c.Token) {
		return ""
	}
	return c.P.GetItem(c.Token, "userId")
}

// GetUser 获取当前用户
func (c *Context) GetUser() (u entity.User) {
	var userID = c.GetUserID()
	log.Println(userID)
	if userID == "" {
		return
	}
	c.MgoOp.FindId("User", userID, &u)
	return
}

// EnableContext 提供上下文到请求中
func EnableContext(p session.Provider) martini.Handler {
	return func(w http.ResponseWriter, r *http.Request, c martini.Context) {
		ctx := &Context{
			P:     p,
			W:     w,
			R:     r,
			MgoOp: env.MgoOpInst,
			Token: r.Header.Get("token"),
		}
		ctx.UpdateExpire()
		c.Map(ctx)
	}
}
