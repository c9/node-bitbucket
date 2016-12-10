module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');
    var fs = require('fs');
    var Busboy = require('busboy');
    var inspect = require('util').inspect;


    var multer = require('multer');

    var router = express.Router();

    var module = {};

    module.router = router;

    router.get('/tmp', function (req, res) {
        winston.debug('tmp get');
        res.send('pong');
    });
    var storage = multer.memoryStorage();
    var upload = multer({ storage: storage }).single('avatar');
    //.single('avatar');

    router.post('/tmp', function (req, res) {
        // var requestBody = req.body;
        var errors = [];
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            file.on('data', function (data) {
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function () {
                console.log('File [' + fieldname + '] Finished');
            });
        });
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        });
        busboy.on('finish', function () {
            console.log('Done parsing form!');
            res.writeHead(303, { Connection: 'close', Location: '/' });
            res.end();
        });
        req.pipe(busboy);        
        // req.socket.on("error", function (err) {
        //     winston.error("requst socket error" + err);
        //     errors.push("Request socket error");
        //     return;
        // });
        // res.socket.on("error", function (err) {
        //     winston.error("response socket error" + err);
        //     errors.push("Response socket error");
        //     return;
        // });

        // upload(req, res, function (err) {
        //     if (err) {
        //         winston.error("upload error:" + err);
        //         winston.error(requestBody);
        //         winston.error(req.files);
        //         winston.error(req.file);
        //         // res.send('1');
        //         // res.status(400);
        //         // res.send(JSON.stringify({error:'Bad Request'}));
        //         return;
        //     }
        //     res.setHeader('Content-Type', 'application/json');
        //     res.send(JSON.stringify({ a: 1 }));
        //     res.send('hello');
        // });
    });

    function upload_file(req, res) {
        req.setBodyEncoding('binary');

        var stream = new multipart.Stream(req);
        stream.addListener('part', function (part) {
            part.addListener('body', function (chunk) {
                var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
                var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);

                sys.print("Uploading " + mb + "mb (" + progress + "%)\015");

                // chunk could be appended to a file if the uploaded file needs to be saved
            });
        });
        stream.addListener('complete', function () {
            res.sendHeader(200, { 'Content-Type': 'text/plain' });
            res.sendBody('Thanks for playing!');
            res.finish();
            sys.puts("\n=> Done");
        });
    }

    return module;
};