module.exports = function (opts) {
    var module = {};
    var express = require('express');
    var router = express.Router();
    var app = opts.app;


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

    function getStatusResponse()
    {
        return {
            'status': 'success',
            'server': {
                port: app.get('port'),
                started: app.get('serverstarted')
            },
            'meta': { 'message': 'Success' }
        };
    }

    router.get('/', function (req, res) {
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(getStatusResponse()));
    });

    router.post('/', function (req, res) {
        res.status(201);
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(getStatusResponse()));
    });

    module.router = router;

    return module;
};