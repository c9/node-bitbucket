var request = require('request');
var expect = require("chai").expect;
var http = require('http');

describe("todos endpoints", function () {

  var baseurl = "http://localhost:3000";
  var loginurl = baseurl + '/v1/login';
  var notificationurl = baseurl + '/v1/todos/sendNotification';

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
  socketurl = 'http://localhost:3000/v1/todos';

  it("successfully receive connected info event", function (done) {
    var socket = require('socket.io-client')(socketurl);
    socket.on('connect', function () {
    });
    socket.on('info', function (data) {
      console.log(data);
      var data = JSON.parse(data);
      expect(data.data).to.be.equal('connected');
      socket.close();
      done();
    });
  });

  it('notification send', function (done) {
    request({
      method: "POST",
      body: JSON.stringify({ "text": "test" }),
      headers: {
        'content-type': 'application/json',
        Cookie: cookie
      },
      uri: notificationurl
    }, function (error, response, body) {
      console.log(body);
      expect(error).to.be.equal(null);
      expect(response.statusCode).to.equal(201);
      expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
      done();
    });
  });


  it("successfully receive connected info event", function (done) {
    var socket = require('socket.io-client')(socketurl);
    socket.on('connect', function () {
      console.log('connect');
    });
    socket.on('info', function (data) {
      console.log(data);
      request({
        method: "POST",
        body: JSON.stringify({ "text": "test" }),
        headers: {
          'content-type': 'application/json',
          Cookie: cookie
        },
        uri: notificationurl
      }, function (error, response, body) {
        // console.log(response.headers);
        // done();
      });
    });

    socket.on('connected', function () {
      console.log('connected');
    });

    socket.on('notification', function (data) {
      var data = JSON.parse(data);
      expect(data.data.text).to.be.equal('test');
      socket.close();
      done();
    });

  });
});








