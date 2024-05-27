
'use strict';

var csrf = require('csurf');
var csrfProtection = csrf();
var error = require('../../error');
var auth = require('../../auth/authenticate');
const general = require('./general');

module.exports = function(app) {
     //GET ROUTES
     app.get('/login', csrfProtection, general.login, error);
     app.get('/logout', general.logout, error);


     //POST ROUTES
     app.post('/login', csrfProtection, general.loginPost, error);
     

};
