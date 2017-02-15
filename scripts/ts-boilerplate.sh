#!/bin/sh

APP_NAME=$1

[ -z "$APP_NAME" ] && echo "1 args required" && exit 1
[ -d "$APP_NAME" ] && echo "$APP_NAME exists" && exit 1

which tsc           || npm install -g typescript
which browser-sync  || npm install -g browser-sync
which watchify      || npm install -g watchify
which nf            || npm install -g foreman

mkdir $APP_NAME ; cd $APP_NAME

## NPM
npm init -y > /dev/null
npm install \
  angular2 \
  es6-promise@^3.0.2 \
  es6-shim@^0.33.3 \
  reflect-metadata@0.1.2 \
  rxjs@5.0.0-beta.0 \
  zone.js@0.5.10 \
  --save

## tsc setting
cat << EOT > tsconfig.json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": true,
        "outDir": "built",
        "rootDir": "src",
        "sourceMap": false,
        "moduleResolution": "node",
        "experimentalDecorators": true
    },
    "exclude": [
        "node_modules"
    ]
}
EOT

## procfile
cat << EOT > procfile
transpile: tsc --watch
bundle: watchify built/bootstrap.js -o bundle.js -v
web: browser-sync start --server --files bundle.js --files index.html
EOT


## sources
mkdir src
cat << EOT > index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
<my-app></my-app>
<script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
<script src="bundle.js"></script>
</body>
</html>
EOT

cat << EOT > src/bootstrap.ts
import {bootstrap} from 'angular2/bootstrap';
import {Component} from 'angular2/core';

var template =  '<div> Hello, {{title}}</div>';

@Component({selector: 'my-app', template})
class AppComponent {
    title = 'My Angular2 app';
}

bootstrap(AppComponent);
EOT

## build
echo ""
tsc && echo "Your project gets ready and start server with 'cd $APP_NAME; nf start' !"