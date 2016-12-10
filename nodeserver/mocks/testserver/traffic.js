//mocks expected traffic

var seconds_between_requests = 1;

var helper = require('./helper.js')();

var request = require('request');
var cron = require('node-cron');

cron.schedule('*/' + 1 + ' * * * * *', function () {
    createFile();
});



function createFile() {
    helper.files.post();
}