
'use strict';

var csrf = require('csurf');
var csrfProtection = csrf();
var error = require('../../error');
var auth = require('../../auth/authenticate');
const users = require('./users');
const home = require('./home');

module.exports = function(app) {
        // app.get('/cms', csrfProtection, auth.checkSessionUser, auth.checkCMSPermission, home.index, error);
        // app.get('/cms/dashboard', csrfProtection, auth.checkSessionUser, auth.checkCMSPermission, home.index, error);
       // app.get('/cms/dashboard', csrfProtection, auth.checkSessionUser, auth.checkCMSPermission, home.index, error);
        app.get('/cms/dashboard', csrfProtection, home.index, error);

        // user get route
        // app.get('/cms/myusers/add-users', csrfProtection,  auth.checkSessionUser, auth.checkCMSGeneralPermission, myusers.addUsers, error);
        // app.get('/cms/myusers/edit-users/:id?', csrfProtection,  auth.checkSessionUser, auth.checkCMSGeneralPermission, myusers.editUsers, error);
        app.get('/cms/myusers/manage-users', users.manageUsers, error);

        //POST ROUTES

        // app.post('/cms/upload-image', auth.checkSessionUser, home.uploadImagePost, error);



     
        //user post route
        // app.post('/cms/myusers/add-users', csrfProtection,  auth.checkSessionUser, auth.checkCMSGeneralPermission, myusers.addUsersPost, error);
        // app.post('/cms/myusers/edit-users', csrfProtection,  auth.checkSessionUser, auth.checkCMSGeneralPermission, myusers.editUsersPost, error);
        // app.delete('/cms/myusers/remove/:id?', auth.checkSessionUser, auth.checkCMSPermission, myusers.deleteUsers, error);


    };
