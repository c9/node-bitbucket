// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var fs = require('fs');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
var request = require('request');

// sign with RSA SHA256
var cert = fs.readFileSync(__dirname+'/../private.pem');  // get private key
var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});

// var token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 600 }, 'shhhhh');

// var alg = 'Sha256';
var alg = 'RS256';
// var alg = 'HS256';

// sign asynchronously
jwt.sign({ foo: 'bar' }, cert, { algorithm: alg }, function(err, token) {
  console.log(token);
  request({
      'uri': 'http://localhost:3100/calls',
      'method': 'GET',
      'headers': {
          'Authorization': 'Bearer '+token
      }
  },function(err,response,body) {
      console.log(err);
      console.log(body);
  })
});