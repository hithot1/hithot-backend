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
adminUpdateUser_User = (columnId, fb_id, value) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE `users` SET `" +
          columnId +
          "` = '" +
          value +
          "' WHERE `fb_id` = '" +
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

  getAllMarkedUser = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select (select count(p.followed_fb_id) from follow_users p where a.fb_id = p.followed_fb_id) follow_count, (select count(v.fb_id) from videos v where a.fb_id = v.fb_id) vid_count, CONCAT(first_name , ' ', last_name) as name,fb_id,username,first_name,last_name,profile_pic,device,location,created from users a where marked='1' " +
          qq +
          " order by created DESC LIMIT " +
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
  
  getAllMarkedUserCount = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(fb_id) as TotalUser from users where marked='1' " + qq + "",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
  
  getAllAcceptDiamon = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select *,(select count(p.followed_fb_id) from follow_users p where a.fb_id = p.followed_fb_id) follow_count, (select count(v.fb_id) from videos v where a.fb_id = v.fb_id) vid_count, CONCAT(first_name , ' ', last_name) as name from users a where acceptdiamonds='1' " +
          qq +
          " order by created DESC LIMIT " +
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
  
  getAllAcceptDiamonCount = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(fb_id) as TotalUser from users where acceptdiamonds='1' " +
          qq +
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


  videoListByUser = (fb_id, offset, limit, qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select v.* from videos v, users u where  u.fb_id=v.fb_id and v.type='VIDEO' AND v.fb_id='" +
          fb_id +
          "' " +
          qq +
          " order by id DESC LIMIT " +
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
  
  videoListByUser1 = (fb_id, qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(*) as vid_count from videos v, users u where u.fb_id=v.fb_id and v.type='VIDEO' AND v.fb_id='" +
          fb_id +
          "' " +
          qq +
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

  
usersList = (fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select * from users where fb_id='" + fb_id + "'",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };

  selectSound = (sound_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select * from sound where id='" + sound_id + "'",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  }

  countLike1 = (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT count(*) as count from video_like_dislike where video_id='" +
          id +
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

  VideoComment = (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT count(*) as count from video_comment where video_id='" + id + "'",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
  videoLikeDislike1 = (id, fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT count(video_id) as count from video_like_dislike where video_id='" +
          id +
          "' and fb_id='" +
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

  selectUserfbId = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(fb_id) as TotalUser from users " + qq + "",
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

  getAllUserVerified = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select CONCAT(first_name , ' ', last_name) as name,id, fb_id,first_name,last_name,username,email,phone,location,verified,gender,profile_pic,block,version,device,signup_type,created,marked,clipUpload from users where verified='1' " +
          qq +
          " order by created DESC LIMIT " +
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

  selectUserfbIdVerified = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select fb_id from users where verified='1' " + qq + "",
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
  
  

const Usersfunction={
    checkFileExist: async function (dt, filePath) {
        let Folder = moment(moment(dt)).format("MMMMYYYY");
    
        if (process.env.media_storage == "s3") {
          return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;
        }
    
        if (process.env.media_storage == "local") {
          if (
            fs.existsSync(
              path.resolve("UpLoad/UpLoad/" + Folder + "/audio/" + filePath)
            )
          ) {
            return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;
          } else if (
            fs.existsSync(path.resolve("UpLoad/upload/audio/" + filePath))
          ) {
            return "UpLoad/upload/audio/" + filePath;
          } else if (
            fs.existsSync(path.resolve("UpLoad/UpLoad/vidz/audio/" + filePath))
          ) {
            return "UpLoad/UpLoad/vidz/audio/" + filePath;
          } else {
            return "";
          }
        }
        if (process.env.media_storage == "ftp") {
          return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;
        }
      },
      checkVideoUrl: function (url) {
        if (url != "" && typeof url !== "undefined") {
          if (customerFunctions.startsWiths(url, "upload")) {
            return API_path + "UpLoad/" + url;
          } else if (customerFunctions.startsWiths(url, "UpLoad/Vidz")) {
            return API_path + "UpLoad/" + url;
          } else {
            return API_path + url;
          }
        } else {
          return "null";
        }
    },
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
    
    adminUpdateUser: async function (req, res, next) {
        try {
          if (
            typeof req.columnId !== "undefined" &&
            typeof req.fb_id !== "undefined" &&
            typeof req.value !== "undefined"
          ) {
            let columnId = req.columnId;
            let fb_id = req.fb_id;
            let value = req.value;
            await adminUpdateUser_User(columnId, fb_id, value);
            let output = {
              code: "200",
              msg: "Updated Successfully",
            };
            res.status(200).json(output);
          } else {
            let output = {
              code: "201",
              msg: "Param missing",
            };
            res.status(200).json(output);
          }
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      admin_show_allMarkedUser: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let qq = "";
          let type = req.data.type;
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
          let query = await getAllMarkedUser(qq, offset, limit);
          let queryCount = await getAllMarkedUserCount(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].TotalUser / limit) : 0;
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let get_data = {
              fb_id: row.fb_id,
              video_count: row.vid_count,
              follow_count: row.follow_count,
              username: "@" + row.username,
              name: row.name,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              location: row.location,
              device: row.device,
              created: row.created,
            };
            array_out.push(get_data);
          }
    
          let output = {
            code: "200",
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length > 0 ? queryCount[0].TotalUser : 0,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      admin_show_allacceptdiamondsuser: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let qq = "";
          let search = req.data.search ? pool.escape(req.data.search) : "";
          if (search != "") {
            qq =
              ' AND  (fb_id like "%" ' +
              search +
              ' "%" OR username like "%" ' +
              search +
              ' "%" OR first_name like "%" ' +
              search +
              ' "%" OR last_name like "%" ' +
              search +
              ' "%" OR location like "%" ' +
              search +
              ' "%" OR device like "%" ' +
              search +
              ' "%" OR created like "%" ' +
              search +
              ' "%")';
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
          let query = await getAllAcceptDiamon(qq, offset, limit);
          let queryCount = await getAllAcceptDiamonCount(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].TotalUser / limit) : 0;
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let get_data = {
              fb_id: row.fb_id,
              video_count: row.vid_count,
              follow_count: row.follow_count,
              username: "@" + row.username,
              name: row.name,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              location: row.location,
              device: row.device,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            array_out.push(get_data);
          }
    
          let output = {
            code: "200",
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length > 0 ? queryCount[0].TotalUser : 0,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      admin_show_allVideos4User: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let type = req.data.type;
          let fb_id = req.data.fb_id;
          let qq = "";
          let search = req.data.search ? pool.escape(req.data.search) : "";
    
          if (type == "id") {
            if (search != "") {
              qq = ' AND  v.id like "%" ' + search + ' "%"';
            }
          }
          if (type == "username") {
            if (search != "") {
              qq = ' AND  u.username like "%" ' + search + ' "%"';
            }
          }
          if (type == "location") {
            if (search != "") {
              qq = ' AND  v.v_location like "%" ' + search + ' "%"';
            }
          }
          if (type == "description") {
            if (search != "") {
              qq = ' AND  v.description like "%" ' + search + ' "%"';
            }
          }
    
          if (type == "hashtag") {
            if (search != "") {
              qq = ' AND  v.description like "%" ' + search + ' "%"';
            }
          }
    
          if (type == "addedon") {
            if (search != "") {
              qq = ' AND  v.created like "%" ' + search + ' "%"';
            }
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
    
          let query = await videoListByUser(fb_id, offset, limit, qq);
          let queryCount = await videoListByUser1(fb_id, qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].vid_count / limit) : 0;
    
          let array_out = [];
          let UFbId = "";
          let UserName = "";
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
            let rd = await usersList(row.fb_id);
            let rd12 = await selectSound(row.sound_id);
            let countLikes_count = await countLike1(row.id);
            let countcomment_count = await VideoComment(row.id);
            let liked_count = await videoLikeDislike1(row.id, row.fb_id);
    
            UserName = "@" + rd[0].username;
            UFbId = rd[0].fb_id;
    
            let SoundObject = {
              id: rd12.length > 0 ? rd12[0].id : "",
              audio_path: {
                mp3:
                  rd12.length > 0
                    ? API_path +
                      (await customerFunctions.checkFileExist(
                        rd12[0].created,
                        rd12[0].id + ".mp3"
                      ))
                    : "",
                acc:
                  rd12.length > 0
                    ? API_path +
                      (await customerFunctions.checkFileExist(
                        rd12[0].created,
                        rd12[0].id + ".aac"
                      ))
                    : "",
              },
              sound_name: rd12.length > 0 ? rd12[0].sound_name : "",
              description: rd12.length > 0 ? rd12[0].description : "",
              thum: rd12.length > 0 ? rd12[0].thum : "",
              section: rd12.length > 0 ? rd12[0].section : "",
              created: rd12.length > 0 ? rd12[0].created : "",
            };
    
            let get_data = {
              id: row.id,
              fb_id: row.fb_id,
              agency_id: rd[0].fb_id,
    
              user_info: {
                first_name: rd[0].first_name,
                username: "@" + rd[0].username,
                username_: rd[0].username,
                verified: rd[0].verified,
                last_name: rd[0].last_name,
                profile_pic: customerFunctions.checkProfileURL(rd[0].profile_pic),
              },
              count: {
                like_count: countLikes_count[0].count,
                video_comment_count: countcomment_count[0].count,
              },
    
              liked: liked_count[0].count,
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
    
              v_location: row.v_location,
              fake_view: row.fake_view,
              fake_like: row.fake_like,
              for_you: row.for_you,
              type: row.type,
              section: row.section,
              marked: row.marked,
              description: row.description,
              for_you_mark: row.for_you_mark,
              sound: SoundObject,
              created: row.created,
            };
            array_out.push(get_data);
          }
          let output = {
            code: "200",
            UFbId: UFbId,
            UserName: UserName,
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length > 0 ? queryCount[0].vid_count : 0,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
    

      All_Users: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let type = req.data.type;
          let search = req.data.search ? pool.escape(req.data.search) : "";
          let qq = "";
    
          if (search != "") {
            if (type == "fb_id") {
              qq = ' where users.fb_id like "%" ' + search + ' "%"';
            }
            if (type == "username") {
              qq = ' where username like "%" ' + search + ' "%"';
            }
            if (type == "name") {
              qq =
                ' where first_name like "%" ' +
                search +
                ' "%" OR last_name like "%" ' +
                search +
                ' "%"';
            }
            if (type == "location") {
              qq = ' where location like "%" ' + search + ' "%"';
            }
            if (type == "phone") {
              qq = ' where phone like "%" ' + search + ' "%"';
            }
            if (type == "device") {
              qq = ' where device like "%" ' + search + ' "%"';
            }
            if (type == "addedon") {
              qq = ' where users.created like "%" ' + search + ' "%"';
            }
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
          // let query = await getAllUser(qq, offset, limit);
    
          let parameters =
            "SELECT (SELECT COUNT(p.followed_fb_id) FROM follow_users p WHERE users.fb_id = p.followed_fb_id) AS follow_count, (SELECT COUNT(v.fb_id) FROM videos v WHERE users.fb_id = v.fb_id) AS vid_count, CONCAT(first_name, ' ', last_name) AS name, users.*, agencyName FROM users LEFT JOIN agency ON users.agency_id = agency.id " +
            qq +
            " order by users.created DESC LIMIT " +
            offset +
            ", " +
            limit +
            "";
          const query = await sequelize.query(`${parameters}`, {
            type: sequelize.QueryTypes.SELECT,
          });
          let queryCount = await selectUserfbId(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].TotalUser / limit) : 0;
          let array_out = [];
          let AgAr = await selectAgency();
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let agencyName = row.agencyName != null ? row.agencyName : "-";
    
            let get_data = {
              fb_id: row.fb_id,
              id: row.id,
              name: row.name,
              username: "@" + row.username,
              gender: row.gender,
              email: row.email,
              phone: row.phone,
              agencyName: agencyName,
              video_count: row.vid_count,
              location: row.location,
              device: row.device,
              created: moment(row.created)
                .subtract(5, "hours")
                .subtract(45, "minutes")
                .format("YYYY-MM-DD HH:mm:ss"),
              clipUpload: row.clipUpload,
              follow_count: row.follow_count,
              block: row.block,
              marked: row.marked,
              agencyList: AgAr,
              acceptdiamonds: row.acceptdiamonds,
            };
            array_out.push(get_data);
          }
          let output = {
            code: "200",
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length > 0 ? queryCount[0].TotalUser : 0,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      getAllVerifiedDaysByMonth: async function (req, res, next) {
        try {
          let totalUser =
            "select count(fb_id) as count  from users where verified='1'";
          const totalUserCount = await sequelize.query(`${totalUser}`, {
            type: sequelize.QueryTypes.SELECT,
          });
    
          let parameters =
            "SELECT created as cc FROM ( SELECT MAKEDATE(YEAR(NOW()),1) + INTERVAL (MONTH(NOW())-1) MONTH + INTERVAL created DAY created FROM ( SELECT t*10+u created FROM (SELECT 0 t UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) A, (SELECT 0 u UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) B ORDER BY created ) users ) users WHERE MONTH(created) = MONTH(NOW()) AND YEAR(created) = YEAR(NOW()) order by created ASC";
          const records = await sequelize.query(`${parameters}`, {
            type: sequelize.QueryTypes.SELECT,
          });
    
          let array_out = [];
          let total = 0;
          for (const row of records) {
            let parameters1 =
              "select count(DATE(created)) as counted_leads  from users where  verified='1' AND DATE(created)='" +
              moment(row.cc).format("Y-MM-DD") +
              "'";
            const useers = await sequelize.query(`${parameters1}`, {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            });
            total = total + useers.counted_leads;
    
            let sub_array = {
              x: moment(row.cc).format("MMM Do YY"),
              y: useers.counted_leads,
            };
            array_out.push(sub_array);
          }
          const nf = new Intl.NumberFormat();
          let output = {
            code: "200",
            totalUser: nf.format(totalUserCount[0].count),
            total: nf.format(total),
            msg: array_out,
          };
    
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      getAllVerifiedMonthsByYear: async function (req, res, next) {
        try {
          const records = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ];
    
          let array_out = [];
          let total = 0;
          for (const row of records) {
            let parameters1 =
              "select count(MONTH(created)) as counted_leads  from users where verified='1' AND MONTH(created) = '" +
              row +
              "' AND YEAR(created) = YEAR(NOW())";
            const useers = await sequelize.query(`${parameters1}`, {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            });
            total = total + useers.counted_leads;
    
            let sub_array = {
              x: moment(moment().format("YYYY") + "-" + row).format("MMM YY"),
              y: useers.counted_leads,
            };
            array_out.push(sub_array);
          }
          const nf = new Intl.NumberFormat();
          let output = {
            code: "200",
            total: nf.format(total),
            msg: array_out,
          };
    
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
      All_VerifiedUsers: async function (req, res, next) {
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
    
          let query = await getAllUserVerified(qq, offset, limit);
    
          let queryCount = await selectUserfbIdVerified(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount.length / limit) : 0;
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let resVidCount = await selectCountFb(row.fb_id);
    
            let get_data = {
              fb_id: row.fb_id,
              name: row.name,
              video_count: resVidCount.length > 0 ? resVidCount[0].vid_count : 0,
              username: "@" + row.username,
              gender: row.gender,
              verified: row.verified,
              first_name: row.first_name,
              last_name: row.last_name,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              block: row.block,
              version: row.version,
              location: row.location,
              device: row.device,
              signup_type: row.signup_type,
              created: row.created,
              marked: row.marked,
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

      getAllUsersVideoAudio: async function (req, res, next) {
        try {
          let page = req.page;
          let type = req.type;
          let search = "";
          if (typeof req.search !== "undefined") {
            search = pool.escape(req.search);
          }
          let no_of_records_per_page = 100;
          let offset = (page - 1) * no_of_records_per_page;
          let qq = "";
          let query = [];
          let array_out = [];
    
          if (type == "_user") {
            if (search != "") {
              qq =
                ' where  (username like "%" ' +
                search +
                ' "%" OR first_name like "%" ' +
                search +
                ' "%" OR last_name like "%" ' +
                search +
                ' "%" OR email like "%" ' +
                search +
                ' "%" OR phone like "%" ' +
                search +
                ' "%")';
            }
    
            query = await sequelize.query(
              "select *,CONCAT(first_name , ' ', last_name) as name from users " +
                qq +
                " order by created DESC LIMIT " +
                offset +
                ", " +
                no_of_records_per_page,
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
    
            for (i = 0; i < query.length; i++) {
              let row = query[i];
              let str = row.name;
              let get_data = {
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                name: str.substr(0, 18),
                username: "@" + row.username,
                fb_id: row.fb_id,
              };
              array_out.push(get_data);
            }
          } else if (type == "_video") {
            if (search != "") {
              qq =
                ' AND  (u.username like "%" ' +
                search +
                ' "%" OR u.first_name like "%" ' +
                search +
                ' "%" OR u.last_name like "%" ' +
                search +
                ' "%" OR u.email like "%" ' +
                search +
                ' "%" OR u.phone like "%" ' +
                search +
                ' "%")';
            }
            query = await sequelize.query(
              "select v.*,u.username as name from videos v, users u where v.vtype='Short' and v.type='VIDEO' and u.fb_id=v.fb_id " +
                qq +
                "  order by v.id DESC LIMIT " +
                offset +
                ", " +
                no_of_records_per_page,
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
    
            for (i = 0; i < query.length; i++) {
              let row = query[i];
              let description = row.description;
              let get_data = {
                id: row.id,
                name: row.name,
                thum: customerFunctions.checkVideoUrl(row.thum),
                video: customerFunctions.checkVideoUrl(row.video),
                description: description != "" ? description.substr(0, 22) : "-",
              };
              array_out.push(get_data);
            }
          } else if (type == "_clip") {
            if (search != "") {
              qq =
                ' AND  (u.username like "%" ' +
                search +
                ' "%" OR u.first_name like "%" ' +
                search +
                ' "%" OR u.last_name like "%" ' +
                search +
                ' "%" OR u.email like "%" ' +
                search +
                ' "%" OR u.phone like "%" ' +
                search +
                ' "%")';
            }
            query = await sequelize.query(
              "select v.*,u.username as name from videos v, users u where v.vtype='Clip' and v.type='VIDEO' and u.fb_id=v.fb_id " +
                qq +
                "  order by v.id DESC LIMIT " +
                offset +
                ", " +
                no_of_records_per_page,
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
    
            for (i = 0; i < query.length; i++) {
              let row = query[i];
              let description = row.description;
              let get_data = {
                id: row.id,
                name: row.name,
                thum: customerFunctions.checkVideoUrl(row.thum),
                video: customerFunctions.checkVideoUrl(row.video),
                description: description != "" ? description.substr(0, 22) : "-",
              };
              array_out.push(get_data);
            }
          } else if (type == "_image") {
            if (search != "") {
              qq =
                ' AND  (u.username like "%" ' +
                search +
                ' "%" OR u.first_name like "%" ' +
                search +
                ' "%" OR u.last_name like "%" ' +
                search +
                ' "%" OR u.email like "%" ' +
                search +
                ' "%" OR u.phone like "%" ' +
                search +
                ' "%")';
            }
            query = await sequelize.query(
              "select v.*,u.username as name from videos v, users u where v.vtype='Image' and v.type='IMAGE' and u.fb_id=v.fb_id " +
                qq +
                "  order by v.id DESC LIMIT " +
                offset +
                ", " +
                no_of_records_per_page,
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
    
            for (i = 0; i < query.length; i++) {
              let row = query[i];
              let description = row.description;
              let get_data = {
                id: row.id,
                name: row.name,
                thum: customerFunctions.checkVideoUrl(row.thum),
                description: description != "" ? description.substr(0, 22) : "-",
              };
              array_out.push(get_data);
            }
          } else if (type == "_audio") {
            if (search != "") {
              qq =
                ' AND  (u.username like "%" ' +
                search +
                ' "%" OR u.first_name like "%" ' +
                search +
                ' "%" OR u.last_name like "%" ' +
                search +
                ' "%" OR u.email like "%" ' +
                search +
                ' "%" OR u.phone like "%" ' +
                search +
                ' "%")';
            }
            query = await sequelize.query(
              "select v.*,u.username as name from videos v, users u where v.type='AUDIO'  and u.fb_id=v.fb_id " +
                qq +
                " order by v.id DESC LIMIT " +
                offset +
                ", " +
                no_of_records_per_page,
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
    
            for (i = 0; i < query.length; i++) {
              let row = query[i];
              let get_data = {
                id: row.id,
                name: row.name,
                thum: customerFunctions.checkVideoUrl(row.thum),
                video: customerFunctions.checkVideoUrl(row.video),
              };
              array_out.push(get_data);
            }
          }
          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
      getAllUsersInfo_: async function (req, res, next) {
        try {
          let qq = "";
          let search = "";
          if (typeof req.search !== "undefined") {
            search = pool.escape(req.search);
            if (search == "") {
              qq = "  order by created DESC LIMIT 100";
            } else {
              qq =
                ' WHERE  username like "%" ' +
                search +
                ' "%" order by created DESC LIMIT 150';
            }
          } else {
            qq = "  order by created DESC LIMIT 100";
          }
    
          let query = await sequelize.query(
            "select fb_id,username,verified,first_name,last_name,tokon from users " +
              qq +
              " ",
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

      getAllUsersByDate: async function (req, res, next) {
        try {
          let parameters =
            "select (select count(p.followed_fb_id) from follow_users p where a.fb_id = p.followed_fb_id) follow_count, (select count(v.fb_id) from videos v where a.fb_id = v.fb_id) vid_count, CONCAT(first_name , ' ', last_name) as name,id, fb_id,first_name,last_name,username,email,phone,location,verified,gender,profile_pic,block,version,device,signup_type,created,marked,clipUpload,acceptdiamonds from users  a where DATE(a.created) BETWEEN '" +
            req.startDate +
            "' AND '" +
            req.endDate +
            "'";
          const query = await sequelize.query(`${parameters}`, {
            type: sequelize.QueryTypes.SELECT,
          });
          let array_out = [];
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
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
              name: row.name,
              video_count: row.vid_count,
              follow_count: row.follow_count,
              username: "@" + row.username,
              email: row.email,
              phone: row.phone,
              gender: row.gender,
              verified: row.verified,
              block: row.block,
              version: row.version,
              location: row.location,
              device: row.device,
              signup_type: row.signup_type,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
              marked: row.marked,
              clipUpload: row.clipUpload,
              agencyList: AgAr,
              agencyName: agencyName,
            };
            array_out.push(get_data);
          }
          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
      addfollowers: async function (req, res, next) {
        try {
          let followed_fb_id = req.fbid;
          let nff = req.nff;
          let user = "user";
          let qq =
            "email like '%" + user + "%' AND first_name NOT LIKE '%" + user + "%'";
    
          let res00 = await sequelize.query(
            "SELECT fb_id FROM users AS t1 JOIN (SELECT id FROM users where " +
              qq +
              " ORDER BY RAND() LIMIT " +
              nff +
              ") as t2 ON t1.id=t2.id",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
    
          for (i = 0; i < res00.length; i++) {
            let row = res00[i];
            let fb_id = row.fb_id;
    
            let cnt1 = await sequelize.query(
              "select count(*) as count from follow_users where fb_id ='" +
                fb_id +
                "' AND followed_fb_id='" +
                followed_fb_id +
                "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );
            if (cnt1.count == 0) {
              let qrry_1 =
                "insert into follow_users(`fb_id`,  `followed_fb_id`)values(";
              qrry_1 += "'" + fb_id + "',";
              qrry_1 += "'" + followed_fb_id + "'";
              qrry_1 += ")";
              await reqInsertTimeEventLiveData(qrry_1);
            }
          }
          let output = {
            code: "200",
            msg: "Followers added successfully",
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      getDiamondUserDashboard: async function (req, res, next) {
        try {
          let TotalCount = await sequelize.query(
            "SELECT count(*) as count FROM diamond where (category='Reward' OR  category='Video')",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
    
          let output = {
            code: "200",
            total: TotalCount.count,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
  
}


module.exports=Usersfunction