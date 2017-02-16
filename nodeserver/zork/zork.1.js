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
var zorkargs = [process.env.PWD + '/Zork/DATA/ZORK1.DAT', '-Q'];
var saveTrue = [];
// var Dropbox = require('dropbox');
cp.spawn('./zork.sh');
var startsWith = function (superstr, str) {
    return !superstr.indexOf(str);
};


server = net.createServer(function (socket) {
    // console.log(socket);
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
}).listen(3000, function () {
    console.log(server.address())
    telnetClient();
});

function telnetClient() {

    var telnet = require('telnet-client');
    var connection = new telnet();

    var params = {
        host: 'localhost',
        port: 3000,
        // shellPrompt: '/ # ',
        // timeout: 1500,
        // removeEcho: 4
    };

    connection.on('ready', function (prompt) {
        connection.exec(cmd, function (err, response) {
            console.log(response);
        });
    });

    connection.on('timeout', function () {
        console.log('socket timeout!')
        connection.end();
    });

    connection.on('close', function () {
        console.log('connection closed');
    });

    connection.connect(params);
}