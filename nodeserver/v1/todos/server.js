var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
require('dotenv').config();
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

const MongoClient = require('mongodb').MongoClient;

const MONGO_URI = process.env.MONGO_URI;

const TODOS_APP_PORT = process.env.TODOS_APP_PORT;


//voice application setup
var main_application;
MongoClient.connect(MONGO_URI, function (err, db) {
  const database = db;
  const todos = database.collection('todos');
  var app = express();
  app.use("/v1/todos/public", express.static(__dirname + "/public"));

  app.use(bodyParser.urlencoded({ extended: false }));
  var server = app.use('/v1/todos', require('./main.js')({
    winston: logger,
    todos: todos
  }).router).listen(TODOS_APP_PORT, function () {
    winston.info('todo app listening on port' + server.address().port);

  });
});




