From caoyongzheng/docker-golang
MAINTAINER caoyongzheng cyz083418@gmail.com

ADD . /go/src/github.com/caoyongzheng/test
RUN npm install -g webpack webpack-dev-server && \
    cd /go/src/github.com/caoyongzheng/test/resources/webpack && \
    npm install && npm run prod

RUN cd /go/src/github.com/caoyongzheng/test && \
    go get github.com/tools/godep && \
    godep restore

ENV MARTINI_ENV production
