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
MongoClient.connect(MONGO_URI, function (err, db) {
  const database = db;
  const todos = database.collection('todos');
  const app = express();

  app.use("/v1/todos/public", express.static(__dirname + "/public"));
  var server = require('http').Server(app);
  const io = require('socket.io')(server);

  server.listen(TODOS_APP_PORT,function() {
    winston.info('todo app listening on port' + server.address().port);

  });

  const nsp = io.of('/v1/todods');

  app.use('/v1/todos', require('./main.js')({
    winston: logger,
    todos: todos,
    io: nsp
  }).router)




  app.use(bodyParser.urlencoded({ extended: false }));


  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
});




