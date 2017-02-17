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
    new (winston.transports.File)({
      level: 'info',
      filename: __dirname + '/zork.log',
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
    }),

  ]
});

const MongoClient = require('mongodb').MongoClient;

const MONGO_URI = process.env.MONGO_URI;

const ZORK_PORT = process.env.ZORK_PORT;
// const fs = require('fs');

// const cp = require('child_process');
// const spawn = cp.spawn;
// var args = [__dirname + "/v1/zork/Zork/DATA/ZORK1.DAT"]

// if (fs.existsSync(__dirname + '/.apt/usr/games/frotz')) {
//   var val = __dirname + '/.apt/usr/games/frotz';
// }
// else if (fs.existsSync('/usr/games/frotz')) {
//   var val = '/usr/games/frotz';
// }
// else {
//   var val = 'frotz';
// }

const frotzcmd = 'frotz';

// winston.info(frotzcmd);

// var cmd = "frotz";
// var args = [__dirname + "/Zork/DATA/ZORK1.DAT", "-Q"];
// var child = spawn(cmd, args);




MongoClient.connect(MONGO_URI, function (err, db) {
  const database = db;
  const app = express();


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


  app.use("/", express.static(__dirname + "/../../public"));


  var server = require('http').Server(app);
  const io = require('socket.io')(server);



  server.listen(ZORK_PORT, function () {
    winston.info('zork app listening on port' + server.address().port);

  });

  const nsp = io.of('/v1/zork');

  app.use('/v1/zork', require('./main.js')({
    winston: logger,
    db: database,
    io: nsp,
    sessionMiddleware: sessionMiddleware,
    frotzcmd: frotzcmd
  }).router);

});






return;

// var express = require('express');
// var bodyParser = require('body-parser');
// var winston = require('winston');
// require('dotenv').config();
// var winston = logger = new (winston.Logger)({
//   transports: [
//     new (winston.transports.Console)({
//       level: 'debug',
//       colorize: true,
//     }),
//   ]
// });


// const ZORK_PORT = process.env.ZORK_PORT;




// const app = express();

// MongoClient.connect(MONGO_URI, function (err, db) {
//   const database = db;
//   const todos = database.collection('todos');
//   const app = express();
//   var ObjectID = require('mongodb').ObjectID;


//   var passport = require('passport');

//   app.use(require('morgan')('combined'));
//   app.use(require('cookie-parser')());
//   app.use(bodyParser.urlencoded({ extended: false }));
//   app.use(bodyParser.json());

//   var expressSession = require('express-session');

//   var sessionMiddleware = expressSession(
//     {
//       secret: 'keyboard cat',
//       store: new (require("connect-mongo")(expressSession))({
//         url: MONGO_URI
//       })
//     });
//   app.use(sessionMiddleware);

//   app.use(passport.initialize());
//   app.use(passport.session());

//   app.use('/v1', require(__dirname + '/../login/main.js')({
//     winston: logger,
//     database: database,
//     passport: passport,
//   }).router);

//   app.use("/v1/todos/public", express.static(__dirname + "/public"));

//   app.use("/public", express.static(__dirname + "/../../public"));


//   var server = require('http').Server(app);
//   const io = require('socket.io')(server);



//   server.listen(TODOS_APP_PORT, function () {
//     winston.info('todo app listening on port' + server.address().port);

//   });

//   const nsp = io.of('/v1/todos');

//   app.use('/v1/todos', require('./main.js')({
//     winston: logger,
//     db: database,
//     io: nsp,
//     sessionMiddleware: sessionMiddleware

//   }).router);

// });



// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// var server = require('http').Server(app);
// const io = require('socket.io')(server);



// server.listen(ZORK_PORT, function () {
//   winston.info('ZORK app listening on port' + server.address().port);

// });

// const nsp = io.of('/v1/zork');

// app.use('/v1/zork', require('./main.js')({
//   winston: logger,
//   db: database,
//   io: nsp,

// }).router);




