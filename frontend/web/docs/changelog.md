== Version 1.0 ==
Added changelog and readme.
Added shell to /shell for all logged in users
Added endpoint /fitbit for registering fitbit users with application
/fitbit/users/:user_id/profile for fit user profile added
/fitbit/users/:user_id/sleep/:date for fitbit user sleep records added

=Added example sleepreport and sleep data=
* /examples/fitbit/users/me/sleepreport for example sleepreport
* /examples/fitbit/users/me/sleep/2016-09-10/2016-09-20 for example sleep json
* /examples/fitbit/users/me/sleep/2016-09-01/2016-09-30 for example sleep json
* autorefresh token on /fitbit/users/:user_id/sleep/:date