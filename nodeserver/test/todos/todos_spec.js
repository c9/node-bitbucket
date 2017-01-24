var request = require('request');
var expect = require("chai").expect;



describe("todos endpoints", function () {

  var baseurl = "http://localhost:3000";
  var loginurl = baseurl + '/v1/login';
  describe('/v1/login', function () {
    it("successfully login with admin:admin", function (done) {
      request({
        method: "POST",
        json: { "username": "admin",
                "password": "admin" },
        uri: loginurl
      }, function (error, response, body) {
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        done();
      });
    });
  });


  describe('/v1/login', function () {
    it("fail to login as admin:admin2 bad password", function (done) {
      request({
        method: "POST",
        json: { "username": "admin",
                "password": "admin2" },
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

