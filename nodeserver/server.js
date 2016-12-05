var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';

var opts = {};
var app = require('./voice.js')(opts).app;

app.listen(port,ip, function () {
})

// voiceServer.listen(port, ip);
// console.log("started server on " + ip + ":" + port);

