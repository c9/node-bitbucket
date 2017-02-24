const http = require('http');
const url = require('url');
const express = require('express');
//https://jordankasper.com/building-an-amazon-alexa-skill-with-node-js/
// https://github.com/jakerella/alexa-forecaster
const alexaVerifier = require('alexa-verifier');
const bodyParser = require('body-parser');

const router = express.Router();

const VERSION = '1.0';





module.exports = function (opts) {
    const logger = opts.logger;
    logger.info('started routing for /v1/alexa');

    module.router = router;


    function buildResponse(session, speech, card, end) {
        return {
            version: VERSION,
            sessionAttributes: session,
            response: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: speech
                },
                card: card,
                shouldEndSession: !!end
            }
        };
    }

    router.use(function (req, res, next) {
        console.log(req.headers);
        logger.info(req.headers);
        next();
    });

    router.use(function (req, res, next) {

        requestBody = JSON.stringify(req.body);

        console.log(requestBody);
        console.log(req.headers.signaturecertchainurl);
        console.log(req.headers.signature);

        alexaVerifier(
            req.headers.signaturecertchainurl,
            req.headers.signature,
            requestBody,
            function verificationCallback(err) {
                if (err) {
                    res.status(401).json({ message: 'Verification Failure', error: err });
                    res.end();
                } else {
                    next();
                }
            }
        );
    });

    router.post('/forecast', function (req, res) {

        console.log('New request for the forecaster:\n', req.body);



        // if (req.body.request.type === 'LaunchRequest') {
        //     res.json(
        //         buildResponse(
        //             { dateRequested: true },
        //             '<speak>I can tell you the weather<break time="1s"/> but you must give me a day!</speak>',
        //             {},
        //             false
        //         )
        //     );

        // } else 
        if (req.body.request.type === 'SessionEndedRequest') {

            if (req.body.request.reason === 'ERROR') {
                console.error('Alexa ended the session due to an error');
            }
            /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
             Per Alexa docs, we shouldn't send ANY response here... weird, I know.
             * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        }
        else if (req.body.request.type === 'IntentRequest' &&
            req.body.request.intent.name === 'HelloWorld') {
            console.log('hello world');
            var response = buildResponse(
                { dateRequested: true },
                '<speak>Hello world repsonse<break time="5s"/> Hi!</speak>',
                {},
                false
            );
            // throw Error('test error');
            // var response = {
            //     version: VERSION,
            //     sessionAttributes: { dateRequested: true },
            //     response: {
            //         outputSpeech: {
            //             type: 'SSML',
            //             ssml: '<speak>Hello world repsonse<break time="5s"/> Hi!</speak>',
            //         },
            //         card: {}
            //     },
            //     shouldEndSession: false
            // }
            // console.log(response);
            // res.end();
            // return;
            res.json(
                buildResponse(
                    { dateRequested: true },
                    '<speak>Hello world repsonse<break time="5s"/> Hi!</speak>',
                    {},
                    false
                )
            );//.send().status(201).end();
        }
        else {
            console.error('Intent not implemented: ', req.body);
            res.status(504).json({ message: 'Intent Not Implemented' });
        }

    });


    return module;
};