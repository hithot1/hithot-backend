//apiRouter.js
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
// const apiRouter = express.Router();
var moment = require("moment"); // require
const { v4: uuidv4 } = require("uuid");
// const S3 = require("aws-sdk/clients/s3");
var ffmpeg = require("ffmpeg");
var ffmegPath = require("@ffmpeg-installer/ffmpeg").path;
var ffprobePath = require("@ffprobe-installer/ffprobe").path;
var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmegPath);
ffmpeg.setFfprobePath(ffprobePath);
var md5 = require("md5");
const axios = require("axios");
const tokenService = require("../TokenService");
var request = require("request"); // include request module
const {
  uploadToS3,
  getFromS3,
  checkFileExistS3,
  deleteFileFroms3,
  getListS3,
} = require("../Uploads3");
const jwt_decode = require("jwt-decode");
const Sequelize = require("sequelize");
const sequelize = require("../../../database/connection");
var striptags = require("striptags");
let API_path =
  process.env.media_storage == "s3"
    ? process.env.S3_path
    : process.env.API_path;
const {
  uploadFileToFTP,
  CreateDirectoryToFTP,
  downloadFileFromFTP,
} = require("../../config/ftp-connection");
var agora = require("agora-token");
const RtcTokenBuilder =
  require("../../lib/Tools-master/DynamicKey/AgoraDynamicKey/nodejs/src/RtcTokenBuilder").RtcTokenBuilder;
const RtcRole =
  require("../../lib/Tools-master/DynamicKey/AgoraDynamicKey/nodejs/src/RtcTokenBuilder").Role;

// const accessKeyId = "AKIAQCNXI6MVLD5A5J32";
// const secretAccessKey = "DemM8IbJErFCHfk7JDxflxl";

// const s3 = new S3({
//   accessKeyId,
//   secretAccessKey,
// });

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());

const mysql = require("mysql");
const { lastIndexOf } = require("underscore");

const { sendNodeEmailFuc } = require("../../config/nodemail.cofig");

const pool = mysql.createPool({
  connectionLimit: 20,
  password: process.env.MYSQL_PWD,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  charset: "latin1_swedish_ci",
  timezone: "Asia/Kolkata",
});

var crypto = require("crypto");
var unirest = require("unirest");

// const req_enc_key = "A4476C2062FFA58980DC8F79EB6A799E";
// const req_salt = "KEY123657234";
// const res_dec_key = "75AEF0FA1B94B3C10D4F5B268F757F11";
// const res_salt = "KEYRESP123657234";

// const merchId = "317157";
// const merchPass = "Test@123";
// const prodId = "NSE";
// const Authurl = "https://caller.atomtech.in/ots/payment/status";

// ** live ** //
const req_enc_key = "663DE3902AE334C08EC272A4604AB2A9";
const req_salt = "aa384b302747157a1e";
const res_dec_key = "396469B272B34238AF8278F7CD372CA8";
const res_salt = "4fb67b25326f58ece0";

const merchId = "433432";
const merchPass = "04d5aa67";
const Authurl = "https://payment1.atomtech.in/ots/payment/status";

const algorithm = "AES-256-CBC";
const password = Buffer.from(req_enc_key, "utf8");
const salt = Buffer.from(req_salt, "utf8");
const respassword = Buffer.from(res_dec_key, "utf8");
const ressalt = Buffer.from(res_salt, "utf8");
const iv = Buffer.from(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  "utf8"
);

const encrypt = (text) => {
  var derivedKey = crypto.pbkdf2Sync(password, password, 65536, 32, "sha512");
  const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${encrypted.toString("hex")}`;
};

const decrypt = (text) => {
  const encryptedText = Buffer.from(text, "hex");
  var derivedKey = crypto.pbkdf2Sync(
    respassword,
    respassword,
    65536,
    32,
    "sha512"
  );
  const decipher = crypto.createDecipheriv(algorithm, derivedKey, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

reqInsertTimeEventLiveData = (query) => {
    return new Promise((resolve, reject) => {
      pool.query(query, (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      });
    });
  };

  getAllBanner = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * from banner  " +
          qq +
          " order by orders ASC limit " +
          offset +
          ", " +
          limit +
          "",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
  
  getAllBannerCount = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT count(id) as count from banner " + qq + "",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
const Bannerfuntion={
    checkProfileURL: function (url) {
        // if(typeof banner[i].brand_id?.brandLogo!=='undefined'){
        if (url != "" && typeof url !== "undefined") {
          const regex = new RegExp("googleusercontent");
          let checkImageURL = regex.test(url);
          if (checkImageURL == true) {
            return url;
          } else {
            if (customerFunctions.startsWiths(url, "upload")) {
              return API_path + "UpLoad/" + url;
            } else if (customerFunctions.startsWiths(url, "UpLoad/Vidz")) {
              return API_path + "UpLoad/" + url;
            } else {
              return API_path + url;
            }
          }
        } else {
          return "null";
        }
      },
    addbanner: async function (req, res, next) {
        try {
          let link = req.body.link;
          let orders = req.body.orders;
    
          let newPath = "UpLoad/UpLoad/banner/";
          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, {
              recursive: true,
            });
          }
    
          if (typeof req.files.image !== "undefined") {
            let portfolio = req.files.image;
            let uploadPortfolio =
              newPath + Date.now() + "_" + uuidv4() + portfolio.name;
            portfolio.mv(uploadPortfolio, async function (err) {
              if (err) {
                let output = {
                  code: "201",
                  msg: "Something went wrong. please try again.",
                };
                res.status(200).json(output);
              } else {
                if (process.env.media_storage == "ftp") {
                  await CreateDirectoryToFTP(newPath);
                  await uploadFileToFTP(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
                let qrry_1 = "insert into banner(`image`,`orders`,`link`)values(";
                qrry_1 += "" + pool.escape(uploadPortfolio) + ",";
                qrry_1 += "'" + orders + "',";
                qrry_1 += "" + pool.escape(link) + "";
                qrry_1 += ")";
                await reqInsertTimeEventLiveData(qrry_1);
                let output = {
                  code: "200",
                  msg: "Banner Added successfully",
                };
                res.status(200).json(output);
              }
            });
          }
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
      editbanner: async function (req, res, next) {
        try {
          let link = req.body.link;
          let orders = req.body.orders;
          let id = req.body.id;
    
          let newPath = "UpLoad/UpLoad/banner/";
          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, {
              recursive: true,
            });
          }
    
          let update1 =
            "update banner SET orders =" +
            pool.escape(orders) +
            ", link =" +
            pool.escape(link) +
            " WHERE id ='" +
            id +
            "'";
          await reqInsertTimeEventLiveData(update1);
    
          if (typeof req.files.image !== "undefined") {
            let portfolio = req.files.image;
            let uploadPortfolio =
              newPath + Date.now() + "_" + uuidv4() + portfolio.name;
            portfolio.mv(uploadPortfolio, async function (err) {
              if (err) {
                let output = {
                  code: "201",
                  msg: "Something went wrong. please try again.",
                };
                res.status(200).json(output);
              } else {
                if (process.env.media_storage == "ftp") {
                  await CreateDirectoryToFTP(newPath);
                  await uploadFileToFTP(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
                let update =
                  "update banner SET image =" +
                  pool.escape(uploadPortfolio) +
                  " WHERE id ='" +
                  id +
                  "'";
                await reqInsertTimeEventLiveData(update);
                let output = {
                  code: "200",
                  msg: "Banner Update successfully",
                };
                res.status(200).json(output);
              }
            });
          } else {
            let output = {
              code: "200",
              msg: "Banner Update successfully",
            };
            res.status(200).json(output);
          }
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      removebanner: async function (req, res, next) {
        try {
          let id = req.id;
          let deletes = "DELETE FROM banner where id ='" + id + "'";
          await reqInsertTimeEventLiveData(deletes);
          let output = {
            code: "200",
            msg: "Banner Removed Successfully.",
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      orderBanner: async function (req, res, next) {
        try {
          let orders = req.orders;
          let id = req.id;
          let update =
            "UPDATE banner SET orders ='" + orders + "' WHERE id ='" + id + "'";
          await reqInsertTimeEventLiveData(update);
          let output = {
            code: "200",
            msg: "Banner Order Updated",
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      getadminBanner: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let qq = "";
          let search = req.data.search ? pool.escape(req.data.search) : "";
          if (search != "") {
            qq =
              ' where  (id like "%" ' +
              search +
              ' "%" OR link like "%" ' +
              search +
              ' "%")';
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
    
          let query = await getAllBanner(qq, offset, limit);
          let queryCount = await getAllBannerCount(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
          let array_out = [];
          for (i = 0; i < query.length; i++) {
            let row = query[i];
            let sub_array = {
              id: row.id,
              image: customerFunctions.checkProfileURL(row.image),
              orders: row.orders,
              link: row.link,
            };
            array_out.push(sub_array);
          }
    
          let output = {
            code: "200",
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length > 0 ? queryCount[0].count : 0,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
    
    
}

module.exports=Bannerfuntion