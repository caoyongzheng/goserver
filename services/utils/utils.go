package utils

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/caoyongzheng/gotest/env"
	"github.com/martini-contrib/render"
)

func init() {
	env.R.Post("/utils/marked", func(w http.ResponseWriter, req *http.Request, r render.Render) {
		ct := req.Header.Get("Content-Type")
		if ct != "application/json" {
			r.JSON(200, map[string]interface{}{"success": false, "error": "Content-Type should be application/json"})
			return
		}
		postData := map[string]string{}
		err := json.NewDecoder(req.Body).Decode(&postData)
		if err != nil {
			r.JSON(200, map[string]interface{}{"success": false, "error": err.Error()})
			return
		}
		pd, _ := json.Marshal(postData)
		res, err := http.Post("http://0.0.0.0:3100/marked", "application/json", bytes.NewReader(pd))
		if err != nil {
			r.JSON(200, map[string]interface{}{
				"success": false, "error": err.Error(),
			})
			return
		}
		defer res.Body.Close()
		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			r.JSON(200, map[string]interface{}{
				"success": false, "error": err.Error(),
			})
			return
		}
		r.JSON(200, map[string]interface{}{
			"success": true, "data": string(body),
		})
	})
}
