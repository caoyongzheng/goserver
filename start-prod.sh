docker run -d -p 80:80 -v /resources/gotest:/resources/gotest --link mongodb:mongodb --name gotest caoyongzheng/gotest go run main.go
