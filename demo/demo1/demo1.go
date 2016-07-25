package main

import (
	"github.com/go-martini/martini"
)

func main() {
	r := martini.Classic()
	r.Get("/", func() string {
		return "welcome to home page"
	})
	r.Get("/hello", func() string {
		return "hello world"
	})
	r.RunOnAddr(":8080")
}
