"use strict";
// var request = require("request");
// var common = require("./common");
const moment = require("moment");
// const needle = require("needle");
// const fs = require("fs");
// const { Validator } = require('node-input-validator');
// const {forEach} = require('p-iteration');

// const ec = require("../../../lib/error_consts");
// const config = require("../../../config/config");
// const validatorRules = require('../../../lib/validator_rules');
// const mysqldb = require('../../../functions/mysqldb');

// // const uploadFunctions = require('../../../functions/upload_files');
// const { v4: uuidv4 } = require('uuid');
// const permissions = require("../../../../static/userPermission.json");
const mysql = require('mysql');
const userslist = require('../../../functions/cms/users');

const usersObj = {
    // add users
    

    addUsers: async function (req, res, next) {

        return res.render("cms/myusers/add-myusers.ejs", {
            _csrf: req.csrfToken(),
            permissions
        });
    },

    addUsersPost: async function (req, res, next) {

        try {

            let params = {};
            // const v = new Validator(req.body, validatorRules.videos);
            // const matched = await v.check();
            // if(!matched){            
            //     
            //     var errMsg = '';
            //     for (var key in v.errors){
            //         errMsg += v.errors[key].message + ' ';
            //     }
            //     return next(ec.appError({
            //         status: ec.INVALID_DATA,
            //         message: errMsg
            //     }));
            // }

            // if (!req.files || !req.files.thumbnail_image_file || !req.files.thumbnail_image_file.name) {
                
            //     return next(ec.appError({
            //         status: ec.INVALID_DATA,
            //         message: 'Please select thumbnail image.'
            //     }));
            // }

            // if(req.files){

            //     let validImg = new Validator(req.files.thumbnail_image_file, validatorRules.user_image);
            //     let imgMatched = await validImg.check();
            //     if(!imgMatched){            
            //         var errMsg = '';
            //         for (var key in validImg.errors){
            //             errMsg += validImg.errors[key].message + ' ';
            //         }
            //         return next(ec.appError({
            //             status: ec.INVALID_DATA,
            //             message: errMsg
            //         }));
            //     }
            // }

            let permission;


           
            if (!req.body.permission || !req.body.permission['']) {
                params["permission"] ="";
            } else {

                if (Array.isArray(req.body.permission[''])) {
                    params["permission"] = req.body.permission[''];
                } else {
                    params["permission"] = [req.body.permission['']];
                }
            }
           

            params["name"] = req.body.name.trim();
            params["role"] = req.body.role.trim();
            params["email"] = req.body.email;
           // params["permission"] = req.body.permission()
            const resp = await myusersFunction.create(params);

            if (resp.success) {
                return res.send({success: true});
            } else {
                return res.send({
                    success: false,
                    message: resp.message
                });
            }
        } catch (err) {
            return next(ec.appError({
                status: ec.UNKNOWN_ERROR,
                message: err.message
            }));
        }
        
    },

   // edit users
   editUsers: async function (req, res, next) {

    if (!req.params || !req.params.id) {

        return res.render('cms/404');
    };
    

    let fetchUsers = await myusersFunction.fetchUsers({id: req.params.id});
    

    if (!fetchUsers || !fetchUsers.data || !fetchUsers.data.length) {
        return res.render('cms/404');
    }
    console.log("permissions",permissions)

    return res.render("cms/myusers/edit-myusers", {
        _csrf: req.csrfToken(),
        data: fetchUsers.data[0],
        permissions

    });
},
   
editUsersPost: async function (req, res, next) {

    try {

        let params = {};
        let permission;

        if (!req.body.permission || !req.body.permission['']) {
            params["permission"] =""
        } else {

            if (Array.isArray(req.body.permission[''])) {
                params["permission"] = req.body.permission[''];
            } else {
                params["permission"] = [req.body.permission['']];
            }
        }

        params["name"] = req.body.name.trim();
        params["_id"] = req.body._id.trim();

        params["role"] = req.body.role.trim();
        params["email"] = req.body.email;
        const resp = await myusersFunction.edit(params);

        if (resp.success) {
            return res.send({success: true});
        } else {
            return res.send({
                success: false,
                message: resp.message
            });
        }
    } catch (err) {
        return next(ec.appError({
            status: ec.UNKNOWN_ERROR,
            message: err.message
        }));
    }
    
},

// manage users

manageUsers: async function (req, res, next) {

    let data = [];

    let userList = await userslist.getAllUsers();

    // if (fetchUsersData && fetchUsersData.data) {
    //     data = fetchUsersData.data
    // }

    return res.render("cms/users/manage-myusers.ejs", {
        data: data,
        moment
    });
},

// delete users

deleteUsers: async function (req, res, next) {

    try {

        if (!req.params || !req.params.id) {

            return next(ec.appError({
                status: ec.INVALID_PARAM,
                message: 'Invalid params'
            }));
            
        };

        const resp = await myusersFunction.delete({id: req.params.id});

        if (resp.success) {
            return res.send({success: true});
        } else {
            return res.send({
                success: false,
                message: resp.message
            });
        }

    } catch (err) {
        console.log(err);
        return next(ec.appError({
            status: ec.UNKNOWN_ERROR,
            message: err.message
        }));   
    }
},

}

module.exports = usersObj;