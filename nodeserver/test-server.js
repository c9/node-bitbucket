// var spawn = require('child_process').spawn;

// var child = spawn('php', ['-v']);

var exec = require('child_process').exec;


exec('fuser 3000/tcp', function (error, stdout, stderr) {
    // console.log(error);
    if (stdout) {
        console.log(stdout);
        console.log('it looks like someone is using port 3000');
        exec('fuser -k 3000/tcp', function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('killed user');
                console.log('stdout: ');
                console.log(stdout);
            }
            var main = require('./main.js')({}, function (port) {
                console.log('server listening on port ' + port);
            });
        })
    }
    else {
        var main = require('./main.js')({}, function (port) {
            console.log('server listening on port ' + port);
        });
    }

});