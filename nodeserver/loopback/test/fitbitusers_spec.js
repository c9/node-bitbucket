var request = require('supertest');
var express = require('express');

var app = express();

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'tobi' });
});

describe('GET /users', function() {
  it('respond with json', function(done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});