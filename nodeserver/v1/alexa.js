const alexa = require("alexa-app");
const express = require('express');

const r = require('request');

const moment = require('moment-timezone');
const tz = 'America/New_York';

const travis_master_branch = "https://api.travis-ci.org/repos/russjohnson09/coderuss/branches/master";

const seven_day_uptime = 'https://uptime.statuscake.com/?TestID=mOB59axrug';


const VERSION = '1.0';

const cheerio = require('cheerio');


// https://github.com/tejashah88/alexa-app-example/blob/master/index.js
module.exports = function (app) {


    // ALWAYS setup the alexa app and attach it to express before anything else.
    var alexaApp = new alexa.app("v1/alexa");

    alexaApp.express({
        expressApp: app,
        router: express.Router(),

        // verifies requests come from amazon alexa. Must be enabled for production.
        // You can disable this if you're running a dev environment and want to POST
        // things to test behavior. enabled by default.
        checkCert: process.env.ALEXA_CHECK_CERT != 0,

        // sets up a GET route when set to true. This is handy for testing in
        // development, but not recommended for production. disabled by default
        // debug: true
    });

    // now POST calls to /test in express will be handled by the app.request() function

    // from here on you can setup any other express routes or middlewares as normal
    app.set("view engine", "ejs");

    alexaApp.launch(function (request, response) {
        response.say("You launched the app!");
    });

    alexaApp.dictionary = { "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"] };

    alexaApp.intent("nameIntent", {
        "slots": { "NAME": "LITERAL" },
        "utterances": [
            "my {name is|name's} {names|NAME}", "set my name to {names|NAME}"
        ]
    },
        function (request, response) {
            response.say("Success!");
        }
    );

    function getAlexaReadableTime(serverstarted) {
    return moment(serverstarted).tz(tz).format('MMMM Do, h mm a z');
    }

    function doStatusIntent(resolve, reject, alexaRequest, alexaResponse) {
        var port = app.get('port');
        var serverport;
        var count = 0;
        var expectedCount = 2;
        var serverstarted;
        var lastBuildStatus;
        var ar = alexaResponse;
        var logcount;

        function readResponse() {
            count++;
            if (count == expectedCount) {
                console.log(serverstarted);
                var humanReadableTime = getAlexaReadableTime(serverstarted); 
                var msg = 'This server was deployed on ' + humanReadableTime +
                '. The status of the most recent build for this repository\'s master branch is ' + lastBuildStatus;
                if (logcount) {
                    msg += ". Your application has logged " + logcount 
                    + " events today."
                }
                console.log(msg);
                console.log(lastBuildStatus);
                alexaResponse.say(msg);
                resolve();
                return;
            }
        }

        r.get({
            url: travis_master_branch
        }, function (error, response, body) {
            lastBuildStatus = JSON.parse(body).branch.state;
            console.log(lastBuildStatus);
            readResponse();
        })


        r.get({
            headers: {
                'content-type': 'application/json'
            },
            url: 'http://0.0.0.0:' + port + '/v1/ping/detailed',
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                alexaResponse.say("I'm sorry but there was an error processing your request.");
                resolve();
                return;
            }
            else {
                console.log(body);
                var data = JSON.parse(body);
                serverstarted = data.server.started;
                serverport = data.server.port;
                if (data.logcount) {
                    logcount = data.logcount;
                }
                readResponse();
            }
        });

    }

    alexaApp.intent("statusIntent",
        function (alexaRequest, alexaResponse) {
            return new Promise(function (resolve, reject) {
                doStatusIntent(resolve, reject, alexaRequest, alexaResponse);
            });;
        }
    );


    // function doUptime(resolve, reject, alexaRequest, alexaResponse) {
    //     r.get({
    //         url: seven_day_uptime,
    //     }, function (error, response, body) {
    //         if (error) {
    //             console.log(error);
    //             alexaResponse.say("I'm sorry but there was an error processing your request.");
    //             resolve();
    //             return;
    //         }
    //         else {
    //             console.log(body);
    //             let $ = cheerio.load(body);
    //             console.log($);
    //             var uptime = $('#7Day .UptimeNumber').text()
    //             alexaResponse.say('Your 7 day uptime is '+ uptime);
    //             resolve();
    //             return;
    //         }
    //     });
    // }

    // alexaApp.intent("uptimeIntent",
    //     function (alexaRequest, alexaResponse) {
    //         return new Promise(function (resolve, reject) {
    //             doUptime(resolve, reject, alexaRequest, alexaResponse);
    //         });
    //     }
    // );


}