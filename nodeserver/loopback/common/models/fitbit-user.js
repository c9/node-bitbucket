'use strict';
//https://github.com/strongloop/loopback/issues/600
module.exports = function(Fitbituser) {
      Fitbituser.validatesUniquenessOf('email', {message: 'email is not unique'});
      Fitbituser.validatesUniquenessOf('fitbit_user_id', {message: 'fitbit user id is not unique'});

};
