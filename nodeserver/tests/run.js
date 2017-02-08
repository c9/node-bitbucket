//node v2/devices/run_device_tests.js 2>&1 | tee ./mocha_output.log
//unbuffer node v2/devices/run_device_tests.js 2>&1 | tee ./mocha_output.log
require('dotenv').config();

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');


process.on('uncaughtException', function (err) {

    // winston.error('uncaughtException', { message: err.message, stack: err.stack }); // logging with MetaData
    // process.exit(1); // exit with failure
});

// console.log(process.env.NODE_ENV);
// return;

// process.env.CONSOLE_LOG_LEVEL = process.env.CONSOLE_LOG_LEVEL || 'warn';

// Instantiate a Mocha instance.
var mocha = new Mocha({
    // ui: 'tdd',
    reporter: 'list',
    ignoreLeaks: true,
    bail: false
});

mocha.bail(false);

runners = [];
endedCount = 0;

startCount = 0;

failCount = 0;

function addTest(file) {

    mocha.addFile(file);

    return;
    var mocha = new Mocha({
        // ui: 'tdd',
        reporter: 'list',
        ignoreLeaks: true,
        // bail: false
    });

    mocha.addFile(file);
    var runner = mocha.run(function (failures) {
        // console.log(failures);
        // process.exit(failures);
    });

    runners.push(runner);

    runner.on('pass', function (test, err) {
    })


    runner.on('fail', function (test, err) {
        failCount++;
    })

    runner.on('end', function () {
        endedCount++;
        console.log('end');
        if (endedCount == runners.length) {
            process.exit(failCount ? 1 : 0);
        }
    })
}

var testOptions = {
    filter: function (val) {
        return val.substr(-8) == '_spec.js';
    }
};

if (process.env.hello_worlkdslkadfj == 'LOAD') {
    testOptions.directory = __dirname + '/load';
}
else {
    testOptions.directory = __dirname + '/main';
}

(function (opts, callback) {
    // callback();
    // return;
    var done = false;
    var readdirCount = 0;
    count = 0;
    var readdir = function (dir) {
        readdirCount++;
        fs.readdir(dir, function (err, files) {
            count += files.length;
            files.forEach(function (file) {
                file = path.join(dir, file);
                fs.stat(file, function (err, stats) {
                    if (stats.isDirectory()) {
                        count--;
                        readdirCount--;
                        readdir(file);
                        return;
                    }

                    if (file.substr(-8) === '_spec.js') {
                        console.log('added ' + file);
                        // addTest(file);
                        mocha.addFile(file);
                    }
                    count--;
                    console.log(count);
                    // console.log(count);
                    if (count == 0) {
                        readdirCount--;
                        if (readdirCount == 0) {
                            callback();
                        }
                    }
                });
            });
        });
    }
    readdir(opts.directory);


})(testOptions, function () {
    startCount++;
    console.log('start tests');
    console.log(startCount);
    // return;

    var runner = mocha.run(function (failures) {
        // console.log(failures);
        // process.exit(failures);
        process.on('exit', function () {
            console.log('on exit');
            process.exit(failures);
        })
    });

    runner.on('pass', function (test, err) {
    })


    runner.on('fail', function (test, err) {
        console.log(test);
    })

    runner.on('end', function () {
        console.log('end');
        process.exit(0);
    })
    return;

    var runner = mocha.run(function (failures) {
        process.on('exit', function () {
            console.log('on exit');
            process.exit(failures);
        });

        // process.on("SIGINT", function () {
        //     process.exit(0);
        //     // util.puts("You Pressed CTRL+C");
        //     // somethingAsync(function(err){
        //     //     process.exit();
        //     // });
        // });
    });

    runner.on('end', function () {
        process.exit();
    })
    // runner.on('end', function () {
    //     setInterval(function (

    //     ) { }, 2000)

    // });

    runner.on('pass', function (test, err) {
    })


    runner.on('fail', function (test, err) {
    })
});

// process.exit(1);


// process.on('exit', (code) => {
//     process.stdout.write(code);
//     console.log('exiting');
//     console.log(code);
// });