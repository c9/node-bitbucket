var request = require('request');
var expect = require("chai").expect;
const path = require('path');


var sinon = require('sinon');

const verifier = require('alexa-verifier');

process.env.MONGO_URI = 'mongodb://localhost:27017/mydb';
process.env.EXPRESS_SESSION_SECRET = 'test123';

// var app = require(path.join('..', '..', '..', 'server'));




describe(path.basename(__dirname), function () {
  this.timeout(0);
  describe('setup', function () {
    it('requires server', function (done) {
      main = require(path.join('..', '..', '..', 'main'))({}, function (port) {
        baseurl = "http://localhost:" + port;
        alexaurl = baseurl + '/v1/alexa';

        console.log('server listening on port ' + port);
        done();
      });
    });

    it('ping newly created server', function (done) {
      request.get({
        url: baseurl + '/v1/ping'
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.null;
        expect(response.statusCode).to.be.equal(200);
        done();
      });
    })
  });

  describe("/v1/alexa POST", function () {

    it('handle valid signature', function (done) {

      ts = '2017-02-10T07:27:59Z';
      // var ts = '2017-02-23T08:13:48-05:00';

      now = new Date(ts);
      clock = sinon.useFakeTimers(now.getTime());
      cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem' // latest valid cert
      signature = 'Qc8OuaGEHWeL/39XTEDYFbOCufYWpwi45rqmM2R4WaSEYcSXq+hUko/88wv48+6SPUiEddWSEEINJFAFV5auYZsnBzqCK+SO8mGNOGHmLYpcFuSEHI3eA3nDIEARrXTivqqbH/LCPJHc0tqNYr3yPZRIR2mYFndJOxgDNSOooZX+tp2GafHHsjjShCjmePaLxJiGG1DmrL6fyOJoLrzc0olUxLmnJviS6Q5wBir899TMEZ/zX+aiBTt/khVvwIh+hI/PZsRq/pQw4WAvQz1bcnGNamvMA/TKSJtR0elJP+TgCqbVoYisDgQXkhi8/wonkLhs68pN+TurbR7GyC1vxw==';
      body = {
        "version": "1.0",
        "session": {
          "new": true,
          "sessionId": "SessionId.7745e45d-3042-45eb-8e86-cab2cf285daf",
          "application": {
            "applicationId": "amzn1.ask.skill.75c997b8-610f-4eb4-bf2e-95810e15fba2"
          },
          "attributes": {},
          "user": {
            "userId": "amzn1.ask.account.AF6Z7574YHBQCNNTJK45QROUSCUJEHIYAHZRP35FVU673VDGDKV4PH2M52PX4XWGCSYDM66B6SKEEFJN6RYWN7EME3FKASDIG7DPNGFFFNTN4ZT6B64IIZKSNTXQXEMVBXMA7J3FN3ERT2A4EDYFUYMGM4NSQU4RTAQOZWDD2J7JH6P2ROP2A6QEGLNLZDXNZU2DL7BKGCVLMNA"
          }
        },
        "request": {
          "type": "IntentRequest",
          "requestId": "EdwRequestId.fa7428b7-75d0-44c8-aebb-4c222ed48ebe",
          "timestamp": ts,
          "locale": "en-US",
          "intent": {
            "name": "HelloWorld"
          },
          "inDialog": false
        }
      };

      body = JSON.stringify(body);

      headers = {
        signaturecertchainurl: cert_url,
        signature: signature,
        // body: body
        // rawBody: JSON.stringify(body)
      }
      verifier(headers.signaturecertchainurl, headers.signature, body, function (er) {
        expect(er).to.be.equal(undefined);
        done()
      });
    })

    it("returns status 201", function (done) {

      headers['content-type'] = 'application/json';

      console.log(alexaurl);
      request({
        headers: headers,
        method: "POST",
        body: body,
        followRedirect: false,
        url: alexaurl + '/forecast'
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.null;

        // expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(200);
        // expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
        done();
      });
      // clock.restore();


    });

    // describe({})

  });

});