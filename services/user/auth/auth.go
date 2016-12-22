package auth

import (
	"net/http"

	"github.com/astaxie/beego/session"
	"github.com/caoyongzheng/gotest/model/entity"
	"github.com/caoyongzheng/gotest/token"
	"github.com/go-martini/martini"
)

//Less 权限小于或等于role,则通过
func Less(role entity.UserRole) martini.Handler {
	return func(w http.ResponseWriter, sess session.Store) {
		u := sess.Get("user")
		userRole := entity.Guest
		if u != nil {
			userRole = u.(entity.User).Role
		}
		if userRole <= role {
			return
		}
		w.WriteHeader(http.StatusForbidden)
	}
}

//Great 权限大于或等于role,则通过
func Great(role entity.UserRole) martini.Handler {
	return func(w http.ResponseWriter, sess session.Store) {
		u := sess.Get("user")
		userRole := entity.Guest
		if u != nil {
			userRole = u.(entity.User).Role
		}
		if userRole >= role {
			return
		}
		w.WriteHeader(http.StatusForbidden)
	}
}

//Forbidden 禁止权限为role的用户通过
func Forbidden(role entity.UserRole) martini.Handler {
	return func(w http.ResponseWriter, sess session.Store) {
		u := sess.Get("user")
		userRole := entity.Guest
		if u != nil {
			userRole = u.(entity.User).Role
		}
		if userRole != role {
			return
		}
		w.WriteHeader(http.StatusForbidden)
	}
}

func RequireUser(w http.ResponseWriter, t token.Store) {
	if t == nil {
		w.WriteHeader(http.StatusForbidden)
		return
	}
}
