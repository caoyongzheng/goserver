package handles

import (
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// HandleProxy 反向代理
func HandleProxy(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Max-Age", string(3600*24*30*time.Second))
	switch r.Method {
	case http.MethodGet:
		url := r.URL.Query().Get("url")
		log.Println(url)
		if url == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		resp, err := http.Get(url)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		data, _ := ioutil.ReadAll(resp.Body)
		w.Write(data)
	default:
	}
}
