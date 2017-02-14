/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Signup Model
	// ----------

	app.signup = Backbone.Model.extend({
		// defaults: {
		// 	terms: false,
		// 	gender: ''
		// },
		validation: {
			username: {
				required: true
			},
			// email: {
			// 	// required: true,
			// 	pattern: 'email'
			// },
			password: {
				minLength: 8
			},
			// repeatPassword: {
			// 	equalTo: 'password',
			// 	msg: 'The passwords does not match'
			// },
			// country: {
			// 	oneOf: ['Norway', 'Sweeden']
			// },
			// gender: {
			// 	// required: true
			// },
			// age: {
			// 	// required: false,
			// 	range: [18, 100]
			// },
			// terms: {
			// 	// acceptance: true
			// }
		}
	});
})();