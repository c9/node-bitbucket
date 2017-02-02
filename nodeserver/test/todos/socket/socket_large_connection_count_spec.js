var baseurl = "http://localhost:3000";
var loginurl = baseurl + '/v1/login';
var notificationurl = baseurl + '/v1/todos/sendNotification';
socketurl = 'http://localhost:3000/v1/todos';

var ioClient = require('socket.io-client');
var request = require('request');
var expect = require("chai").expect;

describe('socket large connection count >>', function () {
    this.timeout(1000 * 60 * 10); //10 minutes
    it("open large number of socket connections and get notification event", function (done) {
        var max_socket_count = 10000; //10,000 sockets
        var i = 0;
        var socketCount = 0;
        var notificationsReceived = 0;
        var notificationsSent = 0;

        var done_called = false;


        var createSocket = function () {
            ioClient(socketurl).on('connect', function (socket) {
                socketCount++;
                console.log("Socket count: " + socketCount)
                if (socketCount === max_socket_count) {
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
                }
                else {
                    createSocket();
                }
            }).on('notification', function (data) {
                this.close();
                var data = JSON.parse(data);
                expect(data.data.text, 'Anonymous user receives anon message').to.be.equal('anon');
                notificationsReceived++;
                console.log("notificationsReceived count: " + notificationsReceived)
                if (notificationsReceived == max_socket_count) {
                    done();
                }
            });
        }

        createSocket();

    });

it("open medium number of socket connections and get notification event", function (done) {
        var max_socket_count = 10;
        var i = 0;
        var socketCount = 0;
        var notificationsReceived = 0;
        var notificationsSent = 0;

        var done_called = false;


        var createSocket = function () {
            ioClient(socketurl).on('connect', function (socket) {
                socketCount++;
                console.log("Socket count: " + socketCount)
                if (socketCount === max_socket_count) {
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
                }
                else {
                    createSocket();
                }
            }).on('notification', function (data) {
                this.close();
                var data = JSON.parse(data);
                expect(data.data.text, 'Anonymous user receives anon message').to.be.equal('anon');
                notificationsReceived++;
                console.log("notificationsReceived count: " + notificationsReceived)
                if (notificationsReceived == max_socket_count) {
                    done();
                }
            });
        }

        createSocket();

    });

});