module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var request = require("request");

    var express = opts.express || require('express');
    var app = opts.app; //express app
    var winston = opts.winston || require('winston');
    var base_url = opts.base_url;
    var event_url = base_url + '/events';

    var router = express.Router();
    var nexmo = opts.nexmo;
    var main_application = {};
    var uuid = require('node-uuid');
    var jwt = require('jsonwebtoken');



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
        return;
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

    router.get('', function (req, res) {
        res.status(200);
        res.send();
    });


    function assignToken(callback) {
        console.log(main_application);
        createToken(main_application.nexmo_application, function (error, token) {
            main_token = token;
            callback(null, token);
        })
    }

    function createToken(application, callback) {
        var payload = {
            jti: uuid.v1(),
            application_id: application.id,
            iat: parseInt(Date.now() / 1000),
        };
        var options = {
            algorithm: 'RS256'
        };
        var secret = application.keys.private_key;
        var token = jwt.sign(payload, secret, options);
        winston.info(token);
        callback(null, token);

    }


        router.get('/calls/:callId', function (req, res) {
        assignToken(function (err, token) {
            var options = {
                method: 'GET',
                url: nexmo.base_url + '/calls/'+req.params.callId,
                qs:
                {
                    api_key: nexmo.api_key,
                    api_secret: nexmo.api_secret
                },
                headers: {
                    'Authorization': 'Bearer '+token
                }
            };
            winston.log('info', 'get calls:', options);
            request(options, function (error, response, body) {
                if (error) {
                    winston.log('error', error);
                    res.status(500);
                    res.send(error);
                }
                else {
                    var lvl = 'info';
                    if (!(response.statusCode < 400)) {
                        lvl = 'error';
                    }
                    winston.log(lvl, response.statusCode);
                    winston.log(lvl, response.headers);
                    winston.log(lvl, body);
                    res.status(response.statusCode);
                    res.send(body);
                }

            });
        });
    });

    router.get('/calls', function (req, res) {
        assignToken(function (err, token) {
            var options = {
                method: 'GET',
                url: nexmo.base_url + '/calls/',
                qs:
                {
                    api_key: nexmo.api_key,
                    api_secret: nexmo.api_secret
                },
                headers: {
                    'Authorization': 'Bearer '+token
                }
            };
            winston.log('info', 'get calls:', options);
            request(options, function (error, response, body) {
                if (error) {
                    winston.log('error', error);
                    res.status(500);
                    res.send(error);
                }
                else {
                    var lvl = 'info';
                    if (!(response.statusCode < 400)) {
                        lvl = 'error';
                    }
                    winston.log(lvl, response.statusCode);
                    winston.log(lvl, response.headers);
                    winston.log(lvl, body);
                    res.status(response.statusCode);
                    res.send(body);
                }

            });
        });
    });


    router.get('/status', function (req, res) {
        winston.log('info', 'status');
        winston.log('info', 'headers', JSON.stringify(req.headers));
        winston.log('info', JSON.stringify(req.body));
        res.status(200);
        res.send('Success');
    });

    router.post('/events', function (req, res) {
        winston.log('info', 'events');
        winston.log('info', req.url);
        winston.log('info', 'queryParams:', JSON.stringify(req.query));
        winston.log('info', 'headers', JSON.stringify(req.headers));
        winston.log('info', JSON.stringify(req.body));
        res.set('content-type', 'application/json');
        res.status(201);
        res.send(default_answer);
    });

    router.get('/answers', function (req, res) {
        winston.log('info', 'answers');
        winston.log('info', 'headers', JSON.stringify(req.headers));
        winston.log('info', 'queryParams:', JSON.stringify(req.query));
        winston.log('info', JSON.stringify(req.body));
        res.status(200);
        res.set('Content-Type', 'application/json');
        res.send(default_answer);
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

    var default_answer = JSON.stringify([
        {
            "action": "talk",
            "text": "Welcome to a Voice API I V R. Press 1 for maybe and 2 for not sure followed by the hash key",
            "voiceName": "Amy"
        },
        {
            "action": "input",
            "submitOnHash": "true",
            "eventUrl": [event_url]
        }
    ]);

    default_answer = JSON.stringify([
        {
            "action": "talk",
            "text": "Please leave a message after the tone, then press #. We will get back to you as soon as we can",
            "voiceName": "Emma"
        },
        {
            "action": "record",
            "eventUrl": [
                event_url
            ],
            "endOnSilence": "3",
            "endOnKey": "#",
            "beepStart": "true"
        },
        {
            "action": "talk",
            "text": "Thank you for your message. Goodbye"
        }
    ]);

    return module;
};