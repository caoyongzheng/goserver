#! /bin/bash

Webfont=/Users/caoyongzheng/Projects/webapps/gotest-webfont
GoCode=/Users/caoyongzheng/Projects/gocode/src/github.com/caoyongzheng/gotest
ServerUrl=root@118.178.133.82

cd $Webfont

echo 'build assets'
npm run prod

echo 'upload assets'
scp -r $Webfont/assets  $ServerUrl:/gotest/assets

cd $GoCode

#echo 'update gocode'
#git reset HEAD --hard
#git pull origin master

echo 'build gotest'
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 godep go build

echo 'stop gotest'
ssh $ServerUrl 'bash -s' < stop.sh

echo 'upload gotest'
scp $GoCode/gotest $ServerUrl:/gotest/

echo 'start gotest'
ssh $ServerUrl 'bash -s' < start.sh
