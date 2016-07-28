From golang
MAINTAINER caoyongzheng cyz083418@gmail.com

ADD . /go/src/github.com/caoyongzheng/gotest

RUN cd /go/src/github.com/caoyongzheng/gotest && \
    go get github.com/tools/godep && \
    godep restore

ENV MARTINI_ENV production
