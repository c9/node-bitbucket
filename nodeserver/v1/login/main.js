module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');
    var fs = require('fs');
    var ObjectID = require('mongodb').ObjectID;
    var uuid = require('node-uuid');

    var router = express.Router();
    var bcrypt = require('bcrypt');


    var database = opts.database;
    var passport = opts.passport;

    const User = database.collection('user');

    const LocalStrategy = require('passport-local').Strategy;

    var comparePassword = function (password, hash, callback) {
        // Load hash from your password DB. 
        bcrypt.compare(password, hash, function (err, res) {
            callback(err, res)
        });
    }

    var hashPassword = function (password, callback) {
        bcrypt.genSalt(function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                callback(err, hash);
            });
        });
    }

    passport.use(new LocalStrategy(
        function (username, password, done) {
            winston.debug('start authentication');
            winston.debug('start authentication');
            winston.debug(username);
            winston.debug(password);
            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    winston.error(err);
                    return done(err);
                }
                if (!user) {
                    hashPassword(password, function (err, hash) {
                        if (err) {
                            winston.error(err);
                        }
                        User.insertOne({ username: username, password: hash },
                            function (error, result) {
                                winston.debug(result);
                                return done(null, { _id: result.insertedId });
                            });
                    });
                    return;
                }
                comparePassword(password, user.password, function (err, res) {
                    if (!res) {
                        winston.debug('password does not match')
                        return done(null, false);
                    }
                    else {
                        winston.debug('user found password match');
                        return done(null, user);
                    }

                });

            });
        }
    ));


    passport.serializeUser(function (user, done) {
        winston.debug('serializeUser');
        winston.debug(user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        winston.debug('deserializeUser');
        winston.debug(id);
        User.findOne({ _id: ObjectID(id) }, function (err, user) {
            winston.debug(user);
            if (err) {
                winston.error(err);
            }
            done(err, user);
        });
    });

    router.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('profile');
        });

    router.get('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/public/login');
        });

    router.get('/profile',
        function (req, res) {
            winston.debug(req.isAuthenticated());
            if (!req.isAuthenticated()) {
                res.redirect('/public/login');
            }
            winston.debug(req.user);
            res.send(JSON.stringify({ user: req.user }));
            res.end();
        });

    module.router = router;

    return module;
};