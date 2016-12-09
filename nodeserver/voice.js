module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = opts.express || require('express');
    var app = opts.app; //express app
    var winston = opts.winston || require('winston');

    var router = express.Router();
    var nexmo = opts.nexmo;

    var module = {};

    module.router = router;

    module.opts = opts;
    const db = module.db = opts.db;

    var request = require("request");

    var options = {
        method: 'POST',
        url: nexmo.base_url + '/applications/',
        qs:
        {
            api_key: nexmo.api_key,
            api_secret: nexmo.api_secret,
            name: 'test',
            type: 'voice',
            event_url: '1',
            answer_url: '1'
        },
        headers: {}
    };

    request(options, function (error, response, body) {
        if (error) {
            winston.log('error', error);
        }

        else {
            var logRequest = {
                // options: JSON.stringify(options),
                // responseBody: body,
                url: options.url,
                method: options.method,
                responseStatusCode: response.statusCode
            };
            winston.log('info',JSON.stringify(logRequest));
            var collection = db.collection('nexmo_request_log');
            collection.insert(logRequest,
            function (err) {
                if (err) winston.error(err);
            });
        }

    });



    var collection = db.collection('init');

    collection.insert({ server_start: Date.now() },
        function (err, result) {
            if (err) winston.error(err);
            winston.info(JSON.stringify(result.ops));
        });

    var staticRoot = __dirname + '/public';

    router.use(express.static(staticRoot));


    router.get('/ivr', function (req, res) {
        res.send('ivr');
        // res.send(res.body);
    });

    router.post('/', function (req, res) {
        res.send(req.body);
    });

    module.registerApp = function (protocol, host, port) {

    }

    module.app = app;

    module.auth = function (req, res) {
        // This will be available 'outside'.
        // Authy stuff that can be used outside...
    };

    function privateFunction(pickle, jar) {
        // This will be NOT available 'outside'.
    };

    return module;
};