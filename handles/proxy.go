package handles

import (
	"io/ioutil"
	"net/http"
)

// HandleProxy 反向代理
func HandleProxy(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Query().Get("url")
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
}
