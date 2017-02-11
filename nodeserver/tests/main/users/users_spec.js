var request = require('request');
var expect = require("chai").expect;

var fs = require('fs');

const port = 3000;
const baseurl = "http://localhost:" + port;

const TESTLOGGER_CONSOLE_LEVEL = process.env.TESTLOGGER_CONSOLE_LEVEL ? process.env.TESTLOGGER_CONSOLE_LEVEL : 'error';

const usersendpoint = baseurl + '/v1/users';
const loginurl = baseurl + '/v1/login';

const winston = require('winston');

winston.loggers.add('testlogger', {
    console: {
        level: process.env.TESTLOGGER_CONSOLE_LEVEL,
        colorize: true
    }
});

const logger = winston.loggers.get('testlogger')


describe(__filename, function () {

    it("/v1/users/me returns 401 when not logged in", function (done) {
        request({
            method: "GET",
            headers: {
                'content-type': 'application/json'
            },
            uri: usersendpoint + "/me",
            followRedirect: false,
            headers: {
            }
        }, function (error, response, body) {
            logger.debug(body);

            expect(error).to.be.equal(null);
            expect(response.statusCode).to.equal(401);
            expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

            var data = JSON.parse(body);

            expect(data.message, 'human readable message in response body').not.to.be.undefined;
            expect(data.status, 'status in 401 response body').not.to.be.undefined;

            done();
        });
    });

    it("successfully login with testuser1234:testuser1234", function (done) {
        request({
            method: "POST",
            json: {
                "username": "testuser1234",
                "password": "testuser1234"
            },
            uri: loginurl
        }, function (error, response, body) {
            expect(error).to.be.equal(null);
            expect(response.statusCode).to.equal(201);
            expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
            expect(response.headers['set-cookie']).not.to.be.undefined;
            cookie = response.headers['set-cookie'];
            done();
        });
    });

    it("successfully get testuser1234 using /v1/users/me", function (done) {
        request({
            method: "GET",
            headers: {
                'content-type': 'application/json'
            },
            uri: usersendpoint + "/me",
            followRedirect: false,
            headers: {
                cookie: cookie
            }
        }, function (error, response, body) {
            logger.debug(body);

            expect(error).to.be.equal(null);
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

            var data = JSON.parse(body);

            expect(data.username).not.to.be.undefined;
            expect(data.email).not.to.be.undefined;
            expect(data.name).not.to.be.undefined;

            expect(data.username).to.be.equal('testuser1234');

            done();
        });
    });


    describe("/v1/users/me POST updates user", function () {
        it("update email to testemail@email.com", function (done) {
            var email = 'testemail@email.com';
            request({
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    cookie: cookie
                },
                uri: usersendpoint + "/me",
                followRedirect: false,
                body: JSON.stringify({ email: email })
            }, function (error, response, body) {
                logger.debug(body);

                expect(error).to.be.equal(null);
                expect(response.statusCode).to.equal(201);
                expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

                var data = JSON.parse(body);

                expect(data.username).not.to.be.undefined;
                expect(data.email).not.to.be.undefined;
                expect(data.name).not.to.be.undefined;

                expect(data.username).to.be.equal('testuser1234');
                expect(data.email, 'email has been updated').to.be.equal(email);


                done();
            });
        });

        //https://dev.fitbit.com/docs/user/#update-profile
        /**
         * The way that this is being implemented means that the response you
         * get back might not be what you expect if someone is updating this 
         * record at the same time as you. This should be rare for this endpoint.
         */
        it("update email to testemail123@email.com", function (done) {
            var email = 'testemail123@email.com';
            request({
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    cookie: cookie
                },
                uri: usersendpoint + "/me",
                followRedirect: false,
                body: JSON.stringify({ email: email })
            }, function (error, response, body) {
                logger.debug(body);

                expect(error).to.be.equal(null);
                expect(response.statusCode, 'response with successful POST status code').to.equal(201);
                expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

                var data = JSON.parse(body);

                expect(data.username).not.to.be.undefined;
                expect(data.email).not.to.be.undefined;
                expect(data.name).not.to.be.undefined;

                expect(data.username).to.be.equal('testuser1234');
                expect(data.email, 'email has been updated').to.be.equal(email);

                done();
            });
        });

        it("update name to testemail123@email.com", function (done) {
            var name = 'testemail123@email.com';
            request({
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    cookie: cookie
                },
                uri: usersendpoint + "/me",
                followRedirect: false,
                body: JSON.stringify({ name: name })
            }, function (error, response, body) {
                logger.debug(body);

                expect(error).to.be.equal(null);
                expect(response.statusCode, 'response with successful POST status code').to.equal(201);
                expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');

                var data = JSON.parse(body);

                expect(data.username).not.to.be.undefined;
                expect(data.email).not.to.be.undefined;
                expect(data.name).not.to.be.undefined;

                expect(data.username).to.be.equal('testuser1234');
                expect(data.name, 'name has been updated').to.be.equal(name);

                done();
            });
        });
    })



});

