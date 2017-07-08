package main

import (
	"log"
	"net/http"

	"github.com/caoyongzheng/goserver/handles"
)

func main() {
	addr := "0.0.0.0:3000"
	http.HandleFunc("/proxy", handles.HandleProxy)
	log.Printf("server is listening at %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
