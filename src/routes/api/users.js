"use strict";

const profileFunctions = require("../../functions/cms/users");

const usersObj = {
  fetchuserlist: async function (req, res, next) {
    let result = {};
    const add_data = await profileFunctions.getAllUsers(req.body, res, next);
    return res.json(add_data);
  },
  // getAllReferral: async function (req, res, next) {
  //     let result={}
  //     const add_data = await profileFunctions.getAllReferral(req.body, res, next);
  //      console.log("add_data req",add_data)
  //      return res.json(add_data);
  // },
  // allProfileVerification: async function (req, res, next) {
  //     let result={}
  //     const add_data = await profileFunctions.allProfileVerification(req.body, res, next);
  //      console.log("add_data req",add_data)
  //      return res.json(add_data);
  // },
  // manualReferral: async function (req, res, next) {
  //     let result={}
  //     const add_data = await profileFunctions.manualReferral(req.body, res, next);
  //      console.log("add_data req",add_data)
  //      return res.json(add_data);
  // },
};

module.exports = usersObj;
