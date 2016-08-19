package auth

import (
	"net/http"

	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/services/user/model/user"
	"github.com/go-martini/martini"
)

//Less 权限小于或等于role,则通过
func Less(role int) martini.Handler {
	return func(w http.ResponseWriter, sess session.Store) {
		u := sess.Get("user")
		var userRole int
		if u != nil {
			userRole = u.(userM.User).Role
		}
		if userRole <= role {
			return
		}
		w.WriteHeader(http.StatusForbidden)
	}
}

//Great 权限大于或等于role,则通过
func Great(role int) martini.Handler {
	return func(w http.ResponseWriter, sess session.Store) {
		u := sess.Get("user")
		var userRole int
		if u != nil {
			userRole = u.(userM.User).Role
		}
		if userRole >= role {
			return
		}
		w.WriteHeader(http.StatusForbidden)
	}
}

//Forbidden 禁止权限为role的用户通过
func Forbidden(role int) martini.Handler {
	return func(w http.ResponseWriter, sess session.Store) {
		u := sess.Get("user")
		var userRole int
		if u != nil {
			userRole = u.(userM.User).Role
		}
		if userRole != role {
			return
		}
		w.WriteHeader(http.StatusForbidden)
	}
}
