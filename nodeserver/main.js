require('dotenv').config();

const low = require('lowdb');
const fs = require('fs');
const path = require('path');
var winston = require('winston');
winston.transports.Logsene = require('winston-logsene');

const cp = require('child_process');
const spawn = cp.spawn;

var root = path.normalize('..');
var bodyParser = require('body-parser');
var express = require('express');

const www_authenticate = require('www-authenticate');


var extend = require('util')._extend;

const USERS_LOG_LEVEL = process.env.USERS_LOG_LEVEL || 'error';

const ZORK_LOG_LEVEL = process.env.ZORK_LOG_LEVEL || 'error';

const CONSOLE_LOG_LEVEL = process.env.CONSOLE_LOG_LEVEL || 'warn';
const ACCESS_LOG_LEVEL = process.env.ACCESS_LOG_LEVEL || 'error';
const TODO_LOG_LEVEL = process.env.TODO_LOG_LEVEL || 'error';
const PROXY_LOG_LEVEL = process.env.PROXY_LOG_LEVEL || 'error';
const ALEX_CONSOLE_LOG_LEVEL = process.env.ALEX_CONSOLE_LOG_LEVEL || 'debug';

const NEXMO_API_KEY = process.env.NEXMO_API_KEY || '123';
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET || '123';
const NEXMO_BASE_URL = process.env.NEXMO_BASE_URL || 'http://localhost:3100';
const VOICE_API_BASE_URL = process.env.VOICE_API_BASE_URL || 'http://localhost:3000/api/v1/voice';
const PAPERTRAIL_LEVEL = process.env.PAPERTRAIL_LEVEL || 'warn';

const FTP_BASE = process.env.FTP_BASE || 'http://localhost';
const FTP_PASSWORD = process.env.FTP_PASSWORD || 'guest';
const FTP_USER = process.env.FTP_USER || 'guest';
const FTP_AUTHENTICATOR = www_authenticate.authenticator(FTP_USER, FTP_PASSWORD);


process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

const MONGO_URI = process.env.MONGO_URI;

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const CRON_TIMER_SECONDS = process.env.CRON_TIMER_SECONDS || 300;
const MONGO_CONNECTION = MONGO_URI;

const alexa = require(__dirname + '/v1/alexa');


const exceptionHandlers = [
    new winston.transports.File({
        filename: path.join(__dirname, 'exceptions.log'),
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false
    }),
    new winston.transports.Console({
        colorize: true,
        json: true
    })
];

function createAlexaApp(app) {
    alexa(app);
}

module.exports = function (opts, callback) {
    var module = {};

    const PORT = process.env.PORT || 0;

    const PROXIED_PORT = process.env.PROXIED_PORT || 0;

    var app = express();

    createAlexaApp(app);

    app.use("/tryit",
        express.static(
            path.join(__dirname, "/swagger-ui-master/dist")
        )
    );


    var server = require('http').Server(app);
    io = require('socket.io')(server);
    var server = server.listen(PROXIED_PORT, function () {
        winston.info('main application listening on port: ' + server.address().port);
        app.set('port', server.address().port);
        setupProxy();
    });

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


    winston.info(root, { 'root': root });

    winston.info(__dirname + '/../.apt/usr/games/frotz');

    const frotzcmd = getFrotzCmd();
    winston.info(frotzcmd, { 'frotz': frotzcmd });
    var args = [__dirname + "/v1/zork/Zork/DATA/ZORK1.DAT", '-i', '-p', '-q']

    var child = spawn(frotzcmd, args);

    child.stdout.on('data', function (data) {
        winston.debug(data);
    });

    child.stderr.on('data', function (data) {
        winston.error('stderr: ' + data.toString());
        process.exit(1);
    });






    var transports = getMainLoggerTransports();
    var mainLogger = new winston.Logger({
        transports: transports,
        exceptionHandlers: exceptionHandlers,
        exitOnError: false
    })

    var morgan = require('morgan');

    mainLogger.info('setting up morgan logging to winston');
    mainLogger.stream = {
        write: function (message, encoding) {
            mainLogger.log('debug', message);
        }
    };

    app.use(morgan('combined', { stream: mainLogger.stream }));

    addAppLoggers(transports);

    var proxyLogger = winston.loggers.get('proxy-server');

    winston.info("console_log_level:" + CONSOLE_LOG_LEVEL);


    const MongoClient = require('mongodb').MongoClient;



    var main_application;
    MongoClient.connect(MONGO_CONNECTION, function (err, db) {
        database = mongo_db = db;
        todosnsp = io.of('/v1/todos');
        addLoginRouter();

        app.use('/v1/users', require(__dirname + '/v1/users/main')({
            winston: winston.loggers.get('users'),
            database: database,
            passport: passport,
        }).router);

        addVoiceRouter();
        addTodosRouter();
        addZorkRouter();
    });

    app.use(express.static(path.join(__dirname, 'public/')));



    function setupProxy() {
        var ping = require('./v1/ping.js')({});
        var fileapi = require('./v1/files/main.js')({ winston: winston });
        var ftp = require('./v1/ftp/main.js')({ winston: winston });

        app.use('/api/v1/files', fileapi.router);

        app.use('/v1/ping', ping.router);

        app.use('/ping', ping.router);

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

                        var options = {
                            url: FTP_BASE + path,
                            method: 'GET',
                            path: path,
                            rejectUnauthorized: false,
                            headers: proxyReq.headers
                        };
                        request(options,
                            function (err, res, body) {
                                winston.debug(res.statusCode);
                                winston.debug(res.headers);
                                winston.debug(body);
                                if (err) {
                                    winston.error(err);
                                    return;
                                }
                                if (res.statusCode === 401) {
                                    FTP_AUTHENTICATOR.get_challenge(res);
                                    FTP_AUTHENTICATOR.authenticate_request_options(options);
                                    req.headers['authorization'] = options.headers['authorization'];
                                }

                                winston.debug(options);
                                winston.debug(req.headers);

                                var target = FTP_BASE;

                                winston.debug(req.headers);

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
                    proxy.on('proxyRes', function (proxyRes, req, res) {
                        if (proxyRes.statusCode >= 400) {
                            // mainLogger.warn(req.url + ' ' + proxyRes.statusCode);
                        }
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

    function addLoginRouter() {

        app.use('/v1', require(__dirname + '/v1/login/main.js')({
            winston: winston,
            database: database,
            passport: passport,
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



    function addZorkRouter() {

        app.use('/v1/zork', require(__dirname + '/v1/zork/main')({
            winston: winston.loggers.get('zork'),
            db: mongo_db,
            frotzcmd: frotzcmd,
            io: io.of('/v1/zork'),
            sessionMiddleware: sessionMiddleware
        }).router);
    }

}

// https://www.gnu.org/software/gettext/manual/html_node/The-TERM-variable.html
//set TERM=xterm for heroku
function getFrotzCmd() {

    if (fs.existsSync(__dirname + '/../.apt/usr/games/frotz')) {
        var val = __dirname + '/../.apt/usr/games/frotz';
    }
    else if (fs.existsSync('/usr/games/frotz')) {
        var val = '/usr/games/frotz';
    }
    else {
        var val = 'frotz';
    }
    return val;
}

function getMainLoggerTransports() {
    var transports = [
        new winston.transports.File({
            level: ACCESS_LOG_LEVEL,
            filename: path.join(__dirname, 'access.log'),
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: CONSOLE_LOG_LEVEL,
            colorize: true,
            // json: true
        })
    ];

    if (process.env.LOGSENE_TOKEN) {
        transports.push(new (winston.transports.Logsene)({
            token: process.env.LOGSENE_TOKEN,
            ssl: 'true',
            type: 'coderuss'
        }))
        exceptionHandlers.push(new (winston.transports.Logsene)({
            token: process.env.LOGSENE_TOKEN,
            ssl: 'true',
            type: 'coderuss'
        }))
        winston.info('creating logsene transport');
    }
    return transports;
}


function addAppLoggers(transports) {
    winston.loggers.add('todos', {
        console: {
            level: TODO_LOG_LEVEL,
            colorize: true
        },
    });

    winston.loggers.add('zork', {
        console: {
            level: ZORK_LOG_LEVEL,
            colorize: true
        },
    });

    winston.loggers.add('proxy-server', {
        console: {
            level: PROXY_LOG_LEVEL,
            colorize: true
        },
    });

    winston.loggers.add('users', {
        console: {
            level: USERS_LOG_LEVEL,
            colorize: true
        },
    });


    winston.loggers.add('alexa', {
        transports: transports
    });
}