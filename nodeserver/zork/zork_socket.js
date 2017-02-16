// Zork Server by whiskers75
// https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-apt
var cp = require('child_process');
var winston = require('winston');
var spawn = cp.spawn;
var net = require('telnet');
var util = require('util');
var readline = require('readline');
var sessions = [];
var sockets = [];
var readlines = [];
var fs = require('fs');
var clients = [];
// var zorkargs = [process.env.PWD + '/Zork/DATA/ZORK1.DAT', '-Q'];
var saveTrue = [];
var cmd = "frotz";
var args = [__dirname + "/Zork/DATA/ZORK1.DAT", "-Q"];

var child = spawn(cmd, args);
// child.stdout.pipe(process.stdout);
// child.stdin.pipe(process.stdout);

// var spawned_process = cp.spawn('./zork.sh');
child.stdout.on('data', function (data) {
    winston.info(data.toString());
});
child.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
});

child.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
});


const http = require('http');
var server = http.Server();

const io = require('socket.io')(server);
const nsp = io.of('/v1/zork');



server.listen(process.env.PORT || 3000, function () {
    winston.info('zork app listening on port' + server.address().port);
    var socket = require('socket.io-client')("http://localhost:" + server.address().port + "/v1/zork", {});


    socket.on('info', function (data) {
        console.log(data);


        socket.emit('zorkcmd','look around');

        winston.info(data.toString());
    })

});


nsp.on('connection', function (socket) {
    winston.info('connection');

    socket.emit('info', 'hello world');
    setInterval(function () {
        winston.info('emit');
        socket.emit('info', 'hello');
    }, 1000);


    socket.on('zorkcmd',function(data) {
        winston.info(data,{'type':'server socket received'});
        child.stdin.write(data+"\n");
    });
});




return;