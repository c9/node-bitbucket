var request = require('request');
var expect = require("chai").expect;

describe("todos endpoints", function () {

  var baseurl = "http://localhost:3000";
  var loginurl = baseurl + '/v1/login';

  describe('/v1/login', function () {
    it("successfully login with admin:admin", function (done) {
      request({
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          "username": "admin12345",
          "password": "admin12345"
        }), //sets header to application/json and parses body as json
        uri: loginurl
      }, function (error, response, body) {
        console.log(response.headers);
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        expect(response.headers['set-cookie']).not.to.be.undefined;
        cookie = response.headers['set-cookie'];
        done();
      });
    });
  });
  socketurl = 'http://localhost:3000/v1/todos';

  // socketurl = 'http://localhost:3000';

  describe('/v1/todos', function () {
    it("successfully receive connected info event", function (done) {
      var socket = require('socket.io-client')(socketurl);
      socket.on('connect', function () {
      });
      socket.on('info', function (data) {
        console.log(data);
        var data = JSON.parse(data);
        expect(data.data).to.be.equal('connected');
        done();
      });
    });

    it("successfully receive connected info event", function (done) {
      var socket = require('socket.io-client')(socketurl);
      socket.on('info', function (data) {
        done();
      });
    });

    
  });





});

