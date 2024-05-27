"use strict";
// var request = require("request");
// var common = require("./common");
const moment = require("moment");
const needle = require("needle");
const fs = require("fs");
const { Validator } = require('node-input-validator');
const {forEach} = require('p-iteration');

const ec = require("../../../lib/error_consts");
const config = require("../../../config/config");
const validatorRules = require('../../../lib/validator_rules');

const { v4: uuidv4 } = require('uuid');


const views = {

    // uploadImagePost: async function (req, res, next) {

    //     if (!req.files) {
    //         res.status(401).json({error: 'Please provide an image'});
    //     }

    //     if (req.files) {

    //         const uploadRes = await uploadFunctions.upload(req.files.image);

    //         return res.status(200).json({ url: process.env.CURRENT_URL + uploadRes.download_link });

    //     }
    // },

    index: async function(req, res, next) {

        // const contactus = await contactusFunctions.fetchTotalContactFormCount();
        // const enquiry = await enquiryFunctions.fetchTotalQiuckConnectionsCount();
        // const products = await productsFunctions.fetchTotalProductCount();
        // const dealers = await dealersFunctions.fetchTotalDealerCount();
        // console.log("contactus::",products);
        return res.render("cms/index.ejs", {
            // contactus: contactus?.data,
            // contactuscount: contactus?.count?.totalCount,
            // enquiry: enquiry?.data,
            // enquiries: enquiry?.count?.totalCount,
            // products: products?.count?.totalCount,
            // totaltile: products?.count?.totalCountTiles,
            // totalbathware: products?.count?.totalCountBathware,
            // newLaunch: products?.count?.totalCountNewLaunch,
            // dealers: dealers?.count?.totalCount,
            moment
        });
    },


};

module.exports = views;