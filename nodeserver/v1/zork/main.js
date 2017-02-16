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


    function createZorkProcess() {
        winston.info('create Zork');
        var cmd = "frotz";
        var args = [__dirname + "/Zork/DATA/ZORK1.DAT", "-Q"];

        var child = spawn(cmd, args);
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


    /**
     * Emits an event and message based on the requests user.
     */
    function emitOnRequest(req, event, msg) {
        if (req.user) {
            var user_id = req.user._id;
        }
        else {
            var user_id = 'anon';
        }

        broadcastToUserId(user_id, event, msg);
    }

    //socket.broadcast.to(id).emit('my message', msg);
    function broadcastToUserId(user_id, event, msg) {
        if (!user_id) {
            user_id = 'anon';
        }

        var userSockets = indexedSockets[user_id];
        if (!userSockets) {
            return;
        }
        winston.debug(Object.keys(userSockets));
        Object.keys(userSockets).forEach(function (key) {
            var socket = userSockets[key];
            winston.debug(key);
            winston.debug(socket.id);
            socket.emit(event, msg);
        });

    }


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




    // router.use(passport.authenticate('local'));

    var expiry = opts.expiry || 86400000; //24 hours

    var multer = require('multer');


    var module = {};

    const db = opts.db;

    const todos = opts.db.collection('todo');
    const todo_reminders = db.collection('todo_reminder');


    var cron = require('node-cron');


    module.router = router;

    var storage = multer.memoryStorage();

    router.post('/ping', function (req, res) {
        if (req.user) {
            var username = req.user.username;
            var user_id = req.user._id;
        }
        else {
            var username = 'anon'
            var user_id = 'anon';
        }
        var result = {
            id: uuid.v1(),
            type: "notification",
            data: { text: "Hello " + username }
        }
        broadcastToUserId(user_id, 'notification', JSON.stringify(result));
        res.status(201).end();
        return;
    });


    router.get('/', function (req, res) {
        var query = {
            "user_id": req.isAuthenticated() ? req.user._id : null
        };
        todos.find(query).sort({
            "is_complete": 1, "created": -1,
        }).toArray((function (err, results) {
            if (err) {
                winston.error(err);
            }
            winston.debug(results); // output all records
            res.setHeader('content-type', 'application/json; charset=utf-8');

            res.send(JSON.stringify(results));
            return;
        }));
        return;
    });

    router.post('/token', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        // var todoObj = {
        //     text: req.body.text,
        //     created: Date.now(),
        //     due: Date.now() + 1000 * 60 * 60 * 5,
        //     reminder: Date.now() + 1000 * 60 * 30
        // };
        // todos.insert(todoObj);
        res.status(201).end();
        return;
    });


    router.get('/token', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        res.status(200).end();
        return;
    });

    router.post('/', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        var todoObj = {
            text: req.body.text,
            created: Date.now(),
            due: Date.now() + 1000 * 60 * 60 * 5,
            reminder: Date.now() + 1000 * 60 * 30,
            user_id: req.isAuthenticated() ? req.user._id : null
        };
        todos.insertOne(todoObj, function (error, result) {
            todoObj._id = result.insertedId;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.status(201).send(JSON.stringify(todoObj)).end();
            return;
        });


    });

    router.post('/:id/complete', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));

        todos.updateOne({ _id: ObjectID(req.params.id) },
            { $set: { is_complete: 1, completed: Date.now() } });

        res.status(201).end();
        return;
    });

    var reminder_cron = [];

    function addScheduledReminder(_id) {
        todo_reminders.findOne({ _id: ObjectID(_id) }, function (err, result) {
            if (err) {
                winston.error(err);
            }
            winston.info('found todo for scheduled reminder');
            winston.info(result);
            try {
                reminder_cron[_id] = cron.schedule(result.reminder, function () {
                    todo_reminders.findOne({ _id: ObjectID(_id) }, (function (err, result) {
                        if (err) {
                            winston.error(err);
                        }
                        else {
                            todos.findOne({ _id: result._todo, is_complete: { $ne: 1 } }, function (err, todo) {
                                if (!todo) {
                                    return;
                                }
                                if (err) {
                                    winston.error(err);
                                }
                                else {
                                    var result = {
                                        id: uuid.v1(),
                                        type: "todo",
                                        data: todo
                                    }
                                    broadcastToUserId(todo.user_id, 'notification', JSON.stringify(result));
                                    // io.emit('notification', JSON.stringify(result));
                                    winston.info(result); // output all records
                                }
                            });

                        }
                        return;
                    }));
                });
            }
            catch (e) {
                winston.error("reminder " + _id + " could not create reminder");
                winston.error(e);
            }
        });
    }

    router.post('/:id/add30minutereminder', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        var date = new Date();
        var currentMinutes = date.getMinutes();
        var in30minutes = (currentMinutes + 30) % 60;
        var allMinutes = [currentMinutes, in30minutes];
        var cronRule = allMinutes.join(',') + " * * * *";

        var reminderObj = {
            _todo: ObjectID(req.params.id),
            created: Date.now(),
            reminder: cronRule
        };



        todo_reminders.insertOne(reminderObj, function (error, result) {
            winston.debug('result:' + JSON.stringify(result));
            addScheduledReminder(result.insertedId);
        });
        res.status(201).end();
        return;
    });

    router.post('/:id/add5minutereminder', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        var date = new Date();
        var allMinutes = [];
        var currentMinutes = date.getMinutes();
        var nextMinutes = (currentMinutes + 5) % 60;
        allMinutes.push(currentMinutes);
        while (nextMinutes != currentMinutes) {
            winston.debug(nextMinutes);
            allMinutes.push(nextMinutes);
            nextMinutes = (nextMinutes + 5) % 60;
        }
        var cronRule = allMinutes.join(',') + " * * * *"
        var reminderObj = {
            _todo: ObjectID(req.params.id),
            created: Date.now(),
            reminder: cronRule
        };

        todo_reminders.insertOne(reminderObj, function (error, result) {
            winston.info('result:' + JSON.stringify(result));
            addScheduledReminder(result.insertedId);
        });
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.status(201);
        return res.send(JSON.stringify({
            "message": 'Added a 5 minute reminder',
            status: "success"
        }));
        res.status(201).end();
        return;
    });


    router.post('/:id/reminders', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        var reminderObj = {
            _todo: ObjectID(req.params.id),
            created: Date.now(),
            reminder: req.body.reminder
        };

        todo_reminders.insertOne(reminderObj, function (error, result) {
            winston.debug('result:' + JSON.stringify(result));
            addScheduledReminder(result.insertedId);
        });
        res.status(201).end();
        return;
    });

    router.post('/reminders', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        io.emit('info', JSON.stringify(req.body));
        res.status(201).end();
        return;
    });


    router.post('/sendNotification', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        res.setHeader('content-type', 'application/json; charset=utf-8');

        emitOnRequest(req, 'notification', JSON.stringify({ id: uuid.v1(), data: req.body }))
        res.status(201).end();
        return;
    });


    router.post('/:id', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        todos.updateOne({ _id: ObjectID(req.params.id) },
            { $set: req.params });
        res.status(201).end();
        return;
    });

    router.delete('/:id', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        todos.remove({ _id: ObjectID(req.params.id) }, { w: 1 }, function (error, result) {
            if (error) {
                // winston.error(error);
            }
            winston.debug(result.result);
        });

        res.status(201).end();


    });


    return module;
};