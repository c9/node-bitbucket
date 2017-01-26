var request = require('request');
var expect = require("chai").expect;
var http = require('http');

describe("vue app tests", function () {

  var baseurl = "http://localhost:3000";
  var buildjsurl = baseurl + '/dist/build.js';

  it("/dist/build.js found", function (done) {
    request({
      method: "GET",
      headers: {
        'content-type': 'application/json'
      },
      uri: buildjsurl,
      followRedirect: false
    }, function (error, response, body) {
      expect(error).to.be.equal(null);
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

});








