var request = require('request');
var expect = require("chai").expect;
const path = require('path');

baseurl = "http://localhost:" + 3000;
alexaurl = baseurl + '/v1/alexa';





describe(path.basename(__dirname), function () {

  describe("/v1/alexa POST", function () {

    it('responds with 201', function (done) {

      ts = '2017-02-10T07:27:59Z';
      // var ts = '2017-02-23T08:13:48-05:00';

      now = new Date(ts);
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
            "name": "InvalidRequest"
          },
          "inDialog": false
        }
      };

      body = JSON.stringify(body);

      request({
        method: "POST",
        body: body,
        uri: alexaurl
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

        var data = JSON.parse(body);
        expect(data.version).to.be.equal('1.0');
        expect(data.response).not.to.be.undefined;
        var response = data.response;
        expect(response.shouldEndSession).to.be.true;
        expect(response.outputSpeech).not.to.be.undefined;
        expect(response.outputSpeech.type).to.be.equal('SSML');
        expect(response.outputSpeech.ssml).to.be.a('string');


        done();
      });



    });

    it('statusIntent', function (done) {
      ts = '2017-02-10T07:27:59Z';
      now = new Date(ts);
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
            "name": "statusIntent"
          },
          "inDialog": false
        }
      };

      body = JSON.stringify(body);

      request({
        method: "POST",
        body: body,
        uri: alexaurl
      }, function (error, response, body) {
        console.log(body);
        expect(error).to.be.equal(null);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

        var data = JSON.parse(body);
        expect(data.version).to.be.equal('1.0');
        expect(data.response).not.to.be.undefined;
        var response = data.response;
        expect(response.shouldEndSession).to.be.true;
        expect(response.outputSpeech).not.to.be.undefined;
        expect(response.outputSpeech.type).to.be.equal('SSML');
        expect(response.outputSpeech.ssml).to.be.a('string');
        done();
      });



    });



  });
});
