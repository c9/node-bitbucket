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

  describe('/v1/todos', function () {
    it("can view own todo", function (done) {
      //I want the raw response for most test cases.
      request({
        method: "GET",
        headers: {
          'content-type': 'application/json',
          Cookie: cookie
        },
        uri: todourl
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.equal(null);
        //empty response
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        var data = JSON.parse(body);
        todolength = data.length;
        done();
      });
    });
  });


  var todourl = baseurl + '/v1/todos';
  describe('/v1/todos', function () {
    it("successfully create todo with user", function (done) {
      //I want the raw response for most test cases.
      request({
        method: "POST",
        body: JSON.stringify({ "text": "test" }),
        headers: {
          'content-type': 'application/json',
          Cookie: cookie
        },
        uri: todourl
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.equal(null);
        //empty response
        console.log(response.headers);
        console.log(response.statusCode);
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        var data = JSON.parse(body);
        expect(data.user_id).not.to.be.null;
        done();
      });
    });
  });

  describe('/v1/todos', function () {
    it("can view own todo", function (done) {
      //I want the raw response for most test cases.
      request({
        method: "GET",
        headers: {
          'content-type': 'application/json',
          Cookie: cookie
        },
        uri: todourl
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.equal(null);
        //empty response
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        var data = JSON.parse(body);
        expect(data.length).to.be.equal(todolength+1);
        done();
      });
    });
  });

  describe('/v1/login', function () {
    it("successfully login with userhasnotodos:userhasnotodos", function (done) {
      request({
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          "username": "userhasnotodos",
          "password": "userhasnotodos"
        }), //sets header to application/json and parses body as json
        uri: loginurl
      }, function (error, response, body) {
        console.log(response.headers);
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        expect(response.headers['set-cookie']).not.to.be.undefined;
        cookie2 = response.headers['set-cookie'];
        done();
      });
    });
  });

  describe('/v1/todos', function () {
    it("cannot view other todos", function (done) {
      //I want the raw response for most test cases.
      request({
        method: "GET",
        headers: {
          'content-type': 'application/json',
          Cookie: cookie2
        },
        uri: todourl
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.equal(null);
        //empty response
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        var data = JSON.parse(body);
        expect(data.length).to.be.equal(0);
        done();
      });
    });
  });



});

