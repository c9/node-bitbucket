var request = require('request');
var expect = require("chai").expect;

var path = __dirname + '/../../utils/helper.js';
var helper = require(__dirname + '/../../utils/helper.js')({});
var test_globals = {};


describe("Files", function () {

    describe("Temp file create and get", function () {

        it("returns status 201", function (done) {
            helper.files.post({}, function (err, response, body) {
                var data = JSON.parse(body);
                expect(data.id).not.to.be.an('endefined');
                expect(data.id).to.be.a('string');
                test_globals.id = JSON.parse(body).id;
                expect(response.statusCode).to.equal(201);
                console.log(test_globals);
                done();
            });
        });

        it("returns status 200", function (done) {
            helper.files.view({ id: test_globals.id }, function (err, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("returns status 404", function (done) {
            helper.files.view({ id: test_globals.id }, function (err, response, body) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });

});