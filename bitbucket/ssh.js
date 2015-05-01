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
var AbstractApi = require("./abstract_api");

var SshApi = (function(){
  var SshApi = function(api) {
    this.$api = api;
  };
  util.inherits(SshApi, AbstractApi);

  /**
   * List all public SSH keys on the account
   */
  SshApi.prototype.getKeys = function(callback) {
    this.$api.get("ssh-keys/", null, null, callback);
  };

  /**
   * Add a public SSH key on the account
   */
  SshApi.prototype.addKey = function(key, callback) {
    this.$api.post("ssh-keys/", {key: key}, null, callback);
  };

  /**
   * Delete a public SSH key on the account
   */
  SshApi.prototype.deleteKey = function(pk, callback) {
    this.$api["delete"]("ssh-keys/" + pk, null, null, callback);
  };

  /**
   * delete all public SSH keys on the account
   * @param then
   */
  SshApi.prototype.deleteAllKeys = function(then) {
    var that = this;
    this.getKeys(function(err, keys) {
      if(err) throw err;
      async.forEach(keys, function(key, next) {
        that.deleteKey(key.pk, next);
      }, then);
    });
  };

  return SshApi;
})();

module.exports = SshApi;