var request = require('request');
var expect = require("chai").expect;



describe("login endpoints >>", function () {

  var baseurl = "http://localhost:3000";
  var loginurl = baseurl + '/v1/login';
  describe('/v1/login', function () {
    it("successfully login with admin:admin", function (done) {
      request({
        method: "POST",
        json: {
          "username": "admin",
          "password": "admin"
        },
        uri: loginurl
      }, function (error, response, body) {
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        expect(response.headers['set-cookie']).not.to.be.undefined;
        cookie = response.headers['set-cookie'];
        done();
      });
    });
  });

  var uri = baseurl + '/v1/profile';
  describe(uri, function () {
    it("use cookie to view profile", function (done) {
      request({
        method: "GET",
        uri: uri,
        followRedirect: false,
        headers: {
          Cookie: cookie
        }
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(200);
        var data = JSON.parse(body);
        expect(data.username).to.be.equal('admin');
        done();
      });
    });
  });


  describe('/v1/login', function () {
    it("fail to login as admin:admin2 bad password", function (done) {
      request({
        method: "POST",
        json: {
          "username": "admin",
          "password": "admin2"
        },
        uri: loginurl
      }, function (error, response, body) {
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(401);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        done();
      });
    });
  });

});

