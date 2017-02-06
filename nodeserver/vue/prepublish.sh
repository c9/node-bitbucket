#!/bin/bash
#https://github.com/ui-router/react/tree/master/docs
cd "$(dirname $0)"
pwd
echo "> Start transpiling ES2015"
echo ""
rm -rf ./dist
./../../node_modules/.bin/babel --ignore __tests__ --plugins "transform-runtime" ./src --out-dir ./dist
exit
cp -r ./src/server/public ./dist/server/public
echo ""
echo "> Complete transpiling ES2015"