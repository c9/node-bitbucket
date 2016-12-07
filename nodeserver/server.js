var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
var init = process.env.INIT || false;
const NEXMO_API = process.env.NEXMO_API || '123';
const NEXMO_SECRET = process.env.NEXMO_SECRET || '123';
const low = require('lowdb');

const db = low('db.json');
const PROTOCOL = process.env.PROTOCOL || 'http';
const ENDPOINT_PORT = process.env.ENDPOINT_PORT || port;
const HOST = process.env.HOST || 'localhost';
const BASE_URL = PROTOCOL + "://" + HOST + ':' + ENDPOINT_PORT;
const CRON_TIMER_SECONDS = process.env.CRON_TIMER_SECONDS || 2;

const MongoClient = require('mongodb').MongoClient;

const MONGO_CONNECTION = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/voice';


MongoClient.connect(MONGO_CONNECTION, function(err, db) {
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
      console.log(err);
      console.log(result.ops);
    console.log("Inserted 3 documents into the document collection");
  });
});



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
app.use(morgan('combined'));


var opts = { db: db, app: app };

var voice = require('./voice.js')(opts);
var ping = require('./ping.js')(opts);


app.listen(port, ip, function () {
});

var request = require('request');
var cron = require('node-cron');

cron.schedule('*/' + CRON_TIMER_SECONDS + ' * * * * *', function () {
    console.log('ping job running');
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
