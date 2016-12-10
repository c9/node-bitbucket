require('./files/server.js');

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});
require('./files/traffic.js')({winston:logger});