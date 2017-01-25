module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');
    var fs = require('fs');
    var inspect = require('util').inspect;
    var current_files = {};
    var doDelete = true;
    var ObjectID = require('mongodb').ObjectID;
    var uuid = require('node-uuid');

    const LOGIN_PATH = '/public/login';

    var router = express.Router();

    var bcrypt = require('bcrypt');


    const User = opts.db.collection('user');

    router.use(function (req, res, next) {
        winston.debug('authentication status');
        winston.debug(req.isAuthenticated());
        winston.debug(req.user);
        // if (!req.isAuthenticated()) {
        //     res.status(400);
        //     res.end();
        //     return;
        // }
        next();
    })




    // router.use(passport.authenticate('local'));

    var expiry = opts.expiry || 86400000; //24 hours

    var multer = require('multer');


    var module = {};

    const db = opts.db;

    const todos = opts.db.collection('todo');
    const todo_reminders = db.collection('todo_reminder');


    var io = opts.io;
    var cron = require('node-cron');

    io.use(function (socket, next) {
        var req = socket.handshake;
        winston.debug('authorization for socket connection');
        winston.debug(req);
        winston.debug(req.params);
        winston.debug(req.body);
        winston.debug(req.query);

        next();
    })

    io.on('connection', function (socket) {
        winston.debug('emit info',{data:'connected'});
        socket.emit('info', JSON.stringify({ data: 'connected' }));
    });

    io.emit('info', 'hello');

    module.router = router;

    var storage = multer.memoryStorage();


    router.get('/', function (req, res) {
        var query = {
            "user_id": req.isAuthenticated() ? req.user._id : null
        };
        todos.find(query).sort({
            "is_complete": 1, "due": 1,
        }).toArray((function (err, results) {
            if (err) {
                winston.error(err);
            }
            winston.debug(results); // output all records
            res.setHeader('Content-Type', 'application/json; charset=utf-8');

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
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
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
            winston.debug('found todo for scheduled reminder');
            winston.debug(result);
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
                                    io.emit('notification', JSON.stringify(result));
                                    winston.debug(result); // output all records
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
            winston.debug('result:' + JSON.stringify(result));
            addScheduledReminder(result.insertedId);
        });
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
        io.emit('notification', JSON.stringify({ id: uuid.v1(), data: req.body }));
        res.status(201).end();
        return;
    });


    router.post('/:id', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        todos.remove({ _id: ObjectID(req.params.id) }, { w: 1 }, function (error, result) {
            if (error) {
                // winston.error(error);
            }
            winston.debug(result.result);
        });
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