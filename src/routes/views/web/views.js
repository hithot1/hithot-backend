"use strict";
var request = require("request");
var common = require("./common.js");
var moment = require("moment");
var ec = require("../../../lib/error_consts");
var config = require("../../../config/config");
var needle = require("needle");
const fs = require("fs");


var views = {

    index: async function(req, res, next) {  
        var requestData = [            
          
        ];

        await Promise.all(requestData).then((data) => {
        //    console.log("data[10].data city",data[10])
            res.render('web/index.ejs', {
            
            });

        }).catch(err => {
            res.render('web/index.ejs', {
                response: 'error',
                msg: err
            });
        });
    },

    pageNotFound: function (req, res, next) {
        res.render('web/404.ejs')
    }

    
};

module.exports = views;