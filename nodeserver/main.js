module.exports = function (opts, callback) {
    var module = {};
    var bodyParser = require('body-parser');
    var express = require('express');

    var extend = require('util')._extend;
    var envvars = process.env || {};

    var params = {};
    try {
        params = require(__dirname + '/params');
    }
    catch (e) {
    }
    var envparams = params.env || {};

    envvars = extend(envvars, params.env);

    require('dotenv').config();

    const MONGO_URI = envvars.MONGO_URI || 'mongodb://localhost:27017';



    var app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(require('cookie-parser')());

    var expressSession = require('express-session');

    var sessionMiddleware = expressSession(
        {
            secret: process.env.EXPRESS_SESSION_SECRET,
            store: new (require("connect-mongo")(expressSession))({
                url: MONGO_URI
            })
        });
    app.use(sessionMiddleware);

    var passport = require('passport');

    app.use(passport.initialize());
    app.use(passport.session());

    const PORT = process.env.PORT || 0;

    const PROXIED_PORT = process.env.PROXIED_PORT || 0;

    var ip = envvars.IP || '0.0.0.0';
    var init = envvars.INIT || false;

    const CONSOLE_LOG_LEVEL = process.env.CONSOLE_LOG_LEVEL || 'debug';
    const NEXMO_API_KEY = envvars.NEXMO_API_KEY || '123';
    const NEXMO_API_SECRET = envvars.NEXMO_API_SECRET || '123';
    const NEXMO_BASE_URL = envvars.NEXMO_BASE_URL || 'http://localhost:3100';
    const VOICE_API_BASE_URL = envvars.VOICE_API_BASE_URL || 'http://localhost:3000/api/v1/voice';
    const PAPERTRAIL_LEVEL = envvars.PAPERTRAIL_LEVEL || 'warn';
    const FTP_BASE = envvars.FTP_BASE || 'http://localhost';
    const FTP_HOST = envvars.FTP_HOST || 'http://localhost';
    const FTP_PASSWORD = envvars.FTP_PASSWORD || 'http://localhost';
    const FTP_USER = envvars.FTP_USER || 'http://localhost';

    const low = require('lowdb');
    const fs = require('fs');
    const path = require('path');
    var winston = require('winston');

    var morgan = require('morgan');

    process.on('uncaughtException', function (err) {
        winston.error('uncaughtException', { message: err.message, stack: err.stack }); // logging with MetaData
        process.exit(1); // exit with failure
    });


    winston.stream = {
        write: function (message, encoding) {
            winston.log('debug', message);
        }
    };

    app.use(morgan('combined', { stream: winston.stream }));

    var Papertrail = require('winston-papertrail').Papertrail;

    transports = [
        new winston.transports.File({
            level: 'info',
            filename: path.join(__dirname, 'access.log'),
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: CONSOLE_LOG_LEVEL,
            colorize: true
        })
    ]

    if (process.env.PAPERTRAIL_ENABLED) {
        transports.push(new Papertrail({
            host: 'logs5.papertrailapp.com',
            port: 26785,
            program: 'nodeserver',
            level: PAPERTRAIL_LEVEL,
        }))
    }


    winston.configure({
        transports: transports
    });



    if (process.env.PAPERTRAIL_ENABLED) {
        winston.loggers.add('todos', {
            console: {
                level: 'debug',
                colorize: true
            },
            papertrail: {
                host: 'logs5.papertrailapp.com',
                port: 26785,
                program: 'nodeserver',
                level: PAPERTRAIL_LEVEL,
            }
        });

        winston.loggers.add('proxy-server', {
            console: {
                level: 'debug',
                colorize: true
            },
            papertrail: {
                host: 'logs5.papertrailapp.com',
                port: 26785,
                program: 'nodeserver',
                level: PAPERTRAIL_LEVEL,
            }
        });
    }
    else {
        winston.loggers.add('todos', {
            console: {
                level: 'debug',
                colorize: true
            },
            // papertrail: {
            //     host: 'logs5.papertrailapp.com',
            //     port: 26785,
            //     program: 'nodeserver',
            //     level: PAPERTRAIL_LEVEL,
            // }
        });

        winston.loggers.add('proxy-server', {
            console: {
                level: 'debug',
                colorize: true
            },
            // papertrail: {
            //     host: 'logs5.papertrailapp.com',
            //     port: 26785,
            //     program: 'nodeserver',
            //     level: PAPERTRAIL_LEVEL,
            // }
        });
    }


    var proxyLogger = winston.loggers.get('proxy-server');

    winston.info("console_log_level:" + CONSOLE_LOG_LEVEL);



    const PROTOCOL = envvars.PROTOCOL || 'http';
    const HOST = envvars.HOST || 'localhost';
    // const BASE_URL = PROTOCOL + "://" + HOST + ':' + ENDPOINT_PORT;
    const CRON_TIMER_SECONDS = envvars.CRON_TIMER_SECONDS || 300;

    const MongoClient = require('mongodb').MongoClient;

    const MONGO_CONNECTION = envvars.MONGO_CONNECTION || 'mongodb://localhost:27017/voice';


    var main_application;
    MongoClient.connect(MONGO_CONNECTION, function (err, db) {
        database = mongo_db = db;

        var server = require('http').Server(app);

        io = require('socket.io')(server);

        var server = server.listen(PROXIED_PORT, function () {
            winston.info('main application listening on port: ' + server.address().port);
            app.set('port', server.address().port);
            setupProxy();
        });

        todosnsp = io.of('/v1/todos');
        addLoginRouter();

        addVoiceRouter();
        addTodosRouter();
    });

    function addLoginRouter() {

        app.use('/v1', require(__dirname + '/v1/login/main.js')({
            winston: winston,
            database: database,
            passport: passport,
            // app: app
        }).router);


        app.use("/public", express.static(__dirname + "/public"));
    }

    function addTodosRouter() {
        const todos = mongo_db.collection('todos');
        app.use("/v1/todos/public", express.static(__dirname + "/v1/todos/public"));

        app.use('/v1/todos', require('./v1/todos/main.js')({
            winston: winston.loggers.get('todos'),
            db: mongo_db,
            io: todosnsp,
            sessionMiddleware: sessionMiddleware
        }).router);
    }

    function addVoiceRouter() {
        var voice = require('./v1/voice.js')({
            db: mongo_db, express: express, winston: winston,
            app: app, nexmo: {
                api_key: NEXMO_API_KEY, api_secret: NEXMO_API_SECRET,
                base_url: NEXMO_BASE_URL
            },
            base_url: VOICE_API_BASE_URL,
            main_application: main_application
        });
        app.use('/api/v1/voice', voice.router);
    }

    app.use(express.static(path.join(__dirname, 'public/')));



    function setupProxy() {
        var ping = require('./v1/ping.js')({});
        var fileapi = require('./v1/files/main.js')({ winston: winston });
        var ftp = require('./v1/ftp/main.js')({ winston: winston });

        app.use('/api/v1/files', fileapi.router);
        app.use('/api/v1/ping', ping.router);
        // app.use('/api/v1/ftp', ftp.router); //not important

        app.use('/ping', ping.router);

        //contains listen for io to work
        // require('./dashboard/app.js')({ HOST: HOST, PORT: port, winston: winston, app: app });

        var request = require('request');
        var cron = require('node-cron');

        if (process.env.PING_URL) {
            cron.schedule('*/' + 10 + ' * * * * *', function () {
                var url = process.env.PING_URL;
                request.get({
                    headers: { 'X-PING': 'PING' },
                    url: url,
                    followRedirect: false
                }, function (error, response, body) {
                });
                request.post({
                    headers: { 'X-PING': 'PING' },
                    url: url,
                    followRedirect: false
                }, function (error, response, body) {
                });
            });
        }




        //proxy 
        var https = require('https');
        var http = require('http');
        var httpProxy = require('http-proxy');
        var proxy = httpProxy.createProxyServer();

        // var proxyServer = http.createServer(function (req, res) {
        //   proxy.web(req, res);
        // });

        // Listen to the `upgrade` event and proxy the
        // WebSocket requests as well.

        request_body_array = [];


        var privateKey = fs.readFileSync(__dirname + '/certs/localhost.key', 'utf8');
        var certificate = fs.readFileSync(__dirname + '/certs/localhost.crt', 'utf8');
        var credentials = { key: privateKey, cert: certificate };

        var uuid = require('node-uuid');

        var httpServer = http.
            createServer(
            function (req, res) {
                proxyLogger.debug('proxyrequest', req.headers);
                var proxyReq = req;
                var proxyRes = res;

                var proxy_uuid = uuid.v1();

                var url = require('url');
                var path = url.parse(proxyReq.url, true).pathname;
                if (path.indexOf('/private/Downloads') !== -1) {
                    winston.info('start request');
                    var headers = {
                        cookie: proxyReq.headers['cookie'] ? proxyReq.headers['cookie'] : null
                    };
                    winston.info(headers, 'headers');
                    request({
                        method: 'GET',
                        headers: headers,
                        uri: 'http://0.0.0.0:' + app.get('port') + '/ping/isadmin'
                    }, function (error, response, body) {
                        if (error) {
                            winston.error(error)
                            proxyRes.writeHead(500);
                            return proxyRes.end("There was an error. Please try again");
                        }
                        winston.info(body);

                        if (response.statusCode !== 200) {
                            proxyRes.writeHead(response.statusCode);
                            return proxyRes.end(response.body)
                        }
                        var www_authenticate = require('www-authenticate');
                        var authenticator = www_authenticate.authenticator(FTP_USER, FTP_PASSWORD);

                        var options = {
                            url: FTP_BASE + path,
                            method: 'GET',
                            path: path,
                            rejectUnauthorized: false,
                            headers: proxyReq.headers
                        };
                        request(options,
                            function (err, res, body) {
                                console.log(res.statusCode);
                                console.log(res.headers);
                                console.log(body);
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (res.statusCode === 401) {
                                    authenticator.get_challenge(res);
                                    authenticator.authenticate_request_options(options);
                                    req.headers['authorization'] = options.headers['authorization'];
                                }

                                console.log(options);
                                console.log(req.headers);

                                var target = FTP_BASE;

                                console.log(req.headers);

                                proxy.web(proxyReq, proxyRes, {
                                    target: target,
                                    secure: false,
                                    // ws: true
                                }, function (err) {
                                    winston.log('error', err);
                                    proxyRes.writeHead(502);
                                    proxyRes.end("There was an error. Please try again");
                                });
                            }
                        );
                    });

                }
                else {
                    // var target = "http://localhost:" + app.get('port');
                    // winston.log('debug', 'target:' + target);
                    proxy.web(proxyReq, proxyRes, {
                        target: {
                            host: 'localhost',
                            port: app.get('port')
                        },
                        secure: false
                    }, function (err) {
                        winston.log('error', err);
                        proxyRes.writeHead(502);
                        proxyRes.end("There was an error. Please try again");
                    });
                }
            }
            ).listen(PORT, function () {
                callback(httpServer.address().port);
            });


        var wsProxy = new httpProxy.createProxyServer({
            target: {
                host: 'localhost',
                port: app.get('port')
            }
        });

        httpServer.on('clientError', (err, socket) => {
            console.log('server clientError', err);
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });

        httpServer.on('upgrade', function (req, socket, head) {
            winston.info('upgrade event');
            winston.info('head', head);
            winston.info('haeders', req.headers);
            wsProxy.ws(req, socket, head, function (err) {
                winston.log('error', err);
            });
        });



        proxy.on('proxyRes', function (res, req) {
            // var lvl = 'info';

            // console.log(res.headers);

            // var host = req.headers.host;
            // var data = [];
            // res.headers['proxy-uuid'] = req.headers['proxy-uuid'];

            // res.on('data', function (chunk) {
            //     data.push(chunk);
            // });
        });


    }


}