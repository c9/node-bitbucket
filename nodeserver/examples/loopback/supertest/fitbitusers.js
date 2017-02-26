var request = require('supertest');
var https = require('https');
var fs = require('fs');
var path = require('path');
// var should = require('should');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');



process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('GET /users', function() {
  it('respond with json', function(done) {
    var app = express();
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        // console.log(this);
        console.log(res.body);
                // console.log(res);

        if (err) return done(err);
        done();
      });
  });
});

// return;

describe('request(url)', function() {
  it('should be supported', function(done) {
    var app = express();
    var s;

    app.get('/', function(req, res) {
      res.send('hello');
    });

    s = app.listen(function() {
      var url = 'http://localhost:' + s.address().port;
      console.log(url);
      request(url)
      .get('/')
      .expect('hello', done);
    });
  });

  describe('.end(cb)', function() {
    it('should set `this` to the test object when calling cb', function(done) {
      var app = express();
      var s;

      app.get('/', function(req, res) {
        res.send('hello');
      });

      s = app.listen(function() {
        var url = 'http://localhost:' + s.address().port;
        var test = request(url).get('/');
        test.end(function(err, res) {
          console.log(res.body);
          // this.should.eql(test);
          done();
        });
      });
    });
  });
});

return;

describe('request(app)', function() {
  it('should fire up the app on an ephemeral port', function(done) {
    var app = express();

    app.get('/', function(req, res) {
      res.send('hey');
    });

    request(app)
    .get('/')
    .end(function(err, res) {
      res.status.should.equal(200);
      res.text.should.equal('hey');
      done();
    });
  });

});

// app.listen(3000);

// describe('GET /users', function() {
//   it('respond with json', function(done) {
//     var app = express();
//     var s;


//     app.get('/user', function(req, res) {
//       res.status(200).json({ name: 'tobi' });
//     });
//     s = app.listen(function() {
//       var url = 'http://localhost:' + s.address().port;
//       console.log(url);
//       request(url)
//         .get('/users')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .end(function(err, res) {
//           if (err) return done(err);
//           done();
//         });
//     });

//   });
// });