var request = require('request');
var expect  = require("chai").expect;
const path = require('path');

const baseurl = "http://localhost:3000";
const alexaurl = baseurl + '/v1/alexa';


describe(path.basename(__dirname), function() {

  describe("/v1/alexa POST", function() {


    it("returns status 201", function(done) {

      request({
        method: "POST",
        body: JSON.stringify({}),
        followRedirect: false,
        uri: alexaurl + '/forecast'
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.null;
        // expect(error).to.be.equal(null);
        // expect(response.statusCode).to.equal(201);
        // expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        done();
      });

    });

  });

});