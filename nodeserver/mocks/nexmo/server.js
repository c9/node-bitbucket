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




var jwt = require('jsonwebtoken');

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

fs.readFile(__dirname + '/private.pem', 'ascii', function (err, data) {
  private_key = data;
});

fs.readFile(__dirname + '/public.pem', 'ascii', function (err, data) {
  public_key = data;
});

var ursa = require('ursa');

var jsonServer = require('json-server')
var app = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults();
var url = require('url');

app.use(middlewares);


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
        ]
      };
      req.body["keys"] = {
        "public_key": public_key,
        "private_key": private_key
      };
    }
  }
  else if (url_parts.pathname.indexOf('/calls') !== -1) {
    if (req.headers.authorization) {
      var token = req.headers.authorization.substring(7);
      console.log(token);
      console.log(req.headers.authorization)
      var alg = 'HS256';
      jwt.verify(token, public_key,
      // {algorithm:alg}, 
      function(err, decoded) {
        if (err) {
          console.log(err);
          res.sendStatus(401);
          return;
        }
        else {
          next();
        }
      });
    }
    else {
      res.sendStatus(401);
    }

    return;
  }
  next();

});

app.use(router);


router.render = function (req, res) {
  var url_parts = url.parse(req.url, true);
  if (url_parts.pathname === '/applications') {
    if (req.method === 'POST') {
    }
  }
  if (url_parts.pathname.indexOf('/calls') !== -1) {
    res.jsonp({
      "_embedded": { "calls": res.locals.data }
    });
    return;
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


//basic get format /v1/calls
// {
//   "count": 100,
//   "page_size": 10,
//   "record_index": 20,
//   "_links": {
//     "self": {
//       "href": "/calls?page_size=10&record_index=20&order=asc"
//     }
//   },
//   "_embedded": {
//     "calls": [
//       {
//         "_links": {
//           "self": {
//             "href": "/calls/63f61863-4a51-4f6b-86e1-46edebcf9356"
//           }
//         },
//         "uuid": "63f61863-4a51-4f6b-86e1-46edebcf9356",
//         "conversation_uuid": "63f61863-4a51-4f6b-86e1-46edebio0123",
//         "to": [{
//           "type": "phone",
//           "number": "441632960960"
//         }],
//         "from": {
//           "type": "phone",
//           "number": "441632960961"
//         },
//         "status": "completed",
//         "direction": "outbound",
//         "rate": "0.39",
//         "price": "23.40",
//         "duration": "60",
//         "start_time": "2015-02-04T22:45:00Z",
//         "end_time": "2015-02-04T23:45:00Z",
//         "network": "65512"
//       },
//       ...
//     ]
//   }

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