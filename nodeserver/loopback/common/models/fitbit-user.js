'use strict';
//https://github.com/strongloop/loopback/issues/600
//https://github.com/strongloop/loopback/issues/301 //401 always returned no 403
module.exports = function (Fitbituser) {
      Fitbituser.validatesUniquenessOf('email', { message: 'email is not unique' });
      Fitbituser.validatesUniquenessOf('fitbit_user_id', { message: 'fitbit user id is not unique' });

      //https://groups.google.com/forum/#!topic/loopbackjs/oK2g5A_h6vI
      //server/config.json
      // {
      //   “remoting”: 
      //     “errorHandler”: {
      //       “disableStackTrace”: true
      //     }
      // }

      Fitbituser.getName = function (id, cb) {
            Fitbituser.findById(id, function (err, instance) {
                  if (instance) {
                        var response = "Name of coffee shop is " + instance.fitbit_user_id;
                        cb(null, response);
                        console.log(response);
                  }
                  else {
                        var err = new Error('Fitbit user not found');
                        err.statusCode = 404;
                        cb(err);
                  }
            });
      }
      Fitbituser.remoteMethod(
            'getName',
            {
                  http: { path: '/:id/getname', verb: 'get' },
                  accepts: {
                        arg: 'id', type: 'string',
                        // http: { source: 'query' } 
                  },
                  returns: { arg: 'name', type: 'string' }
            }
      );




      Fitbituser.remoteMethod(
            'status', {
                  http: {
                        path: '/status',
                        verb: 'get'
                  },
                  returns: {
                        arg: 'status',
                        type: 'string'
                  }
            }
      );


      Fitbituser.status = function (cb) {
            var currentDate = new Date();
            var currentHour = currentDate.getHours();
            var OPEN_HOUR = 6;
            var CLOSE_HOUR = 20;
            console.log('Current hour is %d', currentHour);
            var response;
            if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
                  response = 'We are open for business.';
            } else {
                  response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
            }
            cb(null, response);
      };
};
