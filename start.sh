docker run --rm -it -p 80:80 -v /resources/gotest:/resources/gotest --link mongodb:mongodb -name gotest caoyongzheng/gotest
