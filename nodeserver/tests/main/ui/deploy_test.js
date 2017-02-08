// request = expect = path = app

if (typeof request == 'undefined') request = require('request');
if (typeof expect == 'undefined') expect = require('chai').expect;
if (typeof path == 'undefined') path = require('path');
if (typeof appServer == 'undefined') {
    var port = process.env.PORT || 3000;
}
else {
    var port = appServer.address().port;
}
const PORT = port;

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
                console.log(response.headers);
                expect(error).to.be.equal(null);
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    })


});