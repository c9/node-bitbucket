module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');
    var fs = require('fs');
    var inspect = require('util').inspect;
    var current_files = {};
    var doDelete = true;

    var expiry = opts.expiry || 86400000; //24 hours

    var multer = require('multer');

    var router = express.Router();

    var module = {};


    module.router = router;

    var storage = multer.memoryStorage();


    router.get('/', function (req, res) {
        res.send(JSON.stringify([{
            meta: {
                message: "File not found"
            }
        }]));
        return;       

    });


    return module;
};