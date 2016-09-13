# docker run -d -p 27017:27017 -v ~/Projects/dbdata/mongo:/data/db --name mongodb mongo
docker run -it --rm -p 3000:80 \
  -v /resources/gotest:/resources/gotest \
  -v /Users/caoyongzheng/Projects/webapps/gotest-webfont:/gotest-webfont \
  -v ~/Projects/gocode/src/github.com/caoyongzheng/gotest:/go/src/github.com/caoyongzheng/gotest \
  --link mongodb:mongodb \
  --name gotest \
  -w /go/src/github.com/caoyongzheng/gotest \
  -e MARTINI_ENV=development \
  caoyongzheng/dockerfile-goenv fresh
