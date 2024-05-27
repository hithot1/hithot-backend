"use strict";

const cronjobFunctions = require("../../functions/cronJob/index.js");

const cronjobObj = {
  autoLike: async function (req, res, next) {
    const add_data = await cronjobFunctions.autoLike(req.body, res, next);
    return res.json(add_data);
  },

  deleteSaveVideo: async function (req, res, next) {
    const add_data = await cronjobFunctions.deleteSaveVideo(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
};

module.exports = cronjobObj;
