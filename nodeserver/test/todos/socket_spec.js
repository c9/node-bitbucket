var baseurl = "http://localhost:3000";
var loginurl = baseurl + '/v1/login';
var notificationurl = baseurl + '/v1/todos/sendNotification';
socketurl = 'http://localhost:3000/v1/todos';

var ioClient = require('socket.io-client');
var request = require('request');
var expect = require("chai").expect;

describe('native node socket test', function () {
    this.timeout(1000 * 60 * 10); //10 minutes
    it("socket connection test", function (done) {
        const http = require('http');

        // Create an HTTP server
        var srv = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('okay');
        });
        srv.on('upgrade', (req, socket, head) => {
            socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
                'Upgrade: WebSocket\r\n' +
                'Connection: Upgrade\r\n' +
                '\r\n');

            socket.pipe(socket); // echo back
        });

        // now that server is running
        srv.listen(1337, '127.0.0.1', () => {

            // make a request
            var options = {
                port: 1337,
                hostname: '127.0.0.1',
                headers: {
                    'Connection': 'Upgrade',
                    'Upgrade': 'websocket'
                }
            };

            var req = http.request(options);
            req.end();

            req.on('upgrade', (res, socket, upgradeHead) => {
                console.log('got upgraded!');
                socket.end();
                done();
            });
        });
    });

    it("open large number of socket connections with messages", function (done) {

        var i = 0;
        var socketCount = 0;
        var notificationsReceived = 0;
        var notificationsSent = 0;

        while (i < 100) {
            (function () {
                var socket = ioClient(socketurl);
                socket.on('connect', function () {
                    socketCount++;
                    console.log("Socket count: " + socketCount)
                    request({
                        method: "POST",
                        body: JSON.stringify({ "text": "anon" }),
                        headers: {
                            'content-type': 'application/json',
                        },
                        uri: notificationurl
                    }, function (error, response, body) {
                        notificationsSent++;
                        console.log("Notifications Sent: " + notificationsSent)
                    });
                });
                socket.on('disconnect', function () {
                    socketCount--;
                    console.log("Socket count: " + socketCount);
                    if (socketCount < 1) {
                        done();
                    }
                });

                socket.on('notification', function (data) {
                    socket.close();
                    var data = JSON.parse(data);
                    expect(data.data.text, 'Anonymous user receives anon message').to.be.equal('anon');
                    notificationsReceived++;
                    console.log("notificationsReceived count: " + notificationsReceived)
                });
            })()

            i++;
        }

    });

});
