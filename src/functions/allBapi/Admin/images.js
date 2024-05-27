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

videoListByImages = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.v_location, videos.for_you, videos.for_you_mark, videos.section, videos.fake_view, videos.fake_like, videos.description as vdescription, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.created, " +
          "users.first_name, users.last_name, users.profile_pic, users.username, users.verified, users.subscriber, users.block, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
          "(SELECT COUNT(*) FROM videos WHERE users.fb_id = videos.fb_id) AS vid_count, (SELECT COUNT(*) FROM follow_users WHERE users.fb_id = follow_users.followed_fb_id) AS follow_count, COALESCE(sound.id, '') AS sid, " +
          "COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, COALESCE(sound.section, '') AS ssection, COALESCE(sound.created, '') AS screated " +
          "FROM videos JOIN users ON videos.fb_id = users.fb_id JOIN sound ON videos.sound_id = sound.id WHERE videos.vtype = 'IMAGE' " +
          qq +
          " ORDER BY videos.created DESC LIMIT " +
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
  
  videoListByImages1 = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(videos.fb_id) as imageCount from videos, users where users.fb_id = videos.fb_id and videos.type='IMAGE' " +
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

  getVideoMetaData = (id, fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(DISTINCT CASE WHEN video_id = '" +
          id +
          "' THEN id END) AS like_dislike_count, (SELECT COUNT(*) FROM video_comment WHERE video_id = '" +
          id +
          "') AS comment_count, COUNT(CASE WHEN video_id = '" +
          id +
          "' AND fb_id = '" +
          fb_id +
          "' THEN id END) AS user_like_dislike_count FROM video_like_dislike WHERE video_id = '" +
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
  
const ImagesFunction={
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
    
    admin_show_allImages: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let qq = "";
          let type = req.data.type;
          let search = req.data.search ? pool.escape(req.data.search) : "";
    
          switch (type) {
            case "id":
              if (search !== "") {
                qq = ' AND videos.id LIKE "%" ' + search + ' "%"';
              }
              break;
            case "username":
              if (search !== "") {
                qq = ' AND users.username LIKE "%" ' + search + ' "%"';
              }
              break;
            case "location":
              if (search !== "") {
                qq = ' AND videos.v_location LIKE "%" ' + search + ' "%"';
              }
              break;
            case "description":
            case "hashtag":
              if (search !== "") {
                qq = ' AND videos.description LIKE "%" ' + search + ' "%"';
              }
              break;
            case "addedon":
              if (search !== "") {
                qq = ' AND videos.created LIKE "%" ' + search + ' "%"';
              }
              break;
            default:
              break;
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
    
          let query = await videoListByImages(qq, offset, limit);
    
          let queryCount = await videoListByImages1(qq);
    
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
    
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let metaData = await getVideoMetaData(row.id, row.fb_id);
            let metaData_count = metaData[0];
    
            let SoundObject = {
              id: row.sid,
              audio_path: {
                mp3:
                  row.screated != ""
                    ? API_path +
                      (await customerFunctions.checkFileExist(
                        moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
                        row.sid + ".mp3"
                      ))
                    : "",
                acc:
                  row.screated != ""
                    ? API_path +
                      (await customerFunctions.checkFileExist(
                        moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
                        row.sid + ".aac"
                      ))
                    : "",
              },
              sound_name: row.sound_name,
              description: row.sdescription,
              thum: row.sthum,
              section: row.ssection,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };
    
            let get_data = {
              id: row.id,
              fb_id: row.fb_id,
              agency_id: row.fb_id,
              follow_count: row.follow_count,
              video_count: row.vid_count,
              user_info: {
                first_name: row.first_name,
                last_name: row.last_name,
                username: "@" + row.username,
                username_: row.username,
                verified: row.verified,
                category: row.ucategory,
                marked: row.umarked,
                subscriber: row.subscriber,
                block: row.block,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
              },
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              v_location: row.v_location,
              fake_view: row.fake_view,
              fake_like: row.fake_like,
              type: row.type,
              marked: row.vmarked,
              description: row.vdescription,
              sound: SoundObject,
              for_you: row.for_you,
              section: row.section,
              for_you_mark: row.for_you_mark,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            array_out.push(get_data);
          }
    
          let output = {
            code: "200",
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length > 0 ? queryCount[0].count : 0,
            search: search,
            qq: qq,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },

      checkUserName: async function (req, res, next) {
        try {
          let username = req.username;
    
          let query = await sequelize.query(
            "select * from users where username =" +
              pool.escape(username) +
              "  limit 1",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
    
          if (query) {
            let output = {
              code: "200",
              msg: "Username found",
              fb_id: query.fb_id,
            };
            res.status(200).json(output);
          } else {
            let output = {
              code: "201",
              msg: "Username not found",
              fb_id: "",
            };
            res.status(200).json(output);
          }
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
    
    

}
module.exports=ImagesFunction