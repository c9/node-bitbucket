module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = opts.express || require('express');
    var app = opts.app; //express app
    var winston = opts.winston || require('winston');
    
    var router = express.Router();

    var module = {};

    module.router = router;

    module.opts = opts;
    const db = module.db = opts.db;


    var collection = db.collection('init');

    collection.insert({server_start:Date.now()},
     function (err, result) {
        if (err) winston.error(err);
        winston.info(JSON.stringify(result.ops));
    });

    var staticRoot = __dirname + '/public';

    router.use(express.static(staticRoot));


    router.get('/ivr', function (req, res) {
        res.send('ivr');
        // res.send(res.body);
    });

    router.post('/',function(req,res) {
        console.log(req.body);
        res.send(req.body);
    });

    module.registerApp = function(protocol,host,port) {

    }

    module.app = app;

    module.auth = function (req, res) {
        // This will be available 'outside'.
        // Authy stuff that can be used outside...
    };

    function privateFunction(pickle, jar) {
        // This will be NOT available 'outside'.
    };

    return module;
};