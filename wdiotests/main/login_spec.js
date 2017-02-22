var expect = require('chai').expect;

var baseurl = "http://localhost:3000";

const publicurl = baseurl + "/public";

describe('login page', function() {
    it('should be able to login', function () {
        browser.url(publicurl+'/login');
        // filtering property commands
        $('input[name=\'username\']').setValue('admin12345');
        $('input[name=\'password\']').setValue('admin12345');

        $('button').click();


        browser.waitForVisible('form#create-todo');
        
        expect(browser.isVisible('form#create-todo'),'todo form is visible').to.be.true;

        var results = $$('form#create-todo').filter(function (form) {
            return form.isVisible();
        });

    });
});