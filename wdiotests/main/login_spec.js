var expect = require('chai').expect;

var baseurl = "http://localhost:3000";

const publicurl = baseurl + "/public";

describe('login page', function() {
    it('should be able to login', function () {
        browser.url(publicurl+'/login');
        // filtering property commands
        $('input[name=\'username\']').setValue('admin123456');
        $('input[name=\'password\']').setValue('admin123456');

        $('button').click();

        browser.waitForVisible('form#create-todo');

        expect(browser.isVisible('form#create-todo'),'todo form is visible').to.be.true;

    });
});