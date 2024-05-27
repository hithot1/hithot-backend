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
const { models } = require("mongoose");

videoListByShort = (offset, limit, qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.v_location, videos.for_you, videos.for_you_mark, videos.section, videos.fake_view, videos.fake_like, videos.description as vdescription, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.created as vcreated, " +
        "users.first_name, users.last_name, users.profile_pic, users.username, users.verified, users.subscriber, users.block, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
        "(SELECT COUNT(*) FROM videos WHERE users.fb_id = videos.fb_id) AS vid_count, (SELECT COUNT(*) FROM follow_users WHERE users.fb_id = follow_users.followed_fb_id) AS follow_count, COALESCE(sound.id, '') AS sid, " +
        "COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, COALESCE(sound.section, '') AS ssection, COALESCE(sound.created, '') AS screated " +
        "FROM videos JOIN users ON videos.fb_id = users.fb_id JOIN sound ON videos.sound_id = sound.id WHERE videos.vtype = 'Short' AND videos.type = 'VIDEO' " +
        qq +
        " ORDER BY videos.id DESC LIMIT " +
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

videoListByShort1 = (qq) => {
  //users u where u.fb_id=v.fb_id
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(*) as count from videos, users where users.fb_id = videos.fb_id AND videos.vtype='Short' AND videos.type='VIDEO' " +
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

videoListByForYouMark = (offset, limit, qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select v.* from videos v, users u where v.for_you_mark='1' AND u.fb_id=v.fb_id " +
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
  
  videoListByForYouMark1 = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(v.fb_id) as count from videos v, users u where v.for_you_mark='1' AND u.fb_id=v.fb_id " +
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

  videoListByForYou = (offset, limit, qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select v.* from videos v, users u where v.for_you='1' AND v.vtype='Short' AND u.fb_id=v.fb_id " +
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
  
  videoListByForYou1 = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select count(v.fb_id) as forYouCount from videos v, users u where v.for_you='1' AND v.vtype='Short' AND u.fb_id=v.fb_id " +
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

  singleVideo = (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select * from videos where id ='" + id + "'",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };

  tokenUser = (fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT tokon FROM `users` where fb_id='" + fb_id + "'",
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

  discover_section = (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "select * from discover_section where id='" + id + "' ",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };
  
  discover_section1 = () => {
    return new Promise((resolve, reject) => {
      pool.query("select * from discover_section", (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      });
    });
  };

  discover_section_list = (qq, offset, limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * from discover_section  " +
          qq +
          " order by id desc limit " +
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
  
  discover_section_list_count = (qq) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT count(id) as count from discover_section  " + qq + "",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(JSON.stringify(elements)));
        }
      );
    });
  };

  

  
const Shotsfunction = {
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

  
  admin_show_allVideos_new: async function (req, res, next) {
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
            qq = ' AND users.username L IKE "%" ' + search + ' "%"';
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
            qq = ' AND vcreated LIKE "%" ' + search + ' "%"';
          }
          break;
        default:
          break;
      }
      let limit = req.data.rowsPerPage;
      let offset = page * limit;
      let query = await videoListByShort(offset, limit, qq);
      let queryCount = await videoListByShort1(qq);
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
                  (await utilFunctions.checkFileExist(
                    moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
                    row.sid + ".mp3"
                  ))
                : "",
            acc:
              row.screated != ""
                ? API_path +
                  (await utilFunctions.checkFileExist(
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
            profile_pic: utilFunctions.checkProfileURL(row.profile_pic),
          },
          count: {
            like_count: parseInt(
              metaData_count.like_dislike_count + row.fake_like
            ),
            video_comment_count: parseInt(metaData_count.comment_count),
          },
          liked: parseInt(metaData_count.user_like_dislike_count),
          video: utilFunctions.checkVideoUrl(row.video),
          thum: utilFunctions.checkVideoUrl(row.thum),
          gif: utilFunctions.checkVideoUrl(row.gif),
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
          created: moment(row.vcreated).format("YYYY-MM-DD HH:mm:ss"),
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

  admin_show_allVideosExplore: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let type = req.data.type;
      let search = req.data.search ? pool.escape(req.data.search) : "";

      if (search != "") {
        if (type == "id") {
          qq = ' AND  videos.id like "%" ' + search + ' "%"';
        }
        if (type == "username") {
          qq = ' AND  username like "%" ' + search + ' "%"';
        }
        if (type == "location") {
          qq = ' AND  videos.v_location like "%" ' + search + ' "%"';
        }
        if (type == "description") {
          qq = ' AND  videos.description like "%" ' + search + ' "%"';
        }
        if (type == "hashtag") {
          qq = ' AND  videos.description like "%" ' + search + ' "%"';
        }
        if (type == "addedon") {
          qq = ' AND  videos.created like "%" ' + search + ' "%"';
        }
      }

      let limit = 20;
      let offset = page * limit;

      let query = await sequelize.query(
        "SELECT ve.id as veid, ve.video_id, ve.orderBy, videos.id, videos.fb_id, videos.type, videos.sound_id, videos.fake_like, videos.description, videos.marked AS vmarked, videos.video, videos.thum, videos.category AS vcategory, videos.created, " +
          "users.username, users.marked AS umarked, users.subscriber, users.block, " +
          "COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name FROM videos " +
          "JOIN users ON videos.fb_id = users.fb_id " +
          "LEFT JOIN sound ON sound.id = videos.sound_id " +
          "JOIN video_explore ve ON ve.video_id=videos.id " +
          "WHERE videos.vtype = 'Short'" +
          qq +
          " order by videos.id DESC LIMIT " +
          offset +
          ", " +
          limit +
          "",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let queryCount = await videoList1(qq);

      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;

      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let SoundObject = {
          id: row.sid,
          sound_name: row.sound_name,
        };

        let get_data = {
          id: row.id,
          veid: row.veid,
          orderBy: row.orderBy,
          fb_id: row.fb_id,
          user_info: {
            username: "@" + row.username,
          },
          video: customerFunctions.checkVideoUrl(row.video),
          thum: customerFunctions.checkVideoUrl(row.thum),
          type: row.type,
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
        total_number: queryCount.length > 0 ? queryCount[0].count : 0,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  admin_show_allVideosForYouMark: async function (req, res, next) {
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

      let query = await videoListByForYouMark(offset, limit, qq);
      let queryCount = await videoListByForYouMark1(qq);
      let countRec =
        queryCount.length > 0
          ? Math.ceil(queryCount[0].forYouCount / limit)
          : 0;
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
          video: customerFunctions.checkVideoUrl(row.video),
          thum: customerFunctions.checkVideoUrl(row.thum),
          gif: customerFunctions.checkVideoUrl(row.gif),

          fake_view: row.fake_view,
          fake_like: row.fake_like,
          type: row.type,
          for_you: row.for_you,
          for_you_mark: row.for_you_mark,
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
        total_number: queryCount.length > 0 ? queryCount[0].count : 0,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  admin_show_allVideosMark: async function (req, res, next) {
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

      let query = await videoListByVideosMark(offset, limit, qq);
      let queryCount = await videoListByVideosMark1(qq);
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
          video: customerFunctions.checkVideoUrl(row.video),
          thum: customerFunctions.checkVideoUrl(row.thum),
          gif: customerFunctions.checkVideoUrl(row.gif),

          fake_view: row.fake_view,
          fake_like: row.fake_like,
          vid_amount: row.vid_amount,
          type: row.type,
          for_you: row.for_you,
          for_you_mark: row.for_you_mark,
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
        total_number: queryCount.length > 0 ? queryCount[0].count : 0,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  admin_show_allVideosForYou: async function (req, res, next) {
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

      let query = await videoListByForYou(offset, limit, qq);
      let queryCount = await videoListByForYou1(qq);
      let countRec =
        queryCount.length > 0
          ? Math.ceil(queryCount[0].forYouCount / limit)
          : 0;
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

  AdminDeleteVideo: async function (req, res, next) {
    try {
      if (typeof req.id !== "undefined") {
        let id = req.id;
        let rd = await singleVideo(id);
        let rd10 = await tokenUser(rd.length > 0 ? rd[0].fb_id : "");
        let tokon = rd10[0].tokon;
        let videoPath = rd.length > 0 ? rd[0].video : "";
        let thumPath = rd.length > 0 ? rd[0].thum : "";
        let gifPath = rd.length > 0 ? rd[0].gif : "";

        rd.length > 0 ? await deleteFileFroms3(videoPath) : "";
        rd.length > 0 ? await deleteFileFroms3(thumPath) : "";
        rd.length > 0 ? await deleteFileFroms3(gifPath) : "";

        let deletes = "Delete from videos where id ='" + id + "'";
        await reqInsertTimeEventLiveData(deletes);

        let deletes1 =
          "Delete from video_like_dislike where video_id ='" + id + "'";
        await reqInsertTimeEventLiveData(deletes1);

        let deletes2 = "Delete from video_comment where video_id ='" + id + "'";
        await reqInsertTimeEventLiveData(deletes2);

        let notification = {
          to: tokon,
          data: {
            title: "Hithot",
            body: "Your video has been deleted by admin",
          },
        };
        let ss = await customerFunctions.sendPushNotificationToMobileDevice(
          notification
        );
        let output = {
          code: "200",
          msg: "Video Unlike",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: { response: "json parem missing" },
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addVideoAsMark: async function (req, res, next) {
    try {
      if (typeof req.vid !== "undefined") {
        let vid = req.vid;
        let update = "UPDATE videos set marked='1' where id='" + vid + "'";
        await reqInsertTimeEventLiveData(update);

        let output = {
          code: "200",
          msg: "Updated Successfully.",
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
  changeDiscriptionOfVideo: async function (req, res, next) {
    try {
      if (
        typeof req.id !== "undefined" &&
        typeof req.description !== "undefined"
      ) {
        let id = req.id;
        let description = req.description;

        let update =
          "update videos set description=" +
          pool.escape(description) +
          "  where id ='" +
          id +
          "' ";
        await reqInsertTimeEventLiveData(update);

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
  addVideointoDiscovery: async function (req, res, next) {
    try {
      if (
        typeof req.id !== "undefined" &&
        typeof req.section_name !== "undefined"
      ) {
        let id = req.id;
        let section_name = req.section_name;
        let dated = moment().format("YYYY-MM-DD HH:mm:ss");

        let update =
          "update videos set section=" +
          pool.escape(section_name) +
          ",section_date='" +
          dated +
          "'  where id ='" +
          id +
          "' ";
        await reqInsertTimeEventLiveData(update);

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

  all_discovery_sections: async function (req, res, next) {
    try {
      if (typeof req.id !== "undefined") {
        let id = req.id;

        let query = [];
        if (id != "") {
          query = await discover_section(id);
        } else {
          query = await discover_section1();
        }

        let array_out1 = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];
          let get_data = {
            id: row.id,
            section_name: row.section_name,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
          array_out1.push(get_data);
        }

        let output = {
          code: "200",
          msg: array_out1,
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

  add_discovery_Section: async function (req, res, next) {
    try {
      let sectionName = req.data.sectionName;
      let qrry_1 = "insert into discover_section(section_name,created)values(";
      qrry_1 += "" + pool.escape(sectionName) + ",";
      qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
      qrry_1 += ")";
      await reqInsertTimeEventLiveData(qrry_1);

      let output = {
        code: "200",
        msg: "Discovery Created successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  all_list_discovery_sections: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let search = req.data.search ? pool.escape(req.data.search) : "";
      if (search != "") {
        qq = ' where  (section_name like "%" ' + search + ' "%")';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let query = await discover_section_list(qq, offset, limit);
      let query2 = await discover_section_list_count(qq);
      let countRec = query2.length > 0 ? Math.ceil(query2[0].count / limit) : 0;

      let array_out1 = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];
        let get_data = {
          id: row.id,
          section_name: row.section_name,
          created: row.created,
        };
        array_out1.push(get_data);
      }

      let output = {
        code: "200",
        msg: array_out1,
        total_record: countRec,
        no_of_records_per_page: limit,
        total_number: query2.length > 0 ? query2[0].count : 0,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addForYou: async function (req, res, next) {
    try {
      if (typeof req.vid !== "undefined") {
        let vid = req.vid;
        let update = "UPDATE videos set for_you='1' where id='" + vid + "'";
        await reqInsertTimeEventLiveData(update);

        let deletes =
          "DELETE FROM  view_view_block  where video_id='" + vid + "'";
        await reqInsertTimeEventLiveData(deletes);

        let output = {
          code: "200",
          msg: "Added in trending.",
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

  addForYouMark: async function (req, res, next) {
    try {
      if (typeof req.vid !== "undefined") {
        let vid = req.vid;
        let update =
          "UPDATE videos set for_you_mark='1' where id='" + vid + "'";
        await reqInsertTimeEventLiveData(update);

        let deletes =
          "DELETE FROM  view_view_block  where video_id='" + vid + "'";
        await reqInsertTimeEventLiveData(deletes);

        let output = {
          code: "200",
          msg: "Added in trending mark.",
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

  removefromforyou: async function (req, res, next) {
    try {
      if (typeof req.vid !== "undefined") {
        let vid = req.vid;
        let update = "UPDATE videos set for_you='0' where id='" + vid + "'";
        await reqInsertTimeEventLiveData(update);
        let output = {
          code: "200",
          msg: "Removed from trending.",
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

  removefromforyouMark: async function (req, res, next) {
    try {
      if (typeof req.vid !== "undefined") {
        let vid = req.vid;
        let update =
          "UPDATE videos set for_you_mark='0' where id='" + vid + "'";
        await reqInsertTimeEventLiveData(update);
        let output = {
          code: "200",
          msg: "Removed from trending mark.",
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
  removevideofrommarked: async function (req, res, next) {
    try {
      if (typeof req.vid !== "undefined") {
        let vid = req.vid;
        let update = "UPDATE videos set marked='0' where id='" + vid + "'";
        await reqInsertTimeEventLiveData(update);
        let output = {
          code: "200",
          msg: "Removed from marked.",
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

  removefrommarked: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id;
        let update = "UPDATE users set marked='0' where fb_id='" + fb_id + "'";
        await reqInsertTimeEventLiveData(update);
        let output = {
          code: "200",
          msg: "Removed from marked.",
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

  removeVideoFromExplore: async function (req, res, next) {
    try {
      let id = req.id;
      let deletes = "DELETE FROM video_explore where id ='" + id + "'";
      await reqInsertTimeEventLiveData(deletes);
      let output = {
        code: "200",
        msg: "Video removed from Explore.",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addVideoToExplore: async function (req, res, next) {
    try {
      let vid = req.vid;

      let resss = await sequelize.query(
        "select count(*) as count from video_explore where video_id=" +
          vid +
          "",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );
      if (resss.count == "0") {
        let res1 = await sequelize.query("select * from video_explore", {
          type: sequelize.QueryTypes.SELECT,
        });
        if (res1.length >= 1500) {
          let res11 = await sequelize.query(
            "select * from video_explore order by id ASC limit 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let delId = res11[0].id;
          let deletes = "DELETE FROM video_explore where id ='" + delId + "'";
          await reqInsertTimeEventLiveData(deletes);
        }
        let res111 = await sequelize.query(
          "select * from video_explore order by id DESC limit 1",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let lastId = "1";
        if (res111.length > 0) {
          lastId = res111[0].id;
        }
        let dt = moment().format("YYYY-MM-DD HH:mm:ss");
        let qrry_1 =
          "insert into video_explore(`video_id`, `orderBy`, `created`)values(";
        qrry_1 += "'" + vid + "',";
        qrry_1 += "'" + lastId + "',";
        qrry_1 += "'" + dt + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);
        let deletess =
          "DELETE FROM view_view_block where video_id ='" + vid + "'";
        await reqInsertTimeEventLiveData(deletess);
        let output = {
          code: "200",
          msg: "Added in explore",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: "Already added to explore",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  removeSection: async function (req, res, next) {
    try {
      let id = req.id;
      let deletes = "DELETE FROM sound_section where id ='" + id + "'";
      await reqInsertTimeEventLiveData(deletes);
      let output = {
        code: "200",
        msg: "Section Removed Successfully.",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },



  
  sendPushNotificationToMobileDevice: async function (data) {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        "Content-Type": "application/json",
        authorization: "key=" + process.env.FIREBASE_KEY + "",
        "cache-control": "no-cache",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        // console.log(error);
      });
  },


  //===============CheckFIleExist =================//
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
};

module.exports = Shotsfunction;
