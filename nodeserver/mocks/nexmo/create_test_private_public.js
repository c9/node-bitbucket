var ursa = require('ursa');
var fs = require('fs');

var ursa = require('ursa');
var key = ursa.generatePrivateKey(1024, 65537);
var privkeypem = key.toPrivatePem();
var pubkeypem = key.toPublicPem();

fs.writeFile("private.pem", privkeypem.toString('ascii'), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

fs.writeFile("public.pem", pubkeypem.toString('ascii'), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 