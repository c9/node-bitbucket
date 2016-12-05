module.exports = function (opts) {
    var http = require('http');
    var url = require('url');


    var module = {};

    module.opts = opts;
    const db = module.db = opts.db;


    var express = require('express');
    var bodyParser = require('body-parser');

    var app = express();

    app.use(bodyParser.urlencoded({ extended: false }));


    var staticRoot = __dirname + '/public';

    app.use(express.static(staticRoot));


    app.get('/ivr', function (req, res) {
        // res.send(res.body);
    });

    app.post('/',function(req,res) {
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