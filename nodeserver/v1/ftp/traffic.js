//mocks expected traffic
module.exports = function (opts, callback) {
    var winston = opts.winston;
    var seconds_between_requests = opts.delay || 30;

    var helper = require('./../utils/helper.js')({ winston: winston });

    var request = require('request');
    var cron = require('node-cron');

    function traffic() {

        createFile({}, function (err, res, body) {
            if (err) winston.error(err);
            winston.debug(body);
            var id = JSON.parse(body).id;
            getFile({id:id}, function (err, res, body) {
                if (err) winston.error(err);
                winston.debug(body);
            });
        });
    }
    traffic();

    cron.schedule('*/' + seconds_between_requests + ' * * * * *', function () {
        traffic();
    });

    function getFile(opts, callback) {
        helper.files.view(opts, callback);
    }

    function createFile(opts, callback) {
        helper.files.post({}, callback);
    }
}
