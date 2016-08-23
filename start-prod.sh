docker run -d --rm -p 80:80 -v /resources/gotest:/resources/gotest -v /usr/local/projects/gocode:/go --link mongodb:mongodb --name gotest -w /go/src/github.com/caoyongzheng/gotest golang
