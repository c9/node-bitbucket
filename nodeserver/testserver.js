var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
var init = process.env.INIT || false;
const NEXMO_API = process.env.NEXMO_API || null;
const NEXMO_SECRET = process.env.NEXMO_SECRET || null;
const low = require('lodash');
const db = low('db.json')


if (init) {
    const exec = require('child_process').exec;
    exec('cp ' + __dirname + '/default-db.json ' + __dirname + '/db.json', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });

    db.defaults({ posts: [], user: {} })
        .value();

    db.set('nexmo.api', NEXMO_API).value();
    db.set('nexmo.secret', NEXMO_SECRET).value();

}


var opts = { db: db };
var app = require('./voice.js')(opts).app;

app.listen(port, ip, function () {
});
