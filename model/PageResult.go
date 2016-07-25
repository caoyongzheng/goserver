package model

//PageResult 分页结果
type PageResult struct {
	Total    int         `json:"total"`
	Page     int         `json:"page"`
	Elements interface{} `json:"elements"`
}
