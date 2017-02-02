var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
require('dotenv').config();
var winston = logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      colorize: true,
      // json: true 
    }),
  ]
});

const MongoClient = require('mongodb').MongoClient;

const MONGO_URI = process.env.MONGO_URI;

const TODOS_APP_PORT = process.env.TODOS_APP_PORT;




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

  var expressSession = require('express-session');

  var sessionMiddleware = expressSession(
    {
      secret: 'keyboard cat',
      store: new (require("connect-mongo")(expressSession))({
        url: MONGO_URI
      })
    });
  app.use(sessionMiddleware);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/v1', require(__dirname + '/../login/main.js')({
    winston: logger,
    database: database,
    passport: passport,
  }).router);

  app.use("/v1/todos/public", express.static(__dirname + "/public"));

  app.use("/public", express.static(__dirname + "/../../public"));


  var server = require('http').Server(app);
  const io = require('socket.io')(server);



  server.listen(TODOS_APP_PORT, function () {
    winston.info('todo app listening on port' + server.address().port);

  });

  const nsp = io.of('/v1/todos');

  app.use('/v1/todos', require('./main.js')({
    winston: logger,
    db: database,
    io: nsp,
    sessionMiddleware: sessionMiddleware

  }).router);

});




