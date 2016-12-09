// https://api.nexmo.com/v1/applications/?api_key={{api_key}}&api_secret={{api_secret}}

//#npm install -g node-gyp --msvs_version=2013

//npm install -g node-gyp --msvs_version=2013
//http://www.python.org/download/releases/2.7.3#download

//https://github.com/nodejs/node-gyp/wiki/Visual-Studio-2010-Setup

//http://www.python.org/download/releases/2.7.3#download
//add python to path
//npm install --global --production windows-build-tools
//npm install -g node-gyp
//https://developer.microsoft.com/en-us/windows/downloads/windows-8-1-sdk
//npm config set msvs_version 2013 --global

const PORT = process.env.PORT || 3100;
// server.js
const exec = require('child_process').exec;
exec('cp ' + __dirname + '/default-db.json ' + __dirname + '/db.json', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

var fs = require('fs');

fs.readFile(__dirname+'/private.pem', 'ascii', function (err,data) {
  private_key = data;
});

fs.readFile(__dirname+'/public.pem', 'ascii', function (err,data) {
  public_key = data;
});

var ursa = require('ursa');

var jsonServer = require('json-server')
var app = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults();
var url = require('url');

app.use(middlewares)


app.use(function (req, res, next) {
  var url_parts = url.parse(req.url, true);
  if (url_parts.pathname === '/applications' ||
    url_parts.pathname === '/applications/') {
    if (req.method === 'POST') {

      console.log(url_parts.query);
      var query = url_parts.query;
      req.body = req.body || {};
      console.log(req.body);
      req.body.name = query.name;
      req.body[query.type] = {
        webhooks: [
          {
            "endpoint_type": "event_url",
            "endpoint": query.event_url,
            "http_method": "POST"
          },
          {
            "endpoint_type": "answer_url",
            "endpoint": query.answer_url,
            "http_method": "GET"
          }
        ],
        "keys": {
          "public_key": public_key,
          "private_key": private_key
        }
      };
      console.log(req.body);
    }
  }
  next();

});

app.use(router);


app.render = function (req, res) {
  var url_parts = url.parse(req.url, true);
  if (url_parts.pathname === '/applications') {
    if (req.method === 'POST') {
    }

  }
  res.jsonp(res.locals.data);
}


app.use(router);
server = app.listen(PORT, function () {
  console.log('JSON Server is running')
});


module.exports = {
  close: function () {
    server.close(0);
  }
}


//api short-circuits it's up to the ui to decide what a good request looks like before sending it
//POST 400
// https://api.nexmo.com/v1/applications/?api_key={{api_key}}&api_secret={{api_secret}}
// {
//   "type": "BAD_REQUEST",
//   "error_title": "Bad Request",
//   "invalid_parameters": {
//     "name": "Is required."
//   }
// }

//1402c3dd-68ab-4faa-9cda-2d59ff632ed3
//4a620354-b84e-41fd-abea-eb1ddcb06621


//PATCH response
//<html>
//     <head>
//         <title>403 Forbidden</title>
//     </head>
//     <body bgcolor="white">
//         <center>
//             <h1>403 Forbidden</h1>
//         </center>
//         <hr>
//         <center>nginx</center>
//     </body>
// </html>
// <!-- a padding to disable MSIE and Chrome friendly error page -->
// <!-- a padding to disable MSIE and Chrome friendly error page -->
// <!-- a padding to disable MSIE and Chrome friendly error page -->
// <!-- a padding to disable MSIE and Chrome friendly error page -->
// <!-- a padding to disable MSIE and Chrome friendly error page -->
// <!-- a padding to disable MSIE and Chrome friendly error page -->