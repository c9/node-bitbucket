/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var util = require('util');
var async = require('asyncjs');
var AbstractApi = require('./abstract_api');

var SshApi = function(api) {
  this.$api = api;
};
util.inherits(SshApi, AbstractApi);

/**
 * List all public SSH keys on the account
 *
 * @param callback (err{msg:''}, body{})
 */
SshApi.prototype.getKeys = function(callback) {
  this.$api.get('ssh-keys/', null, null, callback);
};

/**
 * Add a public SSH key on the account
 *
 * @param pubkey
 * @param callback (err{msg:''}, body{})
 */
SshApi.prototype.addKey = function(pubkey, callback) {
  this.$api.post('ssh-keys/', {key: pubkey}, null, callback);
};

/**
 * Delete a public SSH key on the account
 *
 * @param pubkey
 * @param callback (err{msg:''}, body{})
 */
SshApi.prototype.deleteKey = function(pubkey, callback) {
  /* eslint-disable dot-notation */
  this.$api['delete']('ssh-keys/' + pubkey, null, null, callback);
  /* eslint-enable dot-notation */
};

/**
 * delete all public SSH keys on the account
 *
 * @param then ()
 */
SshApi.prototype.deleteAllKeys = function(then) {
  var that = this;
  this.getKeys(function(err, keys) {
    if (err) {
      throw err;
    }
    async.forEach(keys, function(key, next) {
      that.deleteKey(key.pk, next);
    }, then);
  });
};

module.exports = SshApi;
