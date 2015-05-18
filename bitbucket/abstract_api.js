/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var AbstractApi = function(api) {
  this.$api = api;
};

/**
 *
 * @param callback (err, body{*})
 * @param key
 * @returns {Function}
 */
AbstractApi.prototype.$createListener = function(callback, key) {
  return function(err, response) {
    if (err) {
      if (callback) {
        return callback(err);
      }
    }

    if (callback) {
      return callback(err, key ? response[key] : response);
    }
  };
};

module.exports = AbstractApi;
