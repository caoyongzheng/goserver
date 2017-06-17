package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/caoyongzheng/gotest/env"
)

func init() {
	env.R.Any("/proxy", func(w http.ResponseWriter, r *http.Request) {
		u := r.URL.Query().Get("url")
		remote, err := url.Parse(u)
		if err != nil {
			panic(err)
		}
		r.URL.RawQuery = ""
		r.URL.Path = ""
		proxy := httputil.NewSingleHostReverseProxy(remote)
		proxy.ServeHTTP(w, r)
	})
}
