const alexa = require("alexa-app");
const express = require('express');


const VERSION = '1.0';


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
        debug: true
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


}