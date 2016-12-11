module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var request = require("request");

    var express = opts.express || require('express');
    var app = opts.app; //express app
    var winston = opts.winston || require('winston');
    var base_url = opts.base_url;

    var router = express.Router();
    var nexmo = opts.nexmo;

    var module = {};

    module.router = router;

    module.opts = opts;
    const db = opts.db;

    var applicationsCollection = db.collection('applications');
    applicationsCollection.findOne({ title: "main_voice_application" }, function (err, document) {
        if (!document) {
            createApplication({ name: 'main_voice_application' },
                function (err, application) {
                    if (err) {
                        winston.log('error', err);
                        return;
                    }
                    if (application.id) {
                        applicationsCollection.insert({ "title": "main_voice_application", nexmo_application: application }, function (err, result) {
                            if (err) {
                                winston.log('error', err);
                            }
                            else {
                                winston.log('info', 'main_application_inserted:', result);
                                main_application = result.ops[0];
                                winston.log('info', 'main_voice_application:', JSON.stringify(main_application));
                            }
                        })
                    }

                })

        }
        else {
            main_application = document;
            winston.log('info', 'main_voice_application:', JSON.stringify(main_application));
        }
    });

    function createApplication(opts, callback) {
        var name = opts.name;
        var options = {
            method: 'POST',
            url: nexmo.base_url + '/applications/',
            qs:
            {
                api_key: nexmo.api_key,
                api_secret: nexmo.api_secret,
                name: name,
                type: 'voice',
                event_url: base_url + '/events',
                answer_url: base_url + '/answers'
            },
            headers: {}
        };
        winston.log('info', 'create application options:', options);
        request(options, function (error, response, body) {
            if (error) {
                winston.log('error', error);
                callback(error);
            }
            else {
                var lvl = 'info';
                if (response.statusCode < 400) {
                    lvl = 'error';
                }

                winston.log(lvl, response.statusCode);
                winston.log(lvl, response.headers);
                winston.log(lvl, body);
                callback(error, JSON.parse(body));

            }

        });
    }





    var collection = db.collection('init');

    collection.insert({ server_start: Date.now() },
        function (err, result) {
            if (err) winston.error(err);
            winston.info(JSON.stringify(result.ops));
        });

    var staticRoot = __dirname + '/public';

    router.use(express.static(staticRoot));

    router.get('/status', function (req, res) {
        winston.log('info', 'status');
        winston.log('info', 'headers', JSON.stringify(req.headers));
        winston.log('info', req.body);
        res.status(200);
        res.send('Success');
    });

    router.post('/events', function (req, res) {
        winston.log('info', 'events');

        winston.log('info', 'headers', JSON.stringify(req.headers));
        winston.log('info', req.body);
        res.status(201);
        res.send('Success');
    });

    router.get('/answers', function (req, res) {
        winston.log('info', 'answers');
        winston.log('info', 'headers', JSON.stringify(req.headers));
        winston.log('info', req.body);
        res.status(200);
        res.send('Success');
    });


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