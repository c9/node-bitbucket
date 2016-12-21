var nodemailer = require('nodemailer');
const uuid = require('node-uuid');


var fs = require('fs');
if (fs.existsSync(__dirname+'/../params.js')) {
    process.env = require(__dirname+'/../params.js').env;
}




if (process.env.SMTP_TRANSPORT) {
    var transporter = nodemailer.createTransport(process.env.SMTP_TRANSPORT);
}
else {
    var pickupTransport = require('nodemailer-pickup-transport');
    var transporter = nodemailer.createTransport(
        pickupTransport({directory:__dirname + '/../email'}));
}

// create reusable transporter object using the default SMTP transport

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Fred Foo ?" <russ@coderuss.com>', // sender address
    to: 'russ@coderuss.com, russjohnson09@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<b>Hello world ?</b>', // html body
    headers: {
        "message-id": uuid.v1()
    }
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});