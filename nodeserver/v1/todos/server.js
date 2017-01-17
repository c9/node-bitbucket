var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

var app = express();
app.use("/v1/todos/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/v1/todos',require('./main.js')({winston:logger,expiry:60000}).router).listen(3000);