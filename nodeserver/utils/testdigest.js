
var request = require('request');

var params = require('../params.js');

var parsers = require('www-authenticate').parsers;


var crypto = require('crypto');

var www_authenticate = require('www-authenticate');


const FTP_HOST = params.env.FTP_HOST;
const FTP_BASE = params.env.FTP_BASE;
const FTP_USER = params.env.FTP_USER;
const FTP_PASSWORD = params.env.FTP_PASSWORD;

var authenticator = www_authenticate.authenticator(FTP_USER, FTP_PASSWORD);

var path = '/private/Downloads/';
var options = {
    url: FTP_BASE + path,
    method: 'GET',
    path: path,
    rejectUnauthorized: false
}
request(options,
    function (err, res, body) {
        console.log(res.statusCode);
        console.log(res.headers);
        console.log(body);
        if (err) {
            console.log(err);
            return;
        }
        authenticator.get_challenge(res);
        authenticator.authenticate_request_options(options);
        console.log(options);
        request(options, function (err, res, body) {
            console.log(res.statusCode);
            console.log(body);
        })
    }
);




return;

var username = 'user1';
var password = 'user1';
var authenticator = www_authenticate.authenticator(username, password);
var uri = 'http://test.webdav.org/auth-digest/';
var options = {
    url: uri,
    method: 'GET',
    path: '/auth-digest/'
}
request(options,
    function (error, response, body) {
        authenticator.get_challenge(response);
        authenticator.authenticate_request_options(options);
        request(options, function (err, res, body) {
            console.log(res.statusCode);
            console.log(body);
            request(options, function (err, res, body) {
                console.log(res.statusCode);
                console.log(body);
            })
        })
    }
);


request(
    {
        'url': 'http://test.webdav.org/auth-digest/',
        'method': 'GET',
        'auth': {
            'user': 'user1',
            'password': 'user1',
            'sendImmediately': false
        },
        'followRedirect': false,
        'followAllRedirects': false,
        // 'json': true,
        // 'body': {'user-name':'user1', 'password': 'user1'}
    },
    function (error, response, body) {
        console.log(response.headers);
        console.log(body);
        console.log('callback: ' + response.statusCode);
    }
);

// request(
//   {
//     'url': 'http://http://test.webdav.org/auth-digest/',
//     'method': 'GET',
//     'auth': {
//       'user': 'user1',
//       'password': 'user1',
//       'sendImmediately': false
//     },
//     'followRedirect': true,
//     'followAllRedirects': true,
//     // 'json': true,
//     // 'body': {'user-name':'user1', 'password': 'user1'}
//   },
//   function(error, response, body) {
//       console.log(response.headers);
//       console.log(body);
//     console.log('callback: ' + response.statusCode);
//   }
// );


// console.log(http_digest);

// var digest = http_digest('user1', 'user1');
// digest.request({
//   host: 'test.webdav.org',
//   path: '/auth-digest/',
//   port: 80,
//   method: 'GET',
//   headers: { "User-Agent": "Simon Ljungberg" } // Set any headers you want
// }, function (res) {
//   res.on('data', function (data) {
//     console.log(data.toString());
//   });
//   res.on('error', function (err) {
//     console.log('oh noes');
//   });
// });