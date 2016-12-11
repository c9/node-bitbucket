var request = require('request');
var expect = require("chai").expect;



describe("Voice endpoints", function () {

  var url = "http://localhost:3000/api/v1/voice/events?query_param=1";
  describe('/events', function () {
    it("returns status 201", function (done) {
      request({
        method: "POST",
        json: {"event": 1},
        uri: url
      }, function (error, response, body) {
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(201);
        done();
      });
    });
  })

});

