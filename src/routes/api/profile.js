"use strict";

const profileFunctions = require("../../functions/profile/profile.js");

const profileObj = {
  showUserInfo: async function (req, res, next) {
    const add_data = await profileFunctions.showUserInfo(req.body, res, next);
    return res.json(add_data);
  },
  getAllReferral: async function (req, res, next) {
    let result = {};
    const add_data = await profileFunctions.getAllReferral(req.body, res, next);
    return res.json(add_data);
  },
  allProfileVerification: async function (req, res, next) {
    let result = {};
    const add_data = await profileFunctions.allProfileVerification(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  manualReferral: async function (req, res, next) {
    const add_data = await profileFunctions.manualReferral(req.body, res, next);
    return add_data;
  },
};

module.exports = profileObj;
