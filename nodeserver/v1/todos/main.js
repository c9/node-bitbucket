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

    var expiry = opts.expiry || 86400000; //24 hours

    var multer = require('multer');

    var router = express.Router();

    var module = {};

    var todos = opts.todos;

    var io = opts.io;

  io.on('connection', function (socket) {
    socket.emit('info', { data: 'connected' });
  });

  io.emit('info','hello');

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
            { $set: { is_complete: 1,completed: Date.now() } });

        res.status(201).end();
        return;
    });


    router.post('/:id', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        todos.insert(req.body);
        res.status(201).end();
        return;
    });

    router.post('/reminder', function (req, res) {
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        io.emit('info','hello');

        todos.insert(req.body);
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