package imageC

import (
	"crypto/md5"
	"fmt"
	"github.com/caoyongzheng/gotest/env"
	"github.com/caoyongzheng/gotest/model"
	"github.com/caoyongzheng/gotest/services/image/model/image"
	"github.com/caoyongzheng/gotest/utils/fileutil"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"io/ioutil"
	"net/http"
	"os"
)

func init() {
	env.Router.Group("/api/image", func(r martini.Router) {
		r.Post("/add", AddImage)
	})
}

//AddImage 添加图片
func AddImage(req *http.Request, r render.Render) {
	var err error

	//解析表单
	err = req.ParseMultipartForm(1024 * 10)
	if err != nil {
		r.JSON(200, model.NewResult(false, 0, err.Error(), nil))
		return
	}

	//获取图片类型
	fileType := req.FormValue("fileType")
	if fileType == "" {
		r.JSON(200, model.NewResult(false, 2, "图片类型不能为空", nil))
		return
	}
	var suffix string
	switch fileType {
	case "image/png":
		suffix = ".png"
	case "image/jpeg":
		suffix = ".jpeg"
	case "image/gif":
		suffix = ".gif"
	default:
		r.JSON(200, model.NewResult(false, 2, "图片类型错误", nil))
		return
	}

	//解析上传图片
	uploadFile, _, err := req.FormFile("image")
	if err != nil {
		r.JSON(200, model.NewResult(false, 1, err.Error(), nil))
		return
	}
	defer uploadFile.Close()
	fileData, err := ioutil.ReadAll(uploadFile)
	if err != nil {
		r.JSON(200, model.NewResult(false, 2, err.Error(), nil))
		return
	}

	//获取上传图片哈希值
	md5Inst := md5.New()
	md5Inst.Write(fileData)
	hashValue := md5Inst.Sum(nil)

	//图片文件名和路径
	filename := fmt.Sprintf("%x%s", hashValue, suffix)
	dir := env.GetConfig("resources.imgs") + "/" + filename[0:3]

	//判断图片是否已存在
	os.MkdirAll(dir, os.ModePerm)
	if fileutil.IsExist(dir + "/" + filename) {
		r.JSON(200, model.NewResult(true, 0, "图片已存在", filename))
		return
	}

	//生成图片文件
	imageFile, err := os.OpenFile(dir+"/"+filename, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
	if err != nil {
		r.JSON(200, model.NewResult(false, 3, err.Error(), nil))
		return
	}
	defer imageFile.Close()
	imageFile.Write(fileData)

	//添加数据条目
	imageM.Add(imageM.Image{Filename: filename, Desc: req.FormValue("desc")})
	r.JSON(200, model.NewResult(true, 1, "新增图片成功", filename))
}
