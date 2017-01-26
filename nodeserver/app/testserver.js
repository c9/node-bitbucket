
const express = require('express');
const app = express();
const winston = require('winston');


const PORT = 3000;

require(__dirname + '/main.js')({
  app: app
});


server = app.listen(PORT, function () {
  winston.info('todo app listening on port' + server.address().port);
});