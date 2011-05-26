/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var assert = require("assert");
var async = require("asyncjs");
var BitBucket = require("./index").BitBucket;
var secrets = require("./secrets");

var pubkey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDDSE35sy6Ey4c47NqSma5/w5LqJ4dVzsPxvR6VdBkim0Q6Wfa/CvnToTr2KqaHtQzrBsY9lKqUATKpir3PCQcrMWgm4cq2/8gMTkRx1XwMtH/6XVBz6mccVziJk5079wbiqeV16Icy7VHYxYbYyCk7f9YfgexabARmSMbtJhttK1BdpKDMOSK2koi3oGNIKNMqdVvcNp0Ea5CnHb2Uq83zqfuwfjAQaCSGJ9mhXvtXf5P/UW6euA3HJWDPr8M16Q/q8ByxHzHn26NScek8AoAcYIsWLOXC3Y4vB/an/8YAZLVmB/0mlGFkCoLEMzP3LlsL+anTY2JFY9m0N3ecLNpF cloud9@vps6782.xlshosting.net";

var test = module.exports = {

    setUpSuite : function(next) {
        this.setUpApi();
        this.deleteAllKeys(next);
    },

    setUp: function() {
        this.setUpApi();
    },

    setUpApi: function() {
        this.bitbucket = new BitBucket(true);
        this.bitbucket.authenticatePassword(secrets.username, secrets.password);
        this.sshApi = this.bitbucket.getSshApi();
    },

    deleteAllKeys: function(callback) {
        test.sshApi.getKeys(function(err, keys) {
            if (err) return callback(err);
            
            async.forEach(keys, function(key, next) {
                test.sshApi.deleteKey(key.pk);    
            }, callback);
        });
    }, 

    "test: get all ssh keys" : function(finished) {
        test.sshApi.addKey(pubkey, function(err, key) {
            test.sshApi.getKeys(function(err, keys) {
                assert.equal(err, null);
                assert.ok(keys.length > 0);
                assert.ok(keys[0].key == pubkey);
                assert.ok(keys[0].pk !== undefined);
                
                // cleanup
                test.sshApi.deleteKey(keys[0].pk, finished);
            });
        });
    },

    "test: delete/add ssh key" : function(finished) {
        test.sshApi.addKey(pubkey, function(err, key) {
            assert.equal(err, null);
            assert.ok(key.key == pubkey);
            
            // cleanup
            test.sshApi.deleteKey(key.pk, finished);
        });
    },
    
    "test: adding and existing key should return an error" : function(finished) {
        test.sshApi.addKey(pubkey, function(err, key) {
            test.sshApi.addKey(pubkey, function(err) {
                assert.ok(err.msg.match(/Key already registered in bitbucket/));
                
                // cleanup
                test.sshApi.deleteKey(key.pk, finished);
            });
        });
    }
};

!module.parent && async.test.testcase(module.exports).exec();