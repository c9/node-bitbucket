/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var BitBucket = require("../");
var secrets = require("./secrets");
require('should');

describe('ssh', function(){

  var pubkey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2YuevRJKTVUAjbUvGCi+rhEAdxc8CGXSiq3JwY0EpUXmD89UFSTr1XI+i3Bq5di/kAJhdI3mqiipN1+3LP7HZsd3sFuY9mb5wbZLwHrBvjEhTsOgxFEzyCm87K8OT2uuazsG2uHL/VT0E2o2Ttu2HEu6k3yrx+3ZcPTKJVOdT0tJ5nIobbpgfv3CHmbvdskqSTq1vefh2je8yeiQYMIFsdJ7ApZEmLtGwEIMEVFNSgBJauRQS6qDmI9D1oVV7h5zPNW1qCR1sjsPyb6jxQS2+N63duY0qZuA8C6h2zX+TneY1iSRJcgniAjds2alNH2MJTxl+toIjXvviA7hsVJCD c9@c9.io";

  this.timeout(20000);

  var bitbucket = new BitBucket(true);
  bitbucket.authenticatePassword(secrets.username, secrets.password);

  beforeEach(function(done){
    bitbucket.getSshApi().deleteAllKeys(done);
  });

  it('should delete/add ssh key', function(done){
    bitbucket.getSshApi().addKey(pubkey, function(err, key) {
      if(err)console.error(err);
      (err==null).should.be.true;
      key.key.should.eql(pubkey);
      bitbucket.getSshApi().deleteKey(key.pk, function(err){
        if(err)console.error(err);
        (err==null).should.be.true;
        done();
      });
    });
  });
  it('should get all ssh keys', function(done){
    bitbucket.getSshApi().addKey(pubkey, function(err, key) {
      if(err)console.error(err);
      (err==null).should.be.true;
      bitbucket.getSshApi().getKeys(function(err, keys) {
        if(err) console.error(err);
        (err==null).should.be.true;
        keys.length.should.be.above(0);
        keys[0].key.should.eql(pubkey);
        done()
      });
    });
  });

  it('should prevent to overwrite existing keys', function(done){
    bitbucket.getSshApi().addKey(pubkey, function(err,key) {
      if(err)console.error(err);
      key.key.should.eql(pubkey);
      (err==null).should.be.true;
      bitbucket.getSshApi().addKey(pubkey, function(err) {
        if(err)console.error(err);
        err.msg.should
          .match(/Someone has already registered that SSH key/);
        done();
      });
    });
  });

});
