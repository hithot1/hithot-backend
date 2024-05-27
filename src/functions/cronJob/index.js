//apiRouter.js

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
// const apiRouter = express.Router();
var moment = require("moment"); // require

let API_path =
  process.env.media_storage == "s3"
    ? process.env.S3_path
    : process.env.API_path;

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());

const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.MYSQL_PWD,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  charset: "latin1_swedish_ci",
  timezone: "utc",
});

getTimeQuery = (date, date1) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT v.* FROM videos v, users u where u.fb_id=v.fb_id and u.agency_id='0' and v.created BETWEEN '" +
        date +
        "' and '" +
        date1 +
        "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getTimeQuery2 = (date, date1) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT v.* FROM videos v, users u, agency a where a.id=u.agency_id AND u.fb_id=v.fb_id  and v.created BETWEEN '" +
        date +
        "' and '" +
        date1 +
        "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

const customerFunctions = {
  autoLike: async function (req, res, next) {
    try {
      let date = "";
      let date1 = "";
      let res = "";
      // ********* 10 minutes ********* //
      date = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours').add(15, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");

      date1 = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours').add(20, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");

      res = await getTimeQuery(date, date1);

      for (i = 0; i < res.length; i++) {
        let row = res[i];
        let id = row.id;
        let fl = "";
        if (row.vtype == "Image") {
          fl = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        } else {
          fl = Math.floor(Math.random() * (8 - 2 + 1) + 2);
        }
        let update =
          "UPDATE videos set fake_like='" + fl + "' where id='" + id + "'";
        await reqInsertTimeEventLiveData(update);
      }
      // ********* 15 minutes ********* //
      date = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours')
        .format("YYYY-MM-DD HH:mm:ss");
      date1 = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours').add(14, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      res = await getTimeQuery(date, date1);
      for (i = 0; i < res.length; i++) {
        let row = res[i];
        let id = row.id;
        let fl = "";
        if (row.vtype == "Image") {
          fl = Math.floor(Math.random() * (4 - 3 + 1) + 3);
        } else {
          fl = Math.floor(Math.random() * (19 - 9 + 1) + 9);
        }
        let update =
          "UPDATE videos set fake_like='" + fl + "' where id='" + id + "'";
        await reqInsertTimeEventLiveData(update);
      }
      // ********* 45 minutes ********* //
      date = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(4, 'hours').add(45, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      date1 = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(4, 'hours').add(59, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      res = await getTimeQuery(date, date1);
      for (i = 0; i < res.length; i++) {
        let row = res[i];
        let id = row.id;
        let fl = "";
        if (row.vtype == "Image") {
          fl = Math.floor(Math.random() * (6 - 5 + 1) + 5);
        } else {
          fl = Math.floor(Math.random() * (27 - 20 + 1) + 20);
        }
        let update =
          "UPDATE videos set fake_like='" + fl + "' where id='" + id + "'";
        await reqInsertTimeEventLiveData(update);
      }
      // ********* 60 minutes ********* //
      date = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(4, 'hours').add(30, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      date1 = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(4, 'hours').add(44, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      res = await getTimeQuery(date, date1);
      for (i = 0; i < res.length; i++) {
        let row = res[i];
        let id = row.id;
        let fl = "";
        if (row.vtype == "Image") {
          fl = Math.floor(Math.random() * (9 - 7 + 1) + 7);
        } else {
          fl = Math.floor(Math.random() * (34 - 28 + 1) + 28);
        }
        let update =
          "UPDATE videos set fake_like='" + fl + "' where id='" + id + "'";
        await reqInsertTimeEventLiveData(update);
      }
      // ********* FOR INFLUNCER ********* //
      // ********* 15 minutes ********* //
      date = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours').add(15, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      date1 = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours').add(20, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      res = await getTimeQuery2(date, date1);
      for (i = 0; i < res.length; i++) {
        let row = res[i];
        let id = row.id;
        let fl = "";
        if (row.vtype == "Image") {
          fl = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        } else {
          fl = Math.floor(Math.random() * (254 - 22 + 1) + 22);
        }
        let update =
          "UPDATE videos set fake_like='" + fl + "' where id='" + id + "'";
        await reqInsertTimeEventLiveData(update);
      }
      // ********* 30 minutes ********* //
      date = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours')
        .format("YYYY-MM-DD HH:mm:ss");
      date1 = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(5, 'hours').add(14, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      res = await getTimeQuery2(date, date1);
      for (i = 0; i < res.length; i++) {
        let row = res[i];
        let id = row.id;
        let fl = "";
        if (row.vtype == "Image") {
          fl = Math.floor(Math.random() * (7 - 4 + 1) + 4);
        } else {
          fl = Math.floor(Math.random() * (897 - 254 + 1) + 254);
        }
        let update =
          "UPDATE videos set fake_like='" + fl + "' where id='" + id + "'";
        await reqInsertTimeEventLiveData(update);
      }
      // ********* 45 minutes ********* //
      date = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(4, 'hours').add(45, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      date1 = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
        .add(4, 'hours').add(59, 'minutes')
        .format("YYYY-MM-DD HH:mm:ss");
      res = await getTimeQuery2(date, date1);
      for (i = 0; i < res.length; i++) {
        let row = res[i];
        let id = row.id;
        let fl = "";
        if (row.vtype == "Image") {
          fl = Math.floor(Math.random() * (25 - 8 + 1) + 8);
        } else {
          fl = Math.floor(Math.random() * (1925 - 898 + 1) + 898);
        }
        let update =
          "UPDATE videos set fake_like='" + fl + "' where id='" + id + "'";
        await reqInsertTimeEventLiveData(update);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  deleteSaveVideo: async function (req, res, next) {
    try {
      if (fs.existsSync("UpLoad/TMP")) {
        fs.rmSync("UpLoad/TMP", { recursive: true });
        fs.mkdirSync("UpLoad/TMP", {
          recursive: true,
        });
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
};
module.exports = customerFunctions;
