const path = require('path');

module.exports = function (opts, callback) {
    var callback = callback || function () { };
    var opts = opts || {};
    var host = opts.host || 'localhost';
    var protocol = opts.protocol || 'http';
    var port = opts.port || 3000;
    // var winston = opts.winston || require('winston');
    var fs = require('fs');
    var request = require('request');

    function getBaseUrl() {
        return protocol + "://" + host + ":" + port + '/api/v1';
    }

    module.files = {
        view: function (opts, callback) {
            var url = getBaseUrl() + "/files/tmp?id=" + opts.id;
            request.get(
                {
                    url: url,
                },
                function (err, response, body) {
                    if (err) {
                        console.error('upload failed:', err);
                    }
                    callback(err, response, body)
                });
        },
        get: function (opts, callback) {
            var url = getBaseUrl() + "/files/tmp";
            request.get(
                {
                    url: url,
                },
                function (err, response, body) {
                    if (err) {
                        console.error('upload failed:', err);
                    }
                    callback(err, response, body)
                });
        },
        post: function (opts, callback) {
            // winston.debug('start post');
            // winston.debug(getBaseUrl);
            // winston.debug(protocol);
            // winston.debug(port);
            var url = getBaseUrl() + "/files/tmp"
            // winston.debug(url);
            var formData = {
                // avatar: new Buffer([1, 2, 3]),//'avatar',
                // // Pass a simple key-value pair 
                // my_field: 'my_value',
                // // Pass data via Buffers 
                // my_buffer: new Buffer([1, 2, 3]),
                // // Pass data via Streams 
                file: fs.createReadStream(path.join(__dirname,'fixtures', 'test1.txt'))
            };
            request.post(
                {
                    url: url,
                    formData: formData
                },
                function (err, response, body) {
                    callback(err, response, body);
                });
        },
        //https://github.com/expressjs/multer/issues/224
        //https://github.com/expressjs/multer/issues/350
        postBad:
        function (opts, callback) {
            var url = getBaseUrl() + "/file/tmp"
            var formData = {
                // Pass a simple key-value pair 
                my_field: 'my_value',
                // Pass data via Buffers 
                my_buffer: new Buffer([1, 2, 3]),
                // Pass data via Streams 
                my_file: fs.createReadStream(path.join(__dirname,'fixtures', 'test1.txt')),
                // Pass multiple values /w an Array 
                attachments: [
                    fs.createReadStream(path.join(__dirname,'fixtures', 'test1.txt')),
                    fs.createReadStream(path.join(__dirname,'fixtures', 'test1.txt'))
                ],
                // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS} 
                // Use case: for some types of streams, you'll need to provide "file"-related information manually. 
                // See the `form-data` README for more information about options: https://github.com/form-data/form-data 
                custom_file: {
                    value: fs.createReadStream('/dev/urandom'),
                    options: {
                        filename: 'topsecret.jpg',
                        contentType: 'image/jpg'
                    }
                }
            };
            request.post(
                {
                    url: url,
                    formData: formData
                },
                function (err, response, body) {
                    callback(err, response, body);
                });
        }
    }



    callback();

    return module;

}