// Zork Server by whiskers75
// https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-apt
var cp = require('child_process');
var net = require('telnet');
var util = require('util');
var readline = require('readline');
var sessions = [];
var sockets = [];
var readlines = [];
var fs = require('fs');
var clients = [];
var saveTrue = [];
var zorkargs = [process.env.PWD + '/Zork/DATA/ZORK1.DAT', '-Q'];

cp.spawn('./zork.sh');
var startsWith = function (superstr, str) {
    return !superstr.indexOf(str);
};


net.createServer(function (socket) {
    sockets.push(socket);
    // socket.write('Please authorize Zork Server in your browser, it will open shortly.\n');
    // clients[sockets.indexOf(socket)] = client;

    readlines[sockets.indexOf(socket)] = readline.createInterface(socket, socket);
    socket.write('Loading Zork...\n'); sessions[sockets.indexOf(socket)] = cp.spawn('frotz', zorkargs);
    sessions[sockets.indexOf(socket)].stdout.setEncoding('utf8');
    sessions[sockets.indexOf(socket)].stdout.pipe(socket);
    sessions[sockets.indexOf(socket)].stderr.pipe(socket);
    // sessions[sockets.indexOf(socket)].stdin.write('restore\n');
    // sessions[sockets.indexOf(socket)].stdin.write(clients[sockets.indexOf(socket)].uid + '.sav\n');
    readlines[sockets.indexOf(socket)].on('line', function (data) {
        data = util.inspect(data);
        data = data.replace(/[^A-Za-z ]/g, "");
        // data = data.substr(0, data.length - 2);
        sessions[sockets.indexOf(socket)].stdin.write(data + '\n');
    });
    sessions[sockets.indexOf(socket)].on('exit', function () {
        socket.end();
    });
}).listen(3000);