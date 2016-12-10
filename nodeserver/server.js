var bodyParser = require('body-parser');
var express = require('express');
var busboy = require('connect-busboy');

var app = express();
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: false }));

var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
var init = process.env.INIT || false;

const NEXMO_API = process.env.NEXMO_API || '123';
const NEXMO_SECRET = process.env.NEXMO_SECRET || '123';
const NEXMO_BASE_URL = process.env.NEXMO_BASE_URL || 'http://localhost:3100';

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
            // handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            // handleExceptions: true,
            json: false,
            colorize: true
        }),
        new Papertrail({
            host: 'logs5.papertrailapp.com',
            port: 26785,
            program: 'nodeserver',
            level: 'warn',
        })

    ],
    exitOnError: false
});

const db = low('db.json');
const PROTOCOL = process.env.PROTOCOL || 'http';
const ENDPOINT_PORT = process.env.ENDPOINT_PORT || port;
const HOST = process.env.HOST || 'localhost';
const BASE_URL = PROTOCOL + "://" + HOST + ':' + ENDPOINT_PORT;
const CRON_TIMER_SECONDS = process.env.CRON_TIMER_SECONDS || 300;

const MongoClient = require('mongodb').MongoClient;

const MONGO_CONNECTION = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/voice';

MongoClient.connect(MONGO_CONNECTION, function (err, db) {
    var collection = db.collection('documents');
    var voice = require('./voice.js')({db:db,express:express,winston:winston,
        app:app, nexmo: {
            api_key:NEXMO_API,api_secret:NEXMO_SECRET,
            base_url: NEXMO_BASE_URL
            }
        });
    app.use('/voice',voice.router);
    // Insert some documents
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        winston.info(err);
        winston.info(JSON.stringify(result.ops));
        winston.info("Inserted 3 documents into the document collection");
    });
});



if (init) {
    winston.info('start init');

    db.defaults({ settings: {} })
        .value();

    db.set('settings.nexmo_api', NEXMO_API).value();
    db.set('settings.nexmo_secret', NEXMO_SECRET).value();

}

winston.info(db.getState());



var morgan = require('morgan');


logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

// create a write stream (in append mode)

// setup the logger
app.use(morgan('combined', { stream: logger.stream }));


var opts = { db: db, app: app };

var ping = require('./ping.js')(opts);

var fileapi = require('./files/main.js')({winston:winston});

app.use('/file',fileapi.router);


app.listen(port, ip, function () {
});

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
