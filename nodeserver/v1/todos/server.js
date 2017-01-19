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

const TODOS_APP_PORT = process.env.TODOS_APP_PORT;




//voice application setup
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

  app.use('/v1', require(__dirname+'/../login/main.js')({
    winston: logger,
    database: database,
    passport: passport
  }).router);

  // const LocalStrategy = require('passport-local').Strategy;

  // passport.use(new LocalStrategy(
  //   function (username, password, done) {
  //    winston.debug('start authentication');
  //     winston.debug('start authentication');
  //     winston.debug(username);
  //     winston.debug(password);
  //     User.findOne({ username: username }, function (err, user) {
  //       if (err) { return done(err); }
  //       if (!user) {
  //         User.insert({ username: username, password: password });
  //         return done(null, user);
  //       }
  //       if (!(user.password == password)) {
  //         winston.debug('password does not match')
  //         return done(null, user);
  //       }
  //       winston.debug('user found password match');
  //       return done(null, user);
  //     });
  //   }
  // ));

  // const User = database.collection('user');

  // passport.serializeUser(function (user, done) {
  //   winston.debug('serializeUser');
  //   winston.debug(user);
  //   done(null, user._id);
  // });

  // passport.deserializeUser(function (id, done) {
  //   winston.debug('deserializeUser');
  //   winston.debug(id);
  //   User.findOne({ _id: ObjectID(id) }, function (err, user) {
  //     winston.debug(user);
  //     if (err) {
  //       winston.error(err);
  //     }
  //     done(err, user);
  //   });
  // });

  // app.post('/login', 
  //   passport.authenticate('local', { failureRedirect: '/login' }),
  //   function(req, res) {
  //     res.redirect('/');
  //   });

  //login end


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
    io: nsp
  }).router);



  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
});




