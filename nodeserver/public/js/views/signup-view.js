/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Signup View
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.SignupView = Backbone.View.extend({
		events: {
			'click #signUpButton': function (e) {
				e.preventDefault();
				this.signUp();
			}
		},

		initialize: function () {
			// This hooks up the validation
			// See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
			Backbone.Validation.bind(this);
		},

		signUp: function () {
			var data = this.$el.serializeObject();

			this.model.set(data);

			console.log(this.model);
			console.log(data);

			// Check if the model is valid before saving
			// See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
			if (this.model.isValid(true)) {

				var dataObj = {
					username: this.model.get('username'),
					password: this.model.get('password'),
				}
				console.log(dataObj);
				// this.model.save();
				$.ajax({
					type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
					url: '/v1/login', // the url where we want to POST
					data: dataObj, // our data object
					dataType: 'text', // what type of data do we expect back from the server
					success: function (data) {
						console.log('success');
						console.log(data);
						window.location = "/v1/todos/public/";
					},
					error: function (xhr, status, error) {
						console.log('error');

						console.log(status);
						console.log(error);
					},
					done: function () {
						console.log('done');
					}
				})
			}
		},

		remove: function () {
			// Remove the validation binding
			// See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
			Backbone.Validation.unbind(this);
			return Backbone.View.prototype.remove.apply(this, arguments);
		}
	});
})(jQuery);