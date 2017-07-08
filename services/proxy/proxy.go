package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/caoyongzheng/goserver/env"
)

func init() {
	env.R.Any("/proxy", func(w http.ResponseWriter, r *http.Request) {
		u := r.URL.Query().Get("url")
		r.URL.Query().Del("url")
		remote, err := url.Parse(u)
		if err != nil {
			panic(err)
		}
		remote.RawQuery = remote.Query().Encode()
		r.URL.RawQuery = ""
		r.URL.Path = ""
		proxy := httputil.NewSingleHostReverseProxy(remote)
		proxy.ServeHTTP(w, r)
	})
}
