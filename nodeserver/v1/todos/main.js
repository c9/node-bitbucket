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

    const CRON_30_MINUTE_REMINDER = "*/1800 * * * * *";

    var expiry = opts.expiry || 86400000; //24 hours

    var multer = require('multer');

    var router = express.Router();

    var module = {};

    const db = opts.db;

    const todos = opts.db.collection('todo');
    const todo_reminders = db.collection('todo_reminder');


    var io = opts.io;

    var cron = require('node-cron');

    io.on('connection', function (socket) {
        socket.emit('info', { data: 'connected' });
    });

    io.emit('info', 'hello');

    module.router = router;

    var storage = multer.memoryStorage();


    router.get('/', function (req, res) {
        todos.find().sort({ "is_complete": 1, "due": 1 }).toArray((function (err, results) {
            if (err) {
                winston.error(err);
            }
            winston.debug(results); // output all records
            res.send(JSON.stringify(results));
            return;
        }));
        return;
    });

    router.post('/', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        var todoObj = {
            text: req.body.text,
            created: Date.now(),
            due: Date.now() + 1000 * 60 * 60 * 5,
            reminder: Date.now() + 1000 * 60 * 30
        };
        todos.insert(todoObj);
        res.status(201).end();
        return;
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
                            todos.findOne({ _id: result._todo,is_complete: { $ne: 1 } }, function (err, result) {
                                if (!result) {
                                    return;
                                }
                                if (err) {
                                    winston.error(err);
                                }
                                else {
                                    io.emit('reminder', JSON.stringify(result));
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
        var reminderObj = {
            _todo: ObjectID(req.params.id),
            created: Date.now(),
            reminder: CRON_30_MINUTE_REMINDER
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