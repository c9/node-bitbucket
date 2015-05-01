/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var BitBucket = require('../');
var secrets = require('./secrets');
require('should');

describe('users', function(){

  this.timeout(20000);

  var bitbucket = new BitBucket(true);
  bitbucket.authenticatePassword(secrets.username, secrets.password);

  it('should get data of authenticated user', function(done){
    bitbucket.getUsersApi().getUserData(secrets.username, function(err, data) {
      (err == null).should.eql(true);
      data.user.username.should.eql(secrets.username);
      ('repositories' in data).should.eql(true);
      done();
    });
  });

});
