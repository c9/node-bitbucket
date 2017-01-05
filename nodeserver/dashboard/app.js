// require Express and Socket.io
module.exports = function (opts) {
  var app = opts.app;
  var winston = opts.winston || require('winston');
  var port = opts.PORT;
  var host = 'localhost';
  var dashboardHost = host + ':' + port;
  var dashboardEndpoint = '/dashboard';

  var express = require('express');
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  var path = require('path');

  var module = {};
  var visitorsData = {};

  var start = Date.now();

  var cron = require('node-cron');

  cron.schedule('*/' + 1 + ' * * * * *', function () {
    io.emit('updated-stats', computeStats());
  });


  function upTime() {
    return parseInt((Date.now() - start) / 1000)
  }

  // serve the static assets (js/dashboard.js and css/dashboard.css)
  // from the public/ directory
  app.use(express.static(path.join(__dirname, 'public/')));

  io.on('connection', function (socket) {
    winston.info('connected');
    winston.info(socket.handshake.headers.host);
    if (socket.handshake.headers.host === dashboardHost) {

      var stats = computeStats();
      winston.info(stats);
      // if someone visits '/dashboard' send them the computed visitor data
      io.emit('updated-stats', stats);

    }

    // a user has visited our page - add them to the visitorsData object
    socket.on('visitor-data', function (data) {
      winston.info(data);
      visitorsData[socket.id] = data;

      // compute and send visitor data to the dashboard when a new user visits our page
      io.emit('updated-stats', computeStats());
    });

    socket.on('disconnect', function () {
      winston.info('disconnect on socket.id', socket.id);
      // a user has left our page - remove them from the visitorsData object
      delete visitorsData[socket.id];

      // compute and send visitor data to the dashboard when a user leaves our page
      io.emit('updated-stats', computeStats());
    });
  });

  // wrapper function to compute the stats and return a object with the updated stats
  function computeStats() {
    return {
      pages: computePageCounts(),
      referrers: computeRefererCounts(),
      activeUsers: getActiveUsers(),
      server: {
        uptime: upTime()
      }
    };
  }

  // get the total number of users on each page of our site
  function computePageCounts() {
    // sample data in pageCounts object:
    // { "/": 13, "/about": 5 }
    var pageCounts = {};
    for (var key in visitorsData) {
      var page = visitorsData[key].page;
      if (page in pageCounts) {
        pageCounts[page]++;
      } else {
        pageCounts[page] = 1;
      }
    }
    return pageCounts;
  }

  // get the total number of users per referring site
  function computeRefererCounts() {
    // sample data in referrerCounts object:
    // { "http://twitter.com/": 3, "http://stackoverflow.com/": 6 }
    var referrerCounts = {};
    for (var key in visitorsData) {
      var referringSite = visitorsData[key].referringSite || '(direct)';
      if (referringSite in referrerCounts) {
        referrerCounts[referringSite]++;
      } else {
        referrerCounts[referringSite] = 1;
      }
    }
    return referrerCounts;
  }

  // get the total active users on our site
  function getActiveUsers() {
    return Object.keys(visitorsData).length;
  }

s = http.listen(0, function () {
    console.log('listening on *:' + s.address().port);
    console.log(s.address());
    app.set('port', s.address().port);

  });


  return module;
}