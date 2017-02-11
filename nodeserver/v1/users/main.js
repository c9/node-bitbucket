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

    const db = opts.database;

    const LOGIN_PATH = '/public/login';

    var router = express.Router();

    var bcrypt = require('bcrypt');


    const User = db.collection('user');

    router.use(function (req, res, next) {
        winston.debug(req.body);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        if (!req.isAuthenticated()) {
            res.status(401);
            return res.end(JSON.stringify({
                "message": 'Unauthorized',
                status: "unauthorized"
            }));
        }
        next();
    });

    router.get('/me', function (req, res) {

        User.findOne({ _id: req.user._id }, function (err, user) {
            winston.debug(user);
            if (err) {
                winston.error(err);
                res.status(401);
                return res.end(JSON.stringify({
                    "message": 'Unauthorized',
                    status: "unauthorized"
                }));
            }
            return res.status(200).send(JSON.stringify({
                _id: user._id,
                username: user.username,
                email: user.email || null,
                name: user.name || null
            })).end();
        });
    });


    router.post('/me', function (req, res) {
        winston.debug(req.body, { endpoint: '/v2/users/me' });
        var set = {};
        if (req.body.email !== undefined) {
            set.email = req.body.email;
        }
        if (req.body.name !== undefined) {
            set.name = req.body.name;
        }
        User.updateOne({ _id: ObjectID(req.user._id) },
            { $set: set }, function (error, result) {
                if (error) {
                    winston.error(error);
                }
                winston.debug(result.result);
                User.findOne({ _id: req.user._id }, function (err, user) {
                    winston.debug(user);
                    if (err) {
                        winston.error(err);
                        res.status(401);
                        return res.end(JSON.stringify({
                            "message": 'Unauthorized',
                            status: "unauthorized"
                        }));
                    }
                    return res.status(201).send(JSON.stringify({
                        _id: user._id,
                        username: user.username,
                        email: user.email || null,
                        name: user.name || null
                    })).end();
                });
            }
        );

    });

    module.router = router;

    return module;

};