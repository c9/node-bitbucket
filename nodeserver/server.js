var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
var init = process.env.INIT || false;

const NEXMO_API_KEY = process.env.NEXMO_API_KEY || '123';
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET || '123';
const NEXMO_BASE_URL = process.env.NEXMO_BASE_URL || 'http://localhost:3100';
const CONSOLE_LOG_LEVEL = process.env.CONSOLE_LOG_LEVEL || 'info';
const VOICE_API_BASE_URL = process.env.VOICE_API_BASE_URL || 'http://localhost:3000/api/v1/voice';
const PAPERTRAIL_LEVEL = process.env.PAPERTRAIL_LEVEL || 'warn';

const low = require('lowdb');
const fs = require('fs');
const path = require('path');
var winston = require('winston');

var Papertrail = require('winston-papertrail').Papertrail;
var winston = logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: path.join(__dirname, 'access.log'),
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: CONSOLE_LOG_LEVEL,
            handleExceptions: true,
            json: true,
            colorize: true
        }),
        new Papertrail({
            host: 'logs5.papertrailapp.com',
            port: 26785,
            program: 'nodeserver',
            level: PAPERTRAIL_LEVEL,
        })

    ],
    exitOnError: false
});

const PROTOCOL = process.env.PROTOCOL || 'http';
const ENDPOINT_PORT = process.env.ENDPOINT_PORT || port;
const HOST = process.env.HOST || 'localhost';
const BASE_URL = PROTOCOL + "://" + HOST + ':' + ENDPOINT_PORT;
const CRON_TIMER_SECONDS = process.env.CRON_TIMER_SECONDS || 300;

const MongoClient = require('mongodb').MongoClient;

const MONGO_CONNECTION = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/voice';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';


//voice application setup
var main_application;
MongoClient.connect(MONGO_CONNECTION, function (err, db) {
    mongo_db = db;
    addVoiceRouter();

});

function addVoiceRouter() {
    var voice = require('./v1/voice.js')({
        db: mongo_db, express: express, winston: winston,
        app: app, nexmo: {
            api_key: NEXMO_API_KEY, api_secret: NEXMO_API_SECRET,
            base_url: NEXMO_BASE_URL
        },
        base_url:VOICE_API_BASE_URL,
        main_application: main_application
    });
    app.use('/api/v1/voice', voice.router);
}

var morgan = require('morgan');


logger.stream = {
    write: function (message, encoding) {
        logger.log('debug',message);
    }
};

// create a write stream (in append mode)

// setup the logger
app.use(morgan('combined', { stream: logger.stream }));

app.use(express.static(path.join(__dirname, 'public/')));




var ping = require('./v1/ping.js')({});
var fileapi = require('./v1/files/main.js')({ winston: winston });

app.use('/api/v1/files', fileapi.router);
app.use('/api/v1/ping', ping.router);
app.use('/ping', ping.router);

//contains listen for io to work
require('./dashboard/app.js')({HOST:HOST,PORT:port,winston:winston,app:app});
// app.listen(port, ip, function () {
// });

var request = require('request');
var cron = require('node-cron');

cron.schedule('*/' + CRON_TIMER_SECONDS + ' * * * * *', function () {
    var url = BASE_URL + '/ping';
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