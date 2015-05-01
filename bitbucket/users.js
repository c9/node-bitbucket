/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var util = require('util');
var AbstractApi = require('./abstract_api.js');

var UsersApi = function(api){
  this.$api = api;
};
util.inherits(UsersApi, AbstractApi);

/**
 * Get user data and repository list
 *
 * @param username
 * @param callback (err{msg:''}, body{})
 */
UsersApi.prototype.getUserData = function(username, callback) {
  this.$api.get('users/' + username, null, null, callback);
};

module.exports = UsersApi;
