#! /bin/bash

Webfont=/Users/caoyongzheng/Projects/webapps/gotest-webfont
GoCode=/Users/caoyongzheng/Projects/gocode/src/github.com/caoyongzheng/gotest
ServerUrl=root@107.170.210.111

cd $Webfont

echo 'build assets'
npm run prod

echo 'upload assets'
scp -r $Webfont/assets/  $ServerUrl:/gotest/assets/

cd $GoCode

#echo 'update gocode'
#git reset HEAD --hard
#git pull origin master

echo 'build gocode'
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 godep go build

echo 'upload gocode'
scp $GoCode/gotest $ServerUrl:/gotest/

echo 'restart'
ssh $ServerUrl 'bash -s' < restart.sh
