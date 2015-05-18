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

describe('authentification', function(){

  this.timeout(20000);

  var bitbucket = new BitBucket();

  it('should authenticate using username and password', function(done){
    bitbucket.authenticatePassword(secrets.username, secrets.password);
    bitbucket.getRepoApi().getUserRepos(secrets.username, function(err, repos) {
      (err == null).should.eql(true);
      repos.constructor.should.eql(Array);
      done();
    });

  });

  /* eslint-disable */
// @todo
//    "test: show user without authentification should have no 'plan'" : function(finished) {
//        test.userApi.show(username, function(err, user) {
//            assert.equal(user.plan, undefined);
//                finished();
//        });
//    },
//
//    "test: show user with authentification should have a 'plan'" : function(finished) {
//        test.github.authenticateToken(username, token);
//        test.userApi.show(username, function(err, user) {
//            assert.ok(user.plan !== undefined);
//            finished();
//        });
//    },

// @todo
//    "test: authenticate with bad token" : function(finished) {
//        this.github.authenticateToken(username, "bad-token");
//        this.userApi.show(username, function(err, user) {
//            assert.ok(err !== undefined);
//            finished();
//        });
//    }
  /* eslint-enable */

});
