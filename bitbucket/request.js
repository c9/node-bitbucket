/**
 * Copyright 2010 Ajax.org B.V.
 *
 * This product includes software developed by
 * Ajax.org B.V. (http://www.ajax.org/).
 *
 * Author: Fabian Jaokbs <fabian@ajax.org>
 */

var querystring = require('querystring');

/**
 * Performs requests on GitHub API.
 */

var Request = function(options) {
  this.$defaults = {
    /* eslint-disable key-spacing, max-len, camelcase */
    protocol    : 'https',
    path        : '/1.0',
    hostname    : 'api.bitbucket.org',
    format      : 'json',
    user_agent  : 'js-okbitbucket-api (http://github.com/maboiteaspam/node-okbitbucket)',
    http_port   : 443,
    timeout     : 20,
    login_type  : 'none',
    username    : null,
    password    : null,
    api_token   : null,
    oauth_access_token: null,
    proxy_host  : null,
    proxy_port  : null,
    debug       : false
    /* eslint-enable key-spacing, max-len, camelcase */
  };
  this.configure(options);
};


Request.prototype.configure = function(options)
{
  options = options || {};
  this.$options = {};
  for (var key in this.$defaults) {
    this.$options[key] = options[key] || this.$defaults[key];
  }

  return this;
};

/**
 * Change an option value.
 *
 * @param {String} name   The option name
 * @param {Object} value  The value
 *
 * @return {Request} The current object instance
 */
Request.prototype.setOption = function(name, value)
{
  this.$options[name] = value;
  return this;
};

/**
 * Get an option value.
 *
 * @param  name string  The option name
 * @param defaultValue
 *
 * @return mixed  The option value
 */
Request.prototype.getOption = function(name, defaultValue)
{
  defaultValue = defaultValue === undefined ? null : defaultValue;
  return this.$options[name] ? this.$options[name] : defaultValue;
};

/**
 * Send a GET request
 * @param apiPath
 * @param params
 * @param options
 * @param then (err{msg:''}, body{})
 */
Request.prototype.get = function(apiPath, params, options, then) {
  this.send(apiPath, params, 'GET', options, then);
};

/**
 * Send a POST request
 * @param apiPath
 * @param params
 * @param options
 * @param then (err{msg:''}, body{})
 */
Request.prototype.post = function(apiPath, params, options, then) {
  this.send(apiPath, params, 'POST', options, then);
};

/**
 * Send a request to the server, receive a response,
 * decode the response and returns an associative array
 *
 * @param  {String}    apiPath        Request API path
 * @param  {Object}    params     params
 * @param  {String}    httpMethod     HTTP method to use
 * @param  {Object}    options        reconfigure the request for this call only
 * @param then (err{msg:''}, body{})
 */
Request.prototype.send = function(apiPath, params, httpMethod, options, then)
{
  httpMethod = httpMethod || 'GET';
  if (options)
  {
    var initialOptions = this.$options;
    this.configure(options);
  }

  var self = this;
  this.doSend(apiPath, params, httpMethod, function(err, response) {
    if (!err) {
      var body = response.body;
      var status = response.status;
      var contentType = response.contentType;

      if ( ('' + status).match(/[45][0-9]{2}/) ) {
        err = {
          msg: response.body
        };
      }

      if (self.$options.format !== 'text') {
        if (contentType.match('json') ) {
          try {
            body = JSON.parse(body + '');
          } catch(ex){
            err = {
              msg: ex
            };
          }
        }
      }

      if (initialOptions) {
        self.options = initialOptions;
      }
    }

    if (then) {
      then(err, body);
    }
  });
};

/**
 * Send a request to the server, receive a response
 *
 * @param {String}   apiPath       Request API path
 * @param {Object}   params    params
 * @param {String}   httpMethod    HTTP method to use
 * @param then (err, body'')
 */
Request.prototype.doSend = function(apiPath, params, httpMethod, then)
{
  httpMethod = httpMethod.toUpperCase();
  var host = this.$options.proxy_host || this.$options.hostname;
  var port = this.$options.proxy_host
    ? this.$options.proxy_port || 3128
    : this.$options.http_port || 443;

  var headers = {
    'Host': 'api.bitbucket.org',
    'User-Agent': 'NodeJS HTTP Client',
    'Content-Length': '0',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  var getParams = httpMethod !== 'POST' ? params : {};
  var postParams = httpMethod === 'POST' ? params : {};


  var getQuery = querystring.stringify(getParams);
  var postQuery = querystring.stringify(postParams);
  this.$debug('get: ' + getQuery + ' post ' + postQuery);

  var path = this.$options.path + '/' + apiPath.replace(/\/*$/, '');
  if (getQuery){
    path += '?' + getQuery;
  }

  if (postQuery){
    headers['Content-Length'] = postQuery.length;
  }

  switch (this.$options.login_type) {
    case 'oauth':
      // TODO this should use oauth.authHeader
      // TODO once they add the missing argument
      var oauth = this.$options.oauth;
      /* eslint-disable */
      var orderedParameters = oauth._prepareParameters(
        /* eslint-enable */
        this.$options.oauth_access_token,
        this.$options.oauth_access_token_secret,
        httpMethod,
        'https://api.bitbucket.org' + path,
        postParams || {}
      );

      /* eslint-disable */
      headers.Authorization =
        oauth._buildAuthorizationHeaders(orderedParameters);
      /* eslint-enable */

      break;

    case 'token':
      var token = this.$options.username +
        '/token:' + this.$options.api_token;
      token = (new Buffer(token, 'ascii') ).toString('base64');
      headers.Authorization = 'Basic ' + token;
      break;

    case 'basic':
      var auth = this.$options.username +
        ':' + this.$options.password;
      auth = (new Buffer(auth, 'ascii') ).toString('base64');
      headers.Authorization = 'Basic ' + auth;
      break;

    default:
    // none
  }

  var getOptions = {
    host: host,
    post: port,
    path: path,
    method: httpMethod,
    headers: headers
  };

  var that = this;
  that.$debug('send ' + httpMethod + ' request: ' + path);
  var request = require(this.$options.protocol)
    .request(getOptions, function(response) {
      response.setEncoding('utf8');

      var body = [];
      response.addListener('data', function (chunk) {
        body.push(chunk);
      });
      response.addListener('end', function () {
        that.$debug('got reponse ' + httpMethod + ' request: ' + path);

        var contentType = response.headers['content-type'];
        body = body.join('');

        if (contentType.match(/json/) ){
          that.$debug('JSON\n%s', JSON.stringify(JSON.parse(body), null, 4) );
        } else {
          that.$debug('body\n%s', body);
        }
        that.$debug('status code %s', response.statusCode);
        that.$debug('content type %s', contentType);

        var ret = {
          status: response.statusCode,
          contentType: contentType,
          body: body
        };

        then(null, ret);
      });
    });

  if (httpMethod === 'POST'){
    request.write(postQuery);
  }

  request.end();
};

Request.prototype.$debug = function(msg) {
  if (this.$options.debug){
    console.error(msg,
      arguments[1] || '',
      // creepy http://stackoverflow.com/questions/9521921/
      arguments[2] || '', arguments[3] || '',
      arguments[4] || '', arguments[5] || '',
      arguments[6] || '', arguments[7] || '');
  }
};

module.exports = Request;
