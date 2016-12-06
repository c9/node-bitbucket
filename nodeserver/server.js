var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
var init = process.env.INIT || false;
const NEXMO_API = process.env.NEXMO_API || '123';
const NEXMO_SECRET = process.env.NEXMO_SECRET || '123';
const low = require('lowdb');
const db = low('db.json');
const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const BASE_URL = PROTOCOL + "://" + HOST + ':' + port;

const CRON_TIMER_SECONDS = process.env.CRON_TIMER_SECONDS || 120;


if (init) {
    console.log('start init');

    db.defaults({ settings: {} })
        .value();

    db.set('settings.nexmo_api', NEXMO_API).value();
    db.set('settings.nexmo_secret', NEXMO_SECRET).value();


}

console.log(db.getState());

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

var opts = { db: db, app: app };

var voice = require('./voice.js')(opts);
var ping = require('./ping.js')(opts);


app.listen(port, ip, function () {
});

var request = require('request');
var cron = require('node-cron');

cron.schedule('*/' + CRON_TIMER_SECONDS + ' * * * * *', function () {
    request.get({
        headers: { 'X-PING': 'PING' },
        url: BASE_URL + '/ping',
        followRedirect: false
    }, function (error, response, body) {
        console.log(body);
    });
    request.post({
        headers: { 'X-PING': 'PING' },
        url: BASE_URL + '/ping',
        followRedirect: false
    }, function (error, response, body) {
        console.log(body);
    });
});
