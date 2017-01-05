const mongoose = require('mongoose');
const Account = require("../models/account.js");


var account = new Account({
    username: 'admin',
    password: 'admin'
});

account.save((error) => {
    console.log('---------saved account')
    if (error) console.log('error' + error.message);
    else console.log('no error');
});