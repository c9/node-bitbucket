// request = expect = path = app

request = require('request');
expect = require('chai').expect;
path = require('path');

const PORT = 3000;

const baseurl = "http://localhost:" + PORT;

describe(path.basename(__filename) + ".", function () {
    var ui = baseurl + "/public/ui";
    describe('home page.', function () {
        it("returns status 200", function (done) {
            request({
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                },
                uri: ui,
                followRedirect: true //frontend tests 301 -> 200 the 200 is important
            }, function (error, response, body) {
                console.log(ui);

                expect(error).to.be.equal(null);
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    })


});