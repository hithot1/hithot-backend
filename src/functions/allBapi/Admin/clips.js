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

  
allVideoClip = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select (select count(*) from follow_users p where v.fb_id = p.followed_fb_id) follow_count, (select count(fb_id) from videos f where v.fb_id = f.fb_id) vid_count, v.* from videos v, users u where  u.fb_id=v.fb_id  and v.vtype='Clip' AND v.type='VIDEO' " +
          qq +
          " order by id DESC limit " +
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
  
  allVideoClipCount = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(*) as vid_count from videos v, users u where u.fb_id=v.fb_id and v.vtype='Clip' AND v.type='VIDEO' " +
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
  };
  
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

  videoListByForYouClip = (offset, limit, qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select v.* from videos v, users u where v.for_you='1' AND v.vtype='Clip' AND u.fb_id=v.fb_id " +
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
  
  videoListByForYouClip1 = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(v.fb_id) as count from videos v, users u where v.for_you='1' AND v.vtype='Clip' AND u.fb_id=v.fb_id " +
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

  getAllUserClip = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select CONCAT(first_name , ' ', last_name) as name,id, fb_id,first_name,last_name,username,email,phone,location,verified,gender,profile_pic,block,version,device,signup_type,created,marked,clipUpload from users where clipUpload='Yes' " +
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

  
selectUserfbIdClip = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(fb_id) as user_count from users where clipUpload='Yes' " +
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
  
selectShortCountFb = (fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(fb_id) as short_count from videos where fb_id='" +
          fb_id +
          "' and vtype='Short'",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
  
  selectShortCountFb1 = (fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(fb_id) as clip_count from videos where fb_id='" +
          fb_id +
          "' and vtype='Clip'",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
  

  
  
const Clipsffunction={
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
    
    

    admin_show_allClip: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let type = req.data.type;
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
    
          if (type == "addedon") {
            if (search != "") {
              qq = ' AND  v.created like "%" ' + search + ' "%"';
            }
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
    
          let query = await allVideoClip(qq, offset, limit);
    
          let queryCount = await allVideoClipCount(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].vid_count / limit) : 0;
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let rd = await usersList(row.fb_id);
            let rd12 = await selectSound(row.sound_id);
            let countLikes_count = await countLike1(row.id);
            let countcomment_count = await VideoComment(row.id);
            let liked_count = await videoLikeDislike1(row.id, row.fb_id);
    
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
              agency_id: rd[0].agency_id,
              follow_count: row.follow_count,
              video_count: row.vid_count,
              user_info: {
                first_name: rd[0].first_name,
                username: "@" + rd[0].username,
                username_: rd[0].username,
                last_name: rd[0].last_name,
                verified: rd[0].verified,
                category: rd[0].category,
                marked: rd[0].marked,
                subscriber: rd[0].subscriber,
                block: rd[0].block,
                profile_pic: customerFunctions.checkProfileURL(rd[0].profile_pic),
              },
              count: {
                like_count: countLikes_count[0].count,
                video_comment_count: countcomment_count[0].count,
              },
              liked: liked_count[0].count,
              duration: row.duration,
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              v_location: row.v_location,
              fake_view: row.fake_view,
              fake_like: row.fake_like,
              for_you: row.for_you,
              vid_amount: row.vid_amount,
              type: row.type,
              section: row.section,
              marked: row.marked,
              description: row.description,
              for_you_mark: row.for_you_mark,
              allowDownload: row.allowDownload,
              sound: SoundObject,
              created: row.created,
            };
            array_out.push(get_data);
          }
          let output = {
            code: "200",
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

      admin_show_allVideosForYouClip: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let qq = "";
          let type = req.data.type;
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
    
          let query = await videoListByForYouClip(offset, limit, qq);
          let queryCount = await videoListByForYouClip1(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let rd = await usersList(row.fb_id);
            let rd12 = await selectSound(row.sound_id);
            let countLikes_count = await countLike1(row.id);
            let countcomment_count = await VideoComment(row.id);
            let liked_count = await videoLikeDislike1(row.id, row.fb_id);
    
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
    
              user_info: {
                first_name: rd[0].first_name,
                username: "@" + rd[0].username,
                verified: rd[0].verified,
                last_name: rd[0].last_name,
                profile_pic: customerFunctions.checkProfileURL(rd[0].profile_pic),
              },
              count: {
                like_count: countLikes_count ? countLikes_count[0].count : 0,
                video_comment_count: countcomment_count
                  ? countcomment_count[0].count
                  : 0,
              },
    
              liked: liked_count[0].count,
              video: await customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
    
              fake_view: row.fake_view,
              fake_like: row.fake_like,
              vid_amount: row.vid_amount,
              type: row.type,
              for_you: row.for_you,
              allowDownload: row.allowDownload,
              sound: SoundObject,
              created: row.created,
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

      All_Clip_Users: async function (req, res, next) {
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
    
          let query = await getAllUserClip(qq, offset, limit);
    
          let queryCount = await selectUserfbIdClip(qq);
          let countRec =
            queryCount.length > 0 ? Math.ceil(queryCount[0].user_count / limit) : 0;
          let array_out = [];
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
    
            let resVidCount = await selectShortCountFb(row.fb_id);
            let resClipCount = await selectShortCountFb1(row.fb_id);
    
            let get_data = {
              fb_id: row.fb_id,
              short_count: resVidCount[0].short_count,
              clip_count: resClipCount[0].clip_count,
              name: row.name,
              video_count: resVidCount.length,
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
            total_number: queryCount.length > 0 ? queryCount[0].user_count : 0,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
}
module.exports=Clipsffunction