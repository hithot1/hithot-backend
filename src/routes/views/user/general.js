"use strict";
var request = require("request");
// var common = require("./common");
const moment = require("moment");
const ec = require("../../../lib/error_consts");
const config = require("../../../config/config");

const passport = require('passport')

const { Validator } = require('node-input-validator');


const validatorRules = require('../../../lib/validator_rules');


var views = {

    login: function(req, res, next) {
        
        return res.render("login.ejs", {
            _csrf: req.csrfToken(),
            post: false
        });
    },

    loginPost: async function (req, res, next) {
        // console.log("req",req)

        passport.authenticate('local', function(err, user, info) {
            console.log("user user",user)
            if (err) {
                return next(err);
            }
            
            if (!user) {
                return res.render('login.ejs', { 
                    _csrf: req.csrfToken(),
                    post: true,
                    error: 'Invalid email or password.'
                });
            }

            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/cms/dashboard');
            });
        })(req, res, next);
    },

    logout: function(req, res, next) {
        if (req.user) {
            req.logout();
            req.session.destroy(function(err) {
                if (err) console.log(err);
                res.redirect('/login');
            });
        } else {
            res.redirect('/');
        }
    },
};

module.exports = views;