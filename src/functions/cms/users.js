//apiRouter.js

const express = require("express");
// const apiRouter = express.Router();

const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.MYSQL_PWD,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  charset: "latin1_swedish_ci",
  dateStrings: ["DATE", "DATETIME"],
  timezone: "utc",
});

fetchAllUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM `follow_users` limit 0,10", (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};

const usersFunctions = {
  // getAllUsers: async function(url)
  getAllUsers: async function (req, res, next) {
    try {
      userlist = await fetchAllUsers();
      res.status(200).json(userlist);
    } catch (e) {
      console.log(e); // console log the error so we can see it in the console
      // res.sendStatus(500);
    }
  },
};
module.exports = usersFunctions;
