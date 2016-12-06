module.exports = function (opts) {

    var app = opts.app;
    app.get('/ping', function (req, res) {
        res.send('pong');
    });

    app.post('/ping',function(req,res) {
        res.send('pong');
    });

    module.app = app;

    function privateFunction(pickle, jar) {
        // This will be NOT available 'outside'.
    };

    return module;
};