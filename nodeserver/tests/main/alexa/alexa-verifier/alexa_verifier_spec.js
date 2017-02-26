// var test = require('tap').test
var url = require('url')
const verifier = require('alexa-verifier');
var expect = require("chai").expect;
var moment = require('moment-timezone');


var sinon = require('sinon');


describe('verifier tests', function () {



    it('handle invalid cert_url parameter', function (done) {
        var body, now, signature
        signature = 'JbWZ4iO5ogpq1NhsOqyqq/QRrvc1/XyDwjcBO9wWSk//c11+gImmtWzMG9tDEW40t0Xwt1cnGU93DwUZQzMyzJ5CMi+09qVQUSIHiSmPekKaQRxS0Ibu7l7cXXuCcOBupbkheD/Dsd897Bm5SQwd1cFKRv+PJlpmGKimgh2QmbivogsEkFl8b9SW48kjKWazwj/XP2SrHY0bTvwMTVu7zvTcp0ZenEGlY2DNr5zSd1n6lmS6rgAt1IPwhBzqI0PVMngaM0DQhB0wUPj3QoIUh0IyMVAQzRFbQpS4UGrA4M9a5a+AGy0jCQKiRCI+Yi9iZYEVYvfafF/lyOUHHYcpOg=='
        now = new Date()
        body = {
            request: {
                timestamp: now.getTime()
            }
        }
        verifier(void 0, signature, JSON.stringify(body), function (er) {

            expect(er.indexOf('Certificate URI MUST be https')).to.be.equal(0)
            done()
        })
    })


    it('handle invalid body json', function (done) {
        var cert_url, signature
        cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert.pem'
        signature = 'JbWZ4iO5ogpq1NhsOqyqq/QRrvc1/XyDwjcBO9wWSk//c11+gImmtWzMG9tDEW40t0Xwt1cnGU93DwUZQzMyzJ5CMi+09qVQUSIHiSmPekKaQRxS0Ibu7l7cXXuCcOBupbkheD/Dsd897Bm5SQwd1cFKRv+PJlpmGKimgh2QmbivogsEkFl8b9SW48kjKWazwj/XP2SrHY0bTvwMTVu7zvTcp0ZenEGlY2DNr5zSd1n6lmS6rgAt1IPwhBzqI0PVMngaM0DQhB0wUPj3QoIUh0IyMVAQzRFbQpS4UGrA4M9a5a+AGy0jCQKiRCI+Yi9iZYEVYvfafF/lyOUHHYcpOg=='
        verifier(cert_url, signature, '', function (er) {
            expect(er).to.be.equal('request body invalid json');
            done()
        })
    })


    it('handle missing timestamp field', function (done) {
        var cert_url, signature
        cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert.pem'
        signature = 'JbWZ4iO5ogpq1NhsOqyqq/QRrvc1/XyDwjcBO9wWSk//c11+gImmtWzMG9tDEW40t0Xwt1cnGU93DwUZQzMyzJ5CMi+09qVQUSIHiSmPekKaQRxS0Ibu7l7cXXuCcOBupbkheD/Dsd897Bm5SQwd1cFKRv+PJlpmGKimgh2QmbivogsEkFl8b9SW48kjKWazwj/XP2SrHY0bTvwMTVu7zvTcp0ZenEGlY2DNr5zSd1n6lmS6rgAt1IPwhBzqI0PVMngaM0DQhB0wUPj3QoIUh0IyMVAQzRFbQpS4UGrA4M9a5a+AGy0jCQKiRCI+Yi9iZYEVYvfafF/lyOUHHYcpOg=='
        verifier(cert_url, signature, '{}', function (er) {
            expect(er).to.be.equal('Timestamp field not present in request')
            done()
        })
    })


    it('handle outdated timestamp field', function (done) {
        var body, cert_url, now, signature
        cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert.pem'
        signature = 'JbWZ4iO5ogpq1NhsOqyqq/QRrvc1/XyDwjcBO9wWSk//c11+gImmtWzMG9tDEW40t0Xwt1cnGU93DwUZQzMyzJ5CMi+09qVQUSIHiSmPekKaQRxS0Ibu7l7cXXuCcOBupbkheD/Dsd897Bm5SQwd1cFKRv+PJlpmGKimgh2QmbivogsEkFl8b9SW48kjKWazwj/XP2SrHY0bTvwMTVu7zvTcp0ZenEGlY2DNr5zSd1n6lmS6rgAt1IPwhBzqI0PVMngaM0DQhB0wUPj3QoIUh0IyMVAQzRFbQpS4UGrA4M9a5a+AGy0jCQKiRCI+Yi9iZYEVYvfafF/lyOUHHYcpOg=='
        now = new Date()
        body = {
            request: {
                timestamp: now.getTime() - 200000
            }
        }
        verifier(cert_url, signature, JSON.stringify(body), function (er) {
            console.log(er);
            expect(er).to.be.equal('Request is from more than 150 seconds ago')
            done()
        })
    })


    it('handle missing signature parameter', function (done) {
        var body, cert_url, now
        cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert.pem'
        now = new Date()
        body = {
            request: {
                timestamp: now.getTime()
            }
        }
        verifier(cert_url, void 0, JSON.stringify(body), function (er) {
            expect(er).to.be.equal('signature is not base64 encoded')
            done()
        })
    })


    it('handle invalid signature parameter', function (done) {
        var body, cert_url, now
        cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert.pem'
        now = new Date()
        body = {
            request: {
                timestamp: now.getTime()
            }
        }
        verifier(cert_url, '....$#%@$se', JSON.stringify(body), function (er) {
            expect(er).to.be.equal('signature is not base64 encoded')
            done()
        })
    })

    it('handle invalid base64-encoded signature parameter', function (done) {
        var body, cert_url, now
        cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem' // latest valid cert
        now = new Date()
        body = {
            request: {
                timestamp: now.getTime()
            }
        }
        verifier(cert_url, 'aGVsbG8NCg==', JSON.stringify(body), function (er) {
            expect(er).to.be.equal('certificate verification failed')
            done()
        })
    })

    it('handle valid signature', function (done) {

        var ts = '2017-02-10T07:27:59Z';
        // var ts = '2017-02-23T08:13:48-05:00';

        var now = new Date(ts);
        var clock = sinon.useFakeTimers(now.getTime());
        var cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem' // latest valid cert
        var signature = 'Qc8OuaGEHWeL/39XTEDYFbOCufYWpwi45rqmM2R4WaSEYcSXq+hUko/88wv48+6SPUiEddWSEEINJFAFV5auYZsnBzqCK+SO8mGNOGHmLYpcFuSEHI3eA3nDIEARrXTivqqbH/LCPJHc0tqNYr3yPZRIR2mYFndJOxgDNSOooZX+tp2GafHHsjjShCjmePaLxJiGG1DmrL6fyOJoLrzc0olUxLmnJviS6Q5wBir899TMEZ/zX+aiBTt/khVvwIh+hI/PZsRq/pQw4WAvQz1bcnGNamvMA/TKSJtR0elJP+TgCqbVoYisDgQXkhi8/wonkLhs68pN+TurbR7GyC1vxw==';
        var body = {
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
        verifier(cert_url, signature, JSON.stringify(body), function (er) {
            expect(er).to.be.equal(undefined);
            clock.restore();
            done()
        });
    })



    // it('handle valid signature', function (done) {
    //     // var ts = '2017-02-10T07:27:59Z';

    //     // moment().format('YYYY-MM-DDTHHmmssZ')

    //     var ts = moment().format();
    //     var ts = moment().format('YYYY-MM-DDTHH:mm:ssZ');// + 'Z';

    //     console.log(ts);

    //     // var ts = '2017-02-10T07:27:59Z';

    //     var cert_url = 'https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem' // latest valid cert
    //     var signature = 'Qc8OuaGEHWeL/39XTEDYFbOCufYWpwi45rqmM2R4WaSEYcSXq+hUko/88wv48+6SPUiEddWSEEINJFAFV5auYZsnBzqCK+SO8mGNOGHmLYpcFuSEHI3eA3nDIEARrXTivqqbH/LCPJHc0tqNYr3yPZRIR2mYFndJOxgDNSOooZX+tp2GafHHsjjShCjmePaLxJiGG1DmrL6fyOJoLrzc0olUxLmnJviS6Q5wBir899TMEZ/zX+aiBTt/khVvwIh+hI/PZsRq/pQw4WAvQz1bcnGNamvMA/TKSJtR0elJP+TgCqbVoYisDgQXkhi8/wonkLhs68pN+TurbR7GyC1vxw==';
    //     var body = {
    //         "version": "1.0",
    //         "session": {
    //             "new": true,
    //             "sessionId": "SessionId.7745e45d-3042-45eb-8e86-cab2cf285daf",
    //             "application": {
    //                 "applicationId": "amzn1.ask.skill.75c997b8-610f-4eb4-bf2e-95810e15fba2"
    //             },
    //             "attributes": {},
    //             "user": {
    //                 "userId": "amzn1.ask.account.AF6Z7574YHBQCNNTJK45QROUSCUJEHIYAHZRP35FVU673VDGDKV4PH2M52PX4XWGCSYDM66B6SKEEFJN6RYWN7EME3FKASDIG7DPNGFFFNTN4ZT6B64IIZKSNTXQXEMVBXMA7J3FN3ERT2A4EDYFUYMGM4NSQU4RTAQOZWDD2J7JH6P2ROP2A6QEGLNLZDXNZU2DL7BKGCVLMNA"
    //             }
    //         },
    //         "request": {
    //             "type": "IntentRequest",
    //             "requestId": "EdwRequestId.fa7428b7-75d0-44c8-aebb-4c222ed48ebe",
    //             "timestamp": ts,
    //             "locale": "en-US",
    //             "intent": {
    //                 "name": "HelloWorld"
    //             },
    //             "inDialog": false
    //         }
    //     };
    //     verifier(cert_url, signature, JSON.stringify(body), function (er) {
    //         console.log(er);
    //         // expect(er).to.be.undefined;
    //         // clock.restore();
    //         done()
    //     });
    // })
    // return;


})