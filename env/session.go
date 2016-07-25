package env

import (
	"github.com/astaxie/beego/session"
)

//Sessions 会话管理器
var Sessions *session.Manager

func initSessions() {
	Sessions, _ = session.NewManager("memory", `{"cookieName":"gosessionid","gclifetime":3600}`)
	go Sessions.GC()
}
