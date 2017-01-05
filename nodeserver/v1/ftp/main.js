module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');
    var fs = require('fs');
    var Busboy = require('busboy');
    var inspect = require('util').inspect;
    var current_files = {};
    var doDelete = true;

    var expiry = opts.expiry || 86400000; //24 hours

    var cron = require('node-cron');
    cron.schedule('*/1 * * * * *', function () {
        winston.debug('start cron');
        var count = 0;
        for (var key in current_files) {
            count++;
            if ((Date.now() - current_files[key].created) > expiry) {
                winston.info('removing file');
                delete current_files[key];
            }
        }
        winston.debug('file count is ' + count);
    });

    var multer = require('multer');

    var router = express.Router();

    var module = {};


    module.router = router;

    var storage = multer.memoryStorage();


    router.get('/tmp', function (req, res) {
        if (!current_files[req.query.id]) {
            res.status(404);
            res.send(JSON.stringify({
                meta: {
                    message: "File not found"
                }
            }));
            return;
        }
        var file = current_files[req.query.id].file;
        var filename = file.originalname;

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.send(file.buffer);

        if (doDelete) {
            delete current_files[req.query.id];
        }

    });

    var upload = multer({ storage: storage }).single('file');

    router.post('/tmp', function (req, res) {
        var errors = [];
        var requestBody = req.body;
        upload(req, res, function (err) {
            winston.info(req.file);
            if (err || !req.file) {
                winston.error("upload error:" + err);
                winston.error(req.files);
                winston.error(req.file);
                res.status(400);
                res.send(JSON.stringify({ error: 'Bad Request' }));
                return;
            }
            winston.info(req.file);
            const crypto = require('crypto');
            crypto.randomBytes(256, (err, buf) => {
                if (err) throw err;
                var id = buf.toString('hex');
                current_files[id] = {
                    file: req.file,
                    created: Date.now()
                };

                winston.debug(JSON.stringify(current_files));
                res.setHeader('Content-Type', 'application/json');
                res.status(201);

                res.send(JSON.stringify(
                    {
                        id: id,
                        meta: {
                            message: "Temporary file created",
                        }
                    }))
            });
        });
    });

    return module;
};