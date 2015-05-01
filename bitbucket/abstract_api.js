/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var AbstractApi = (function(){
  var AbstractApi = function(api) {
    this.$api = api;
  };

  AbstractApi.prototype.$createListener = function(callback, key) {
    return function(err, response) {
      if (err) {
        callback & callback(err);
        return;
      }

      callback && callback(err, key ? response[key] : response);
    };
  };

  return AbstractApi;
})();

module.exports = AbstractApi;