'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const usersModel = require('../../model/admin');
const { json } = require('body-parser');
var md5 = require('md5');

module.exports = function(app) {

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        function(req, email, password, done) {

            if(req.path.includes("dealer")) {
                // customerDealerModel.find({email: email.toLowerCase()}, function(err, result) {
                //     if(result.length < 1) {
                //         done(null, false, { message: 'Invalid Email' })
                //     }

                //     bcrypt.compare(password, result[0].password, function(err, authorised) {
                //         if(authorised) {
                //             const user = {
                //                 id: result[0]._id,
                //                 firstName: result[0].firstName,
                //                 lastName: result[0].lastName,
                //                 email: result[0].email,
                //                 phone: result[0].phone,
                //                 state: result[0].state,
                //                 city: result[0].city,
                //                 status: result[0].status,
                //                 newsletterCheck: result[0].newsletterCheck
                //             };
    
                //             done(null, user);
                        
                //         } else {
                //             done(null, false, { message: "Invalid Password" })
                //         }
                //     });
                // })




            } else {
                usersModel.findByEmail(email, function(result, err) {
                    //console.log("login test",result)
                    if (err) {
                        console.log(JSON.stringify(err))
                       // console.log(new Error("DB Error :: " + err));
                        done(null, false, { message: 'DB Error' });
                    }

                    if (!result || !result.length) {
                        done(null, false, { message: 'Invalid Email' });
                    } else {
                    	result = result[0];

                        //bcrypt.compare(md5(password), result.pass, function(err, authorised) {
                            if(md5(password)==result.pass){
                                const user = {
                                        id: result.id,
                                        email: result.email,
                                        roles: result.roles,
                                        // name: result.name,
                                        // permissions: result.permissions || []
                                    };
                                    console.log("test user",user)
    
                                    done(null, user);

                            } else {

                                done(null, false, { message: 'Invalid Password' });
                            } 
                            //console.log(err," authorised ",authorised)
                          

                            // if (authorised) {

                            //     const user = {
                            //         id: result._id,
                            //         email: result.email,
                            //         roles: result.roles,
                            //         // name: result.name,
                            //         // permissions: result.permissions || []
                            //     };
                            //     console.log("test user",user)

                            //     done(null, user);

                            // } else {

                            //     done(null, false, { message: 'Invalid Password' });
                            // }                        
                        //};
                    }
                });
            }
        })
    );
};