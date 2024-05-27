'use strict';

var ec = require('../../lib/error_consts');
const jwt = require('jsonwebtoken');

// const access_model = require("../../model/access-control");

const JWT_SECRET = process.env.JWT_SECRET;


var authenticate = {

    generateToken: function (tokenData) {

        let token = jwt.sign(tokenData, JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    },

    validateToken: async function (req, res, next) {

        let token = req.headers['x-access-token'];

        if (!token) {
            return next(ec.appError({
                status: ec.UNAUTHORIZED_ACCESS,
                message: "invalid token"
            }));
        }

        jwt.verify(token, JWT_SECRET, function (err, decoded) {

            if (!decoded) {
                return next(ec.appError({
                    status: ec.UNAUTHORIZED_ACCESS,
                    message: "Failed to authenticate token."
                }));
            }

            req.user = {
                _id: decoded._id,
                name: decoded.name,
                is_premium: decoded.is_premium
            }

            return next();
        });

    },

    checkPremium: async function (req, res, next) {

        if (!req.user) {
            return next(ec.appError({
                status: ec.UNAUTHORIZED_ACCESS,
                message: "Failed to authenticate token."
            }));
        }

        if (!req.user.is_premium) {
            return next(ec.appError({
                status: ec.USER_NOT_PREMIUM,
                message: "Please become premium member on Slow app."
            }));
        }

        return next();

    },

    checkSessionUser: function(req, res, next) {
        if (!req.user) {
            var ip = (req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
            console.log('Unauthorised request. ' + req.method + ' ' + ip + ' ' + req.url);
            res.redirect('/login');
        } else {
            return next();
        }
    },

    checkAdmin: function(req, res, next) {
        if (!req.user) {
            var ip = (req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
            console.log('Unauthorised request. ' + req.method + ' ' + ip + ' ' + req.url);
            res.redirect('/login');
        } else if(req.user.role !== 'ADMINISTRATOR'){
        	res.redirect('/logout');
        } else {
            return next();
        }
    },

    checkCRMPermission: async function (req, res, next) {
        
        if (!req.user) {
            var ip = (req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
            console.log('Unauthorised request. ' + req.method + ' ' + ip + ' ' + req.url);
            res.redirect('/login');
        } else if(req.user.role === 'CRM_USER' || req.user.role === 'ADMINISTRATOR' ){
            return next();
        } else {
        	return res.redirect('/logout');
        }
    },

    checkCMSPermission: function(req, res, next){

        if (!req.user) {
            var ip = (req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
            console.log('Unauthorised request. ' + req.method + ' ' + ip + ' ' + req.url);
            res.redirect('/login');
        } 
        
        if(req.user.role === 'ADMINISTRATOR'){
        	return next();
        }

        if (req.user.role === 'CMS_USER') {
            
            const url = req.originalUrl;
            let url_part = url.split('cms/')[1];
            let permissions_to_check_for = url_part.split('/')[0].toUpperCase();

            if (req.user.permissions.includes(permissions_to_check_for)) {
                return next();
            }
        }
        
        if (req.user.role === 'CMS_USER_CITIZEN') {
            
            const url = req.originalUrl;
            let url_part = url.split('cms/')[1];
            let permissions_to_check_for = url_part.split('/')[0].toUpperCase();
            console.log("PERMISSIONS > > ", permissions_to_check_for)

            if (req.user.permissions.includes(permissions_to_check_for)) {
                return next();
            }
        }

        return res.redirect('/logout');

    },

    checkCMSGeneralPermission: function(req, res, next){

        if (!req.user) {
            var ip = (req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
            console.log('Unauthorised request. ' + req.method + ' ' + ip + ' ' + req.url);
            return res.redirect('/logout');
        } 
        
        if(req.user.role === 'ADMINISTRATOR' || (req.user.role === 'CMS_USER' && req.user.permissions.includes('GENERAL'))){
        	return next();
        }

        return res.redirect('/logout');

    },
}

module.exports = authenticate;
