var request = require('request');
var expect = require("chai").expect;


process.env.EXPRESS_SESSION_SECRET = 'secret';
process.env.PORT = 0;


describe("reminders send socket events", function () {


  it('successfully start server with mocked time', function (done) {
    this.timeout(5000); //creating a new server for testing can take longer than 2 seconds

    var main = require(__dirname + '/../../../main.js')({}, function (port) {
      console.log('server listening on port ' + port);
      baseurl = "http://localhost:" + port;
      loginurl = baseurl + '/v1/login';
      todourl = baseurl + '/v1/todos';

      done();
    });
  });



  it("successfully login with admin:admin", function (done) {
    request({
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "username": "admin12345",
        "password": "admin12345"
      }), //sets header to application/json and parses body as json
      uri: loginurl
    }, function (error, response, body) {
      console.log(response.headers);
      expect(error).to.be.equal(null);
      expect(response.statusCode).to.equal(201);
      expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
      expect(response.headers['set-cookie']).not.to.be.undefined;
      cookie = response.headers['set-cookie'];
      done();
    });
  });

  it("can view own todos", function (done) {
    //I want the raw response for most test cases.
    request({
      method: "GET",
      headers: {
        'content-type': 'application/json',
        Cookie: cookie
      },
      uri: todourl
    }, function (error, response, body) {
      console.log(body);
      expect(error).to.be.equal(null);
      //empty response
      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
      var data = JSON.parse(body);
      todolength = data.length;
      done();
    });
  });

  it("successfully create todo with user", function (done) {
    //I want the raw response for most test cases.
    request({
      method: "POST",
      body: JSON.stringify({ "text": "test" }),
      headers: {
        'content-type': 'application/json',
        Cookie: cookie
      },
      uri: todourl
    }, function (error, response, body) {
      console.log(body);
      expect(error).to.be.equal(null);
      //empty response
      console.log(response.headers);
      console.log(response.statusCode);
      expect(response.statusCode).to.equal(201);
      expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
      var data = JSON.parse(body);
      expect(data.user_id).not.to.be.null;
      expect(data._id).not.to.be.undefined;
      todo = data;
      done();
    });
  });


  it("add 5 minute reminder", function (done) {
    //I want the raw response for most test cases.
    request({
      method: "POST",
      headers: {
        'content-type': 'application/json',
        Cookie: cookie
      },
      uri: baseurl + "/v1/todos/" + todo._id + "/add5minutereminder"
    }, function (error, response, body) {
      console.log(body);
      expect(error).to.be.equal(null);
      expect(response.statusCode).to.equal(201);
      expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
      var data = JSON.parse(body);
      done();
    });
  });
});

