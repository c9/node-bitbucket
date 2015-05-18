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

describe('email', function(){

  this.timeout(20000);

  var bitbucket = new BitBucket();
  bitbucket.authenticatePassword(secrets.username, secrets.password);

  it('should get list of all email addresses', function(done){
    bitbucket.getEmailApi().getAll(function(err, emails) {
      (err == null).should.eql(true);
      emails.constructor.should.eql(Array);
      emails.length.should.be.above(0);
      emails[0].email.should.eql(secrets.email);
      done();
    });
  });

});
