module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');



    // https://www.npmjs.com/package/ansi2html-extended
    const a2h = require('ansi2html-extended');

    //https://www.npmjs.com/package/ansi_up
    var ansi_up = require('ansi_up');

    var router = express.Router();

    const cp = require('child_process');
    const fs = require('fs');
    const spawn = cp.spawn;
    const util = require('util');
    var readline = require('readline');
    const net = require('telnet');
    const frotzcmd = opts.frotzcmd;


    function createZorkProcess() {
        winston.info('create Zork');
        var args = [__dirname+'/zork.sh',frotzcmd,__dirname+"/Zork/DATA/ZORK1.DAT"];

        var child = spawn('bash', args);
        child.stdout.setEncoding('utf8');
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
    })

    var indexedSockets = {};
    var sockets = [];
    var connectCounter = 0;

    io.on('connection', function (socket) {

        socket.zork_process = createZorkProcess(socket);

        socket.zork_process.stdout.on('data', function (data) {
            var data = data.toString();
            // winston.info(data);

            var data = ansi_up.ansi_to_html(data);
            // var data = a2h.fromString(data);
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