package model

import "encoding/json"

//Result api请求的结果
type Result struct {
	Success bool        `json:"success"`
	Status  int         `json:"status"`
	Desc    string      `json:"desc"`
	Data    interface{} `json:"data"`
}

//NewResult 新建Result实例
func NewResult(success bool, status int, desc string, data interface{}) Result {
	return Result{Success: success, Status: status, Desc: desc, Data: data}
}

//APIResult 返回到客户端的API结果
func APIResult(success bool, status int, desc string, data interface{}) []byte {
	r := Result{success, status, desc, data}

	b, err := json.Marshal(r)
	if err != nil {
		b, _ = json.Marshal(Result{false, -1, "Failed to Marshal Result", nil})
		return b
	}
	return b
}
