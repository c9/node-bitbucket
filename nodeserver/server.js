require('dotenv').config();

var main = require('./main.js')({}, function (port) {
    console.log('server listening on port ' + port);
});