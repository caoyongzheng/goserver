From caoyongzheng/dockerfile-goenv
MAINTAINER caoyongzheng cyz083418@gmail.com

ADD . /go/src/github.com/caoyongzheng/gotest
ADD assets/ /gotest-webfont/assets
RUN cd /go/src/github.com/caoyongzheng/gotest && \
    godep restore

ENV MARTINI_ENV production

EXPOSE 80

WORKDIR /go/src/github.com/caoyongzheng/gotest
