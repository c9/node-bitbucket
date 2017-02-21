module.exports = function (opts) {
    var module = {};
    var express = require('express');
    var router = express.Router();


    router.get('/authenticated', function (req, res) {
        if (req.isAuthenticated()) {
            res.status(200);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'success',
                'meta': { 'message': 'Success' }
            }));
        }
        else {
            res.status(401);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'unauthorized',
                'message': 'This is not an authenticated user'
            }));
        }
    });

    router.get('/isadmin', function (req, res) {
        if (req.isAuthenticated() && req.user.username == process.env.MAIN_ADMIN_USERNAME) {
            res.status(200);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'success',
                'meta': { 'message': 'Success' }
            }));
        }
        else {
            res.status(401);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'unauthorized',
                'message': 'This is not an authenticated user'
            }));
        }
    });

    router.get('/', function (req, res) {
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.send(JSON.stringify({
            'status': 'success',
            'meta': { 'message': 'Success' }
        }));
    });

    router.post('/', function (req, res) {
        res.status(201);
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.send(JSON.stringify({
            'status': 'success',
            'meta': { 'message': 'Success' }
        }));
    });

    module.router = router;

    return module;
};