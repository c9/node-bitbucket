module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');
    const path = require('path');
    


    const webpack = require('webpack');
    const config = require('./webpack.config');

    var module = {};

    var app = opts.app;

    const compiler = webpack(config);

    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        }
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });


    return module;
};