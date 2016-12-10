var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

var app = express();
// app.use(function(req,res,next) {
//     function errorHandler (err, req, res, next) {
//     req.socket.on("error", function() {

//         });
//         res.socket.on("error", function() {

//         });
//         res.status(500);
//         res.render('error', { error: err })
//     }
// });
app.use(bodyParser.urlencoded({ extended: false }));
// app.use();
app.use('/file',require('./main.js')({winston:logger}).router).listen(3000);