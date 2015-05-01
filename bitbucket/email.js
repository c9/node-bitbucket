/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var util = require('util');
var AbstractApi = require('./abstract_api');

/**
 * API wrapper for http://confluence.atlassian.com/display/BBDEV/Emails
 */

var EmailApi = function (api) {
  this.$api = api;
};
util.inherits(EmailApi, AbstractApi);

/**
 * Get auuser data including the repository list
 */
EmailApi.prototype.getAll = function(callback) {
  this.$api.get('emails/', null, null, callback);
};

module.exports = EmailApi;
