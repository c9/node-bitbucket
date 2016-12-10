module.exports = function (opts, callback) {
    var callback = callback || function () { };
    var opts = opts || {};
    var host = opts.host || 'localhost';
    var protocol = opts.protocol || 'http';
    var port = opts.port || 3000;
    var winston = opts.winston || require('winston');
    var fs = require('fs');
    var request = require('request');

    function getBaseUrl() {
        return protocol + "://" + host + ":" + port;
    }

    module.files = {
        get: function(opts,callback) {
        var url = getBaseUrl() + "/file/tmp";
            request.get(
                {
                    url: url,
                },
                function(err, httpResponse, body) {
                    if (err) {
                        console.error('upload failed:', err);
                    }
                });
        },
        post:
        function (opts, callback) {
            var url = getBaseUrl() + "/file/tmp";
            console.log(url);
            var formData = {
                // Pass a simple key-value pair 
                my_field: 'my_value',
                // Pass data via Buffers 
                my_buffer: new Buffer([1, 2, 3]),
                // Pass data via Streams 
                my_file: fs.createReadStream(__dirname + '/helper.js'),
                // Pass multiple values /w an Array 
                attachments: [
                    fs.createReadStream(__dirname + '/server.js'),
                    fs.createReadStream(__dirname + '/traffic.js')
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
                function(err, httpResponse, body) {
                    if (err) {
                        console.error('upload failed:', err);
                    }
                    console.log('Upload successful!  Server responded with:', body);
                });
        }
    }



    callback();

    return module;

}