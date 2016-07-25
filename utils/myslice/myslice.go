package myslice

//Contain 切片是否包含某元素
func Contain(s []string, target string) bool {
	for _, v := range s {
		if v == target {
			return true
		}
	}
	return false
}
