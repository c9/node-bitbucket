module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = require('winston');

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

    winston.info('started routing for /v1/zork');


    // https://www.npmjs.com/package/ansi2html-extended
    const a2h = require('ansi2html-extended');

    //https://www.npmjs.com/package/ansi_up
    var ansi_up = require('ansi_up');

    const ansi = require('ansi-escape-sequences');

    const stripAnsi = require('strip-ansi');


    var router = express.Router();
    module.router = router;


    const cp = require('child_process');
    const fs = require('fs');
    const spawn = cp.spawn;
    const util = require('util');
    var readline = require('readline');
    const net = require('telnet');
    const frotzcmd = opts.frotzcmd;


    function createZorkProcess() {
        winston.info('create Zork');
        var args = [__dirname + "/Zork/DATA/ZORK1.DAT", '-i', '-p', '-q']

        var child = spawn(frotzcmd, args);
        // child.stdout.setEncoding('utf8');
        return child;
    }


    var io = opts.io;

    router.use(function (req, res, next) {
        winston.debug('authentication status');
        winston.debug(req.isAuthenticated());
        winston.debug(req.user);
        next();
    });

    var sessionMiddleware = opts.sessionMiddleware;

    var io = opts.io;

    io.use(function (socket, next) {
        winston.info(socket.request.headers);
        sessionMiddleware(socket.request, {}, next);
    })


    io.use(function (socket, next) {
        var req = socket.handshake;
        winston.debug('authorization for socket connection');
        winston.debug(req);
        winston.debug(req.params);
        winston.debug(req.body);
        winston.debug(req.query);
        winston.info('socket connection:');
        winston.info(socket.request.isAuthenticated());
        socket.user = 'anon';
        if (socket.request.session.passport) {
            if (socket.request.session.passport.user) {
                socket.user = socket.request.session.passport.user;
            }
        }



        next();
    });

    var indexedSockets = {};
    var sockets = [];
    var connectCounter = 0;

    io.on('connection', function (socket) {

        winston.info('connection');
        socket.zork_process = createZorkProcess(socket);

        // socket.zork_process.stdout.setEncoding('ascii');

        socket.zork_process.stdout.on('data', function (data) {
            var data = data.toString();

            // var Convert = require('ansi-to-html');
            // var convert = new Convert();
            // data = convert.toHtml(data);

            // data = data.replace("\u001b[2d\u001b[3M\u001b[22d",'');
            // data = data.replace("\u001b[2d\u001b[3M\u001b[1;74H\u001b(B\u001b[0;7m1",'');

            // data = data.replace("\u001b[20d", '');
            // data = data.replace("\u001b[21d", '');
            // data = data.replace("\u001b[22d", '');
            // data = data.replace("\u001b[23d", '');
            // data = data.replace("\u001b[24d", '');
            // data = data.replace("\u001b[25d", '');
            // data = data.replace("\u001b(B\u001b[m",'');

            // var data = data.replace(/[^\x00-\x7F]/g, "");
            // data = data.replace(/[^A-Za-z ]/g, "");


            // console.log(data);

            // data = stripAnsi(data);



            // data = data.replace("/\x001b\[22d/g", '');

            // data = data.replace("/\x001b\[16d/g",'');
            winston.info(data);




            socket.emit('zorkoutput', data);
        });
        socket.zork_process.stderr.on('data', function (data) {
            winston.error('stderr: ' + data.toString());
        });

        socket.zork_process.on('exit', function (code) {
            winston.info('child process exited with code ' + code.toString());
        });

        socket.on('zorkcmd', function (data) {
            // socket.emit('zorkoutput',data);
            winston.info(data);

            socket.zork_process.stdin.write(data + "\n");

        })


        socket.on('disconnect', function () {
            socket.zork_process.kill();

            winston.debug("socket disconnect ", {
                socket: {
                    user: socket.user
                }
            })
            if (indexedSockets[socket.user]) {
                delete (indexedSockets[socket.user][socket.id]);
            }
            else {
                winston.error('socket connection not properly indexed')
            }
            connectCounter--;

        });

        winston.debug('emit info', { data: 'connected' });
        socket.emit('info', JSON.stringify({ data: 'connected' }));
        if (!indexedSockets[socket.user]) {
            indexedSockets[socket.user] = {};
        }
        indexedSockets[socket.user][socket.id] = socket;
    });



    return module;
};