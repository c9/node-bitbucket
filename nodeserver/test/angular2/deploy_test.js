var request = require('request');
var expect = require("chai").expect;

var path = __dirname + '/../../utils/helper.js';
var helper = require(__dirname + '/../../utils/helper.js')({});
var test_globals = {};


var baseurl = "http://localhost:3000";
var angular2base = baseurl + "/public/angular2";


describe("angular2 frontend", function () {

    it("returns status 200", function (done) {
        request({
            method: "GET",
            headers: {
                'content-type': 'application/json'
            },
            uri: angular2base,
            followRedirect: true //frontend tests 301 -> 200 the 200 is important
        }, function (error, response, body) {
            console.log(response.headers);
            expect(error).to.be.equal(null);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

});