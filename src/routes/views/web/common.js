'use strict';

var request = require('request');
var _ = require('underscore');
var flatten = require('flat');
var ec = require('../../../lib/error_consts');

var common = {

    apiRequest: function(url, cookie, method, reqBody, reqFiles) {

        return new Promise((resolve, reject) => {

            if(!url){
                reject(ec.appError({
                    status: ec.INVALID_PARAM,
                    message: "No url recieved."
                }));
            }

            if(!cookie){
                reject(ec.appError({
                    status: ec.INVALID_PARAM,
                    message: "No cookie recieved."
                }));
            }

            if(!method){
                reject(ec.appError({
                    status: ec.INVALID_PARAM,
                    message: "No request method recieved."
                }));
            }

            var options = {
                method: method,
                url: url,
                gzip: true,
                headers: {
                    cookie: cookie,
                    'accept-encoding': "gzip, deflate, sdch",
                },
                formData: {}
            };

            if(reqBody && !_.isEmpty(reqBody)){
                options.formData = flatten(reqBody);
            }

            if(reqFiles && !_.isEmpty(reqFiles)){

                Object.keys(reqFiles).forEach(function(fileKey) {
                    
                    if(_.isArray(reqFiles[fileKey])){
                        options.formData[fileKey] = [];
                        for(var indx in reqFiles[fileKey]){
                            var optionsData = {
                                value: reqFiles[fileKey][indx].data,
                                options: {
                                   filename: reqFiles[fileKey][indx].name
                                }
                            }
                            options.formData[fileKey].push(optionsData);
                        }
                    } else {
                        options.formData[fileKey] = {
                            value: reqFiles[fileKey].data,
                            options: {
                               filename: reqFiles[fileKey].name
                            }
                        }
                    }
                });
            }

            var commonReq = request(options, function(err, res, body) {

                if (err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    if(res.statusCode > 900){
                        reject(ec.appError({
                            status: res.statusCode,
                            message: JSON.parse(res.body).error
                        }));
                    } else {
                        reject(ec.appError({
                            status: res.statusCode,
                            message: res.statusMessage
                        }));
                    }
                } else {
                    try {
                        resolve(JSON.parse(body));
                    } catch (bodyErr) {
                        reject(ec.appError({
                            status: res.statusCode,
                            message: 'Invalid response body.'
                        }));
                    }
                }
            });
        });
    }
}

module.exports = common;
