module.exports = function (opts) {
    var http = require('http');
    var url = require('url');


    var module = {};

    module.opts = opts;


    var express = require('express');
    var app = express();

    var staticRoot = __dirname + '/public';

    app.use(express.static(staticRoot));


    app.get('/ivr', function (req, res) {
        res.send('Hello World!')
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