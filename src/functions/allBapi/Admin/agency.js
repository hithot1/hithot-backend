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

getAllAgency = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * from agency  " +
          qq +
          " order by id ASC limit " +
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
  
  getAllAgencyCount = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT count(id) as count from agency " + qq + "",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };

  getAllUserAgency = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select CONCAT(first_name , ' ', last_name) as name,id, fb_id,first_name,last_name,username,email,phone,location,verified,gender,profile_pic,block,version,device,signup_type,created,marked,clipUpload from users where agency_id!='0' " +
          qq +
          " order by agency_id ASC LIMIT " +
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
  
selectUserfbIdAgency = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select fb_id from users where agency_id!='0' " + qq + "",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
  selectCountFb = (fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(fb_id) as vid_count from videos where fb_id='" +
          fb_id +
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
  selectAgency = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT id,fb_id, agencyName, country, profile_pic FROM `agency`",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };

  
selectAgencyANDuser = (fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT a.id,a.fb_id, a.agencyName, a.country, a.profile_pic FROM agency a, users u where a.id=u.agency_id and u.fb_id='" +
          fb_id +
          "' LIMIT 1",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
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
const Agencyfunction={
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
    getadminAgency: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let qq = "";
          let type = req.data.type;
          let search = req.data.search ? pool.escape(req.data.search) : "";
          if (type == "agencyName") {
            if (search != "") {
              qq = ' where  agencyName like "%" ' + search + ' "%"';
            }
          }
          if (type == "country") {
            if (search != "") {
              qq = ' where  country like "%" ' + search + ' "%"';
            }
          }
          if (type == "addedon") {
            if (search != "") {
              qq = ' where  created like "%" ' + search + ' "%"';
            }
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
    
          let query = await getAllAgency(qq, offset, limit);
          let queryCount = await getAllAgencyCount(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
          let array_out1 = [];
          for (i = 0; i < query.length; i++) {
            let row = query[i];
            let get_data = {
              id: row.id,
              fb_id: row.fb_id,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              agencyName: row.agencyName,
              created: row.created,
              country: row.country,
            };
            array_out1.push(get_data);
          }
    
          let output = {
            code: "200",
            msg: array_out1,
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
      All_Users_Agency: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let type = req.data.type;
          let qq = "";
          let search = req.data.search ? pool.escape(req.data.search) : "";
          if (type == "fb_id") {
            if (search != "") {
              qq = ' AND  fb_id like "%" ' + search + ' "%"';
            }
          }
          if (type == "username") {
            if (search != "") {
              qq = ' AND  username like "%" ' + search + ' "%"';
            }
          }
          if (type == "name") {
            if (search != "") {
              qq =
                ' AND  CONCAT(first_name, " ", last_name) like "%" ' +
                search +
                ' "%"';
            }
          }
          if (type == "location") {
            if (search != "") {
              qq = ' AND  location like "%" ' + search + ' "%"';
            }
          }
          if (type == "phone") {
            if (search != "") {
              qq = ' AND  phone like "%" ' + search + ' "%"';
            }
          }
          if (type == "device") {
            if (search != "") {
              qq = ' AND  device like "%" ' + search + ' "%"';
            }
          }
          if (type == "addedon") {
            if (search != "") {
              qq = ' AND  created like "%" ' + search + ' "%"';
            }
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
    
          let query = await getAllUserAgency(qq, offset, limit);
    
          let queryCount = await selectUserfbIdAgency(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount.length / limit) : 0;
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let resVidCount = await selectCountFb(row.fb_id);
    
            let agencyId = row.agency_id;
            let agencyName = "-";
            let AgAr = [];
            if (agencyId == "0") {
              AgAr = await selectAgency();
            } else {
              let query001 = await selectAgencyANDuser(row.fb_id);
              if (query001.length > 0) {
                let r001 = query001[0];
                agencyName = r001.agencyName;
              } else {
                AgAr = await selectAgency();
              }
            }
            let get_data = {
              fb_id: row.fb_id,
              video_count: resVidCount.length > 0 ? resVidCount[0].vid_count : 0,
              username: "@" + row.username,
              verified: row.verified,
              id: row.id,
              name: row.name,
              first_name: row.first_name,
              last_name: row.last_name,
              gender: row.gender,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              block: row.block,
              version: row.version,
              location: row.location,
              device: row.device,
              signup_type: row.signup_type,
              created: row.created,
              marked: row.marked,
              agencyList: AgAr,
              agencyName: agencyName,
            };
            array_out.push(get_data);
          }
          let output = {
            code: "200",
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      getAgency: async function (req, res, next) {
        try {
          let query = await sequelize.query(
            "SELECT id,fb_id, agencyName, country, profile_pic FROM `agency`",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let output = {
            code: "200",
            msg: query,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
      createAgency: async function (req, res, next) {
        try {
          let fb_id = "-";
          let agencyName =
            req.body.agencyName.charAt(0).toUpperCase() +
            req.body.agencyName.substring(1);
          let country =
            req.body.country.charAt(0).toUpperCase() +
            req.body.country.substring(1);
          let dirName = moment().format("MMMMYYYY");
    
          let newPath = "UpLoad/UpLoad/" + dirName;
          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, {
              recursive: true,
            });
          }
    
          if (!fs.existsSync(newPath + "/agency")) {
            fs.mkdirSync(newPath + "/agency", {
              recursive: true,
            });
          }
    
          let created = moment().format("YYYY-MM-DD HH:mm:ss");
    
          if (typeof req.files.image !== "undefined") {
            let portfolio = req.files.image;
            let uploadPortfolio =
              newPath + "/agency/" + Date.now() + "_" + uuidv4() + portfolio.name;
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
    
                let qrry_1 =
                  "insert into agency(fb_id,agencyName, country,profile_pic,created)values(";
                qrry_1 += "" + pool.escape(fb_id) + ",";
                qrry_1 += "" + pool.escape(agencyName) + ",";
                qrry_1 += "" + pool.escape(country) + ",";
                qrry_1 += "" + pool.escape(uploadPortfolio) + ",";
                qrry_1 += "'" + created + "'";
                qrry_1 += ")";
                await reqInsertTimeEventLiveData(qrry_1);
    
                let output = {
                  code: "200",
                  msg: "Agency Created successfully",
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
      getAllAgencyAndClipUploader: async function (req, res, next) {
        try {
          let totalAgency =
            "select count(fb_id) as count  from users where agency_id!='0'";
          const totalAgencyCount = await sequelize.query(`${totalAgency}`, {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          });
    
          let totalClipUploder =
            "select count(fb_id) as count  from users where clipUpload='Yes'";
          const totalClipUploderCount = await sequelize.query(
            `${totalClipUploder}`,
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
    
          let output = {
            code: "200",
            totalAgency: totalAgencyCount.count,
            totalClipUploder: totalClipUploderCount.count,
          };
    
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      removeAgency: async function (req, res, next) {
        try {
          let id = req.id;
          let deletes = "DELETE FROM agency where id ='" + id + "'";
          await reqInsertTimeEventLiveData(deletes);
          let output = {
            code: "200",
            msg: "Agency Removed Successfully.",
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
      getAllAgencyInfo_: async function (req, res, next) {
        try {
          let qq = "";
          let search = "";
          if (typeof req.search !== "undefined") {
            search = pool.escape(req.search);
            if (search == "") {
              qq = "  order by id ASC LIMIT 100";
            } else {
              qq =
                ' WHERE  agencyName like "%" ' +
                search +
                ' "%" order by id ASC LIMIT 150';
            }
          } else {
            qq = "  order by id ASC LIMIT 100";
          }
    
          let query = await sequelize.query(
            "SELECT id,agencyName,country FROM `agency` " + qq + " ",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let output = {
            code: "200",
            msg: query,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
    
}

module.exports=Agencyfunction