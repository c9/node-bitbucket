module.exports = function (opts) {
    var module = {};
    var express = require('express');
    var router = express.Router();



    router.get('/', function (req, res) {
        res.send(JSON.stringify({
            'status': 'success',
            'meta': { 'message': 'Success' }
        }));
    });

    router.post('/', function (req, res) {
        res.send(JSON.stringify({
            'status': 'success',
            'meta': { 'message': 'Success' }
        }));
    });

    module.router = router;

    return module;
};