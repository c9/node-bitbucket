var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
require('dotenv').config();
var winston = logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

const MongoClient = require('mongodb').MongoClient;

const MONGO_URI = process.env.MONGO_URI;

const APP_PORT = process.env.APP_PORT;




MongoClient.connect(MONGO_URI, function (err, db) {
  const database = db;
  const todos = database.collection('todos');
  const app = express();
  var ObjectID = require('mongodb').ObjectID;


  var passport = require('passport');

  app.use(require('morgan')('combined'));
  app.use(require('cookie-parser')());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/v1', require(__dirname+'/main.js')({
    winston: logger,
    database: database,
    passport: passport
  }).router);

  app.use("/public", express.static(__dirname + "/../../public"));

  var server = require('http').Server(app);

  server.listen(APP_PORT, function () {
    winston.info('todo app listening on port' + server.address().port);

  });
});




