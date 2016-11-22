var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
var http = require('http');
var url = require('url');
http.createServer(function (req, res) {
    console.log("started request");
    var path = url.parse(req.url);
    console.log(path);

    if (path.pathname === '/sms') {
        console.log('sms receipt');
    }

    if (path.pathname === '/sms') {
        console.log('sms receipt');
    }
    if (req.body) {
        console.log(req.body);
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Success');

}).listen(port, ip);//


console.log("started server on " + ip + ":" + port);