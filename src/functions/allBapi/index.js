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

getHeart = (id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "SELECT fake_like FROM videos WHERE id IN(" + id + ")",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        let s = 0;
        elements.forEach((element) => {
          s += element.fake_like;
        });
        return resolve(s);
      }
    );
  });
};

diamondThreshold = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT diamondThreshold FROM `setting` limit 1",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

refDiamond = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from diamond where ref_fb_id='" +
        fb_id +
        "' AND paymentstatus='1' ORDER BY `created`  DESC",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

refRewardDiamond = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from diamond where ref_fb_id='" +
        fb_id +
        "' AND category='Reward'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

convertedDiamond = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT sum(diamond) as cr, sum(convertedDiamond) as dr  FROM `diamond` WHERE ref_fb_id='" +
        fb_id +
        "' AND paymentstatus='1'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

shortList = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select v.*, ve.id as veid, ve.video_id, ve.orderBy from videos v, users u, video_explore ve where v.vtype='Short' AND ve.video_id=v.id AND u.fb_id=v.fb_id " +
        qq +
        " order by ve.orderBy, veid ASC LIMIT " +
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

shortCount = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(v.fb_id) as vid_count from videos v, users u, video_explore ve where v.vtype='Short' AND ve.video_id=v.id AND u.fb_id=v.fb_id " +
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

countLike = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(1) as count from video_like_dislike where video_id='" +
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

videoLikeDislike = (id, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(1) as count from video_like_dislike where video_id='" +
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

checkFollowStatus = (fbId, followingFbId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(fb_id) as count FROM follow_users  where fb_id='" +
        fbId +
        "' and followed_fb_id='" +
        followingFbId +
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

commentCount = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(1) as count from video_comment where video_id='" + id + "'",
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

timeEventLiveData = (archived_date, liveId, eventId, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE timeEventLiveData SET `state`='ARCHIVED',archived_date='" +
        archived_date +
        "' where liveId='" +
        liveId +
        "' AND eventId='" +
        eventId +
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

selectTimeEventLiveData = (eventId, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `timeEventLiveData` where fb_id='" +
        fb_id +
        "' and eventId='" +
        eventId +
        "' and state='LIVE'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

updateTimeEventLiveData = (tmp_date, liveId_) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE `timeEventLiveData` SET `archived_date` = '" +
        tmp_date +
        "', state='ARCHIVED' WHERE `liveId` = '" +
        liveId_ +
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

SelectWithoutLiveTimeEventLiveData = (eventId, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `timeEventLiveData` where eventId='" +
        eventId +
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

sumtimeEventLiveData = (eventId, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT sum((TO_SECONDS(archived_date ) - TO_SECONDS(join_date))) as spendTime FROM `timeEventLiveData` where eventId='" +
        eventId +
        "' and fb_id='" +
        fb_id +
        "' and state='ARCHIVED'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

updateTimeEventLiveData1 = (tmp_date, liveId, eventId, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE timeEventLiveData SET tmp_date='" +
        tmp_date +
        "' where liveId='" +
        liveId +
        "' AND eventId='" +
        eventId +
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

selectTimeEvent = (API_path) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, concat('" +
        API_path +
        "',image) as image,concat('" +
        API_path +
        "',profile_image) as profile_image  FROM `timeEvent` where `status`='ENABLED' LIMIT 1",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

timeEventJoin = (id, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `timeEventJoin` where eventId='" +
        id +
        "' and fb_id='" +
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

videosQueryList = (qq, array_out_count_heart) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from videos where  for_you='1' and vtype='Clip' " +
        qq +
        "  fb_id IN(" +
        array_out_count_heart +
        ") order by rand() limit 10",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};

timeEventJoin1 = (eventId, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from timeEventJoin where eventId='" +
        eventId +
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

videoList = (offset, limit, qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select v.*, ve.id as veid, ve.video_id, ve.orderBy from videos v, users u, video_explore ve where v.vtype='Short' AND ve.video_id=v.id AND u.fb_id=v.fb_id " +
        qq +
        " order by ve.orderBy ASC LIMIT " +
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

videoList1 = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(v.id) as count from videos v, users u, video_explore ve where v.vtype='Short' AND ve.video_id=v.id AND u.fb_id=v.fb_id " +
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

BankDetail = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from bank_detail where fb_id='" + fb_id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

wallet = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `wallet` where fb_id='" +
        fb_id +
        "' and `status`='PENDING'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

wallet1 = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `wallet` where fb_id='" + fb_id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

walletSum = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT sum(credit) as cr, sum(debit) as dr  FROM `wallet` WHERE fb_id='" +
        fb_id +
        "' AND `status`='APPROVE'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

wallet2 = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `wallet` where fb_id='" +
        fb_id +
        "' ORDER BY `created`  DESC",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

setting = () => {
  return new Promise((resolve, reject) => {
    pool.query("select * from setting", (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(JSON.parse(JSON.stringify(elements)));
    });
  });
};

cronTimeEvent = (currentDate) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `timeEvent` where (start_date <= '" +
        currentDate +
        "' and end_date>='" +
        currentDate +
        "') and status='DISABLED' Limit 1",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

cronUpdate = (id, status) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE timeEvent set status='" + status + "' where id='" + id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

cronUpdate1 = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE timeEvent set status='DISABLED' where id NOT IN ('" + id + "')",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

cronSelectTimeEvent = (currentDate) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `timeEvent` where end_date <= '" +
        currentDate +
        "' and status='ENABLED' Limit 1",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

liveTimeEventLiveData = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `timeEventLiveData` where state='LIVE'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

archiveTimeEventLiveData = (archivedDate, liveId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE timeEventLiveData set `state`='ARCHIVED' , archived_date='" +
        archivedDate +
        "' WHERE liveId='" +
        liveId +
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

updateUser = (type, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE `users` SET `category` = '" +
        type +
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

selectCreators = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from creators where fb_id='" + fb_id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

updatePortfolioAll = (type, portfolio, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE `creators` set   `" +
        type +
        "`='" +
        portfolio +
        "' where fb_id='" +
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

blockUsersList = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT block FROM `users` where fb_id='" + fb_id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

updateBankDetail = (type, picture, created, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE `bank_detail` set  " +
        type +
        " ='" +
        picture +
        "', created='" +
        created +
        "' where fb_id='" +
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

/* ------------------ FiHD Meta Function Start -------------- */

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

/* ------------------ FiHD Meta Function End -------------- */

updateBankDetail1 = (
  payment_mode,
  ac_name,
  ac_no,
  bank_name,
  ifsc_code,
  verified,
  fb_id
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE `bank_detail` set  `payment_mode`='" +
        payment_mode +
        "',  `ac_name`='" +
        ac_name +
        "', `ac_no`='" +
        ac_no +
        "', `bank_name` ='" +
        bank_name +
        "', `ifsc_code`='" +
        ifsc_code +
        "',verified='" +
        verified +
        "' where fb_id='" +
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

updateBankDetail2 = (payment_mode, upi, verified, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE `bank_detail` set  `payment_mode`='" +
        payment_mode +
        "', `upi`='" +
        upi +
        "',verified='" +
        verified +
        "' where fb_id='" +
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

settingThreshold = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT threshold FROM `setting` limit 1", (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(JSON.parse(JSON.stringify(elements)));
    });
  });
};

updateUserPhone = (mobile, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "update users set phone='" + mobile + "' where fb_id='" + fb_id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

updateUserPassword = (password, mobile) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "update users set password='" +
        password +
        "' where phone='" +
        mobile +
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

selectUserPhone = (mobile) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users where phone='" + mobile + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

selectUserPhone = (mobile) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users where phone='" + mobile + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getAllUser = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select CONCAT(first_name , ' ', last_name) as name,id, fb_id,first_name,last_name,username,email,phone,location,verified,gender,profile_pic,block,version,device,signup_type,created,marked,clipUpload,acceptdiamonds from users a " +
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

fetchUserFollow = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(*) as follow_count from follow_users where followed_fb_id='" +
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

storyView = (story_id, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from story_view where story_id='" +
        story_id +
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

selectStory = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT DISTINCT fb_id from story WHERE fb_id in (SELECT followed_fb_id FROM `follow_users` where fb_id='" +
        fb_id +
        "') and created > now() - interval 24 hour",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

selectStory1 = (fbId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * from story WHERE fb_id ='" +
        fbId +
        "' and created > now() - interval 24 hour",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

viewStoryWithFbId = (fb_id, id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * from story_view WHERE fb_id ='" +
        fb_id +
        "' and story_id='" +
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

userInfo = (fbId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT username, first_name, last_name,profile_pic FROM `users` where fb_id='" +
        fbId +
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

viweSingleStory = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * from story_view WHERE  story_id='" + id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

verificationRequest = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select fb_id from verification_request where fb_id!=''",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

verificationRequest1 = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select v.* from verification_request v, users u where v.fb_id!='' AND v.fb_id=u.fb_id " +
        qq +
        " order by v.created DESC LIMIT " +
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

verificationUser = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select first_name,last_name,profile_pic,username,verified from users where fb_id='" +
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

followedFbIid = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from follow_users where followed_fb_id='" +
        fb_id +
        "' order by id DESC limit 1000",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

followUsers = (fb_id, my_fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(*) as count from follow_users where followed_fb_id='" +
        fb_id +
        "' and fb_id='" +
        my_fb_id +
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

adminLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from admin where email='" +
        email +
        "' and pass='" +
        md5(password) +
        "' ",
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

searchVideo = (fb_id) => {
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

searchFollowUser = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(fb_id) as follow_count from follow_users where followed_fb_id='" +
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

updateUserClip = (fb_id, type) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users set clipUpload='" + type + "' where fb_id='" + fb_id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
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

videoListByVideosMark = (offset, limit, qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select v.* from videos v, users u where v.marked='1' AND u.fb_id=v.fb_id " +
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

videoListByVideosMark1 = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(v.fb_id) as count from videos v, users u where v.marked='1' AND u.fb_id=v.fb_id " +
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

getConvertedDiamond = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT u.username,w.id as ids, CONCAT(u.first_name , ' ', u.last_name) as name, u.email, u.phone, u.first_name, u.last_name, w.ref_fb_id,w.dated,w.created,w.paymentstatus, sum(w.diamond) as diamond, sum(w.convertedDiamond) as convertedDiamond FROM diamond w, users u where u.fb_id=w.ref_fb_id AND w.paymentstatus='1' " +
        qq +
        " GROUP by w.ref_fb_id order by w.id desc limit  " +
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

getConvertedDiamondCount = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT u.username, CONCAT(u.first_name , ' ', u.last_name) as name, u.first_name, u.last_name, w.ref_fb_id,w.dated,w.created,w.paymentstatus, sum(w.diamond) as diamond, sum(w.convertedDiamond) as convertedDiamond FROM diamond w, users u where u.fb_id=w.ref_fb_id  AND w.paymentstatus='1' " +
        qq +
        " GROUP by w.ref_fb_id order by w.id desc",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getUserdDiamond = (qq, fb_id, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `diamond` where ref_fb_id='" +
        fb_id +
        "' " +
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

getUserdDiamondCount = (qq, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(*) as count FROM `diamond` where ref_fb_id='" +
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

getAllKyc = (verified, qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT u.username, u.first_name, u.last_name, w.*  FROM bank_detail w, users u where u.fb_id=w.fb_id and w.verified='" +
        verified +
        "' " +
        qq +
        " order by w.id DESC LIMIT " +
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

getAllKycCount = (verified, qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(w.id) as count FROM bank_detail w, users u where u.fb_id=w.fb_id and w.verified='" +
        verified +
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

getCreator = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, (select count(*) from videos v where c.fb_id = v.fb_id) vid_count FROM creators c where id!='0' " +
        qq +
        " order by c.id DESC limit " +
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

getCreatorCount = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(id) as count FROM `creators` where id!='0' " +
        qq +
        "  order by id DESC ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getWithdraw = (verified, qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT w.*, CONCAT(u.first_name , ' ', u.last_name) as name, u.username, u.first_name, u.last_name FROM wallet w, users u where u.fb_id=w.fb_id and w.status='" +
        verified +
        "' AND w.debit>0 " +
        qq +
        " limit " +
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

getWithdrawCount = (verified, qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(w.id) as count FROM wallet w, users u where u.fb_id=w.fb_id and w.status='" +
        verified +
        "' AND w.debit>0 " +
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

getWalletList = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT u.username,w.id, CONCAT(u.first_name , ' ', u.last_name) as name, w.fb_id, sum(w.credit) as credit, sum(w.debit) as debit FROM wallet w, users u where u.fb_id=w.fb_id " +
        qq +
        " GROUP by w.fb_id limit " +
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

getWalletListCount = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(w.id) as count FROM wallet w, users u where u.fb_id=w.fb_id " +
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

getWalletUser = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT fb_id,username, first_name,last_name  FROM users where fb_id='" +
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

getWalletSingle = (fb_id, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `wallet` where fb_id='" +
        fb_id +
        "' order by id DESC limit " +
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

getWalletSingleCount = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(id) as count FROM `wallet` where fb_id='" + fb_id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
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

getUserCodeList = (qq) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(qq, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(JSON.parse(JSON.stringify(elements)));
    });
  });
};

referralUserList = (arstring) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(*) as count from users  WHERE referral in (" +
        arstring +
        ")  ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

referralUserListLimit = (arstring, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users WHERE referral in (" +
        arstring +
        ")  order by created desc limit " +
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

referralDetail = (referral) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select fb_id,code, username, profile_pic, first_name, last_name from users where code='" +
        referral +
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

getAllFeedback = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * from feedback  " +
        qq +
        " order by feed_id desc limit " +
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

getAllFeedbackCount = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(feed_id) as count from feedback  " + qq + "",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getAllContest = (qq, offset, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id, name, mobile, insta,hhid,type,on_date FROM `contest` " +
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

function mysql_real_escape_string(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
    }
  });
}

getAllContestCount = (qq) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(*) as count FROM `contest`  " + qq + "",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
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

getAllDays = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT created as cc FROM ( SELECT MAKEDATE(YEAR(NOW()),1) + INTERVAL (MONTH(NOW())-1) MONTH + INTERVAL created DAY created FROM ( SELECT t*10+u created FROM (SELECT 0 t UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) A, (SELECT 0 u UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) B ORDER BY created ) users ) users WHERE MONTH(created) = MONTH(NOW()) order by created ASC",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getAllUserCountByDay = (created) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(DATE(created)) as counted_leads from users where DATE(created)='" +
        created +
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

getBlockUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT fb_id  from users where block='1'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        let NOTIN = "";
        if (elements.length > 0) {
          let s = 1;
          let XX = "";

          for (i = 0; i < elements.length; i++) {
            let q = elements[i];
            if (s < elements.length) {
              XX += "'" + q.fb_id + "',";
            } else {
              XX += "'" + q.fb_id + "'";
            }
            s++;
          }
          NOTIN = XX;
        }
        return resolve(NOTIN);
      }
    );
  });
};

blockRepeatVideo = (deviceID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT video_id from view_view_block where device_id='" + deviceID + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        let NOTIN = "";
        if (elements.length > 0) {
          let s = 1;
          let XX = "";

          for (i = 0; i < elements.length; i++) {
            let q = elements[i];
            if (s < elements.length) {
              XX += "'" + q.video_id + "',";
            } else {
              XX += "'" + q.video_id + "'";
            }
            s++;
          }
          NOTIN = XX;
        }
        return resolve(NOTIN);
      }
    );
  });
};

const customerFunctions = {
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
  startsWiths: function (string, startString) {
    let len = startString.length;
    return string.substr(string, len) === startString;
  },

  checkFileExist: async function (dt, filePath) {
    let Folder = moment(moment(dt)).format("MMMMYYYY");

    if (process.env.media_storage == "s3") {
      return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;

      // if (
      //   await checkFileExistS3("UpLoad/UpLoad/" + Folder + "/audio/" + filePath)
      // ) {
      //   return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;
      // } else if (await checkFileExistS3("UpLoad/upload/audio/" + filePath)) {
      //   return "UpLoad/upload/audio/" + filePath;
      // } else if (
      //   await checkFileExistS3("UpLoad/UpLoad/vidz/audio/" + filePath)
      // ) {
      //   return "UpLoad/UpLoad/vidz/audio/" + filePath;
      // } else {
      //   return "";
      // }
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

    // let aws = url.indexOf("amazonaws");
    // let cloudfront = url.indexOf("cloudfront");
    // if (aws == true) {
    //   let replace = str_replace(
    //     "https://tictic-videos.s3.ap-south-1.amazonaws.com/",
    //     "http://d1eq4oei2752cy.cloudfront.net/",
    //     url
    //   );
    //   return replace;
    // } else {

    //   //return API_path."/".$url;
    //   //return API_path.$url;
    // }
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

  hoursandmins: async function (time) {
    if (time < 1) {
      return "";
    }
    var secs = time % 60;
    var hrs = time / 60;
    var mins = hrs % 60;
    var hrs = hrs / 60;
    return parseInt(hrs) + ":" + parseInt(mins) + ":" + parseInt(secs);
  },

  getYourDiamond: async function (req, res, next) {
    try {
      let event_json = req;
      let query1 = await diamondThreshold();
      let threshold = query1[0].diamondThreshold;

      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = req.fb_id;
        let query2 = await refDiamond(fb_id);

        let array_outH = [];

        if (query2.length > 0) {
          for (i = 0; i < query2.length; i++) {
            let row1 = query2[i];

            let get_data = {
              ref_fb_id: row1.ref_fb_id,
              fb_id: row1.fb_id,
              video_id: row1.video_id,
              category: row1.category,
              diamond: row1.diamond,
              convertedDiamond: row1.convertedDiamond,
              description: row1.description,
              date: row1.dated,
              created: moment(row1.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            array_outH.push(get_data);
          }
        }

        let query3 = await convertedDiamond(fb_id);

        let tot = query3[0].cr - query3[0].dr;

        let output = {
          code: "200",
          diamondThreshold: threshold ? threshold : 0,
          diamond: query3[0].cr ? query3[0].cr : 0,
          convertedDiamond: query3[0].dr ? query3[0].dr : 0,
          diamondBalance: query3[0].cr ? tot : 0,
          msg: [{ response: "Data found on your diamond" }],
          history: array_outH,
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

  allVideosExploreNew: async function (req, res, next) {
    try {
      let event_json = req;

      let fb_id = event_json.fb_id;
      let page = event_json.page;
      let qq = "";

      let limit = 30;
      let offset = (page - 1) * limit;

      let query1 = await shortList(qq, offset, limit);

      let query2 = await shortCount(qq);
      let countRec = query2.length > 0 ? query2[0].vid_count : 0;

      let array_out = [];
      let pageSize = 0;

      for (i = 0; i < query1.length; i++) {
        let row1 = query1[i];
        let rd = await usersList(row1.fb_id);
        let rd12 = await selectSound(row1.sound_id);
        let countLikes_count = await countLike(row1.id);

        let countcomment_count = await commentCount(row1.id);

        let AR = row1.id;
        let countLikes_count_ = await getHeart(AR);

        let liked_count = await videoLikeDislike(row1.id, fb_id);

        let followStatus = await checkFollowStatus(fb_id, row1.fb_id);
        let fStatus = followStatus[0].count == 0 ? false : true;

        let SoundObject = {
          id: rd12.length > 0 ? rd12[0].id : "",
          audio_path: {
            mp3:
              rd12.length > 0
                ? API_path +
                  (await customerFunctions.checkFileExist(
                    moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss"),
                    rd12[0].id + ".mp3"
                  ))
                : "",
            acc:
              rd12.length > 0
                ? API_path +
                  (await customerFunctions.checkFileExist(
                    moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss"),
                    rd12[0].id + ".aac"
                  ))
                : "",
          },
          sound_name: rd12.length > 0 ? rd12[0].sound_name : "",
          description: rd12.length > 0 ? rd12[0].description : "",
          thum: rd12.length > 0 ? rd12[0].thum : "",
          section: rd12.length > 0 ? rd12[0].section : "",
          created:
            rd12.length > 0
              ? moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss")
              : "",
        };

        let get_data = {
          id: row1.id,
          veid: row1.veid,
          orderBy: row1.orderBy,
          fb_id: row1.fb_id,

          user_info: {
            fb_id: rd[0].fb_id,
            first_name: rd[0].first_name,
            last_name: rd[0].last_name,
            profile_pic: customerFunctions.checkProfileURL(rd[0].profile_pic),
            username: "@" + rd[0].username,
            verified: rd[0].verified,
            bio: rd[0].bio,
            gender: rd[0].gender,
            category: rd[0].category,
            marked: rd[0].marked,
          },
          count: {
            like_count: countLikes_count[0].count,
            video_comment_count: countcomment_count[0].count,
            view: row1.view + row1.fake_view,
          },
          followStatus: fStatus,
          liked: liked_count[0].count,
          video: customerFunctions.checkVideoUrl(row1.video),
          thum: customerFunctions.checkVideoUrl(row1.thum),
          gif: customerFunctions.checkVideoUrl(row1.gif),
          category: row1.category,
          description: row1.description,
          type: row1.type,
          marked: row1.marked,
          sound: SoundObject,
          created: moment(row1.created).format("YYYY-MM-DD HH:mm:ss"),
        };
        array_out.push(get_data);
        pageSize++;
      }

      let output = {
        code: "200",
        msg: array_out,
        total_record: countRec,
        no_of_records_per_page: pageSize,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  archivedLiveEventTime: async function (req, res, next) {
    try {
      if (
        typeof req.eventId !== "undefined" &&
        typeof req.fb_id !== "undefined" &&
        typeof req.liveId !== "undefined"
      ) {
        let eventId = req.eventId;
        let fb_id = req.fb_id;
        let liveId = req.liveId;
        let archived_date = moment().format("YYYY-MM-DD HH:mm:ss");
        let timeEventRes = await timeEventLiveData(
          archived_date,
          liveId,
          eventId,
          fb_id
        );

        if (timeEventRes) {
          let output = {
            code: "200",
            msg: "Live archived success",
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: "Something went wrong",
          };
          res.status(200).json(output);
        }
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

  updateUserCategory: async function (req, res, next) {
    try {
      let dtT = Date.now();
      let username = req.body.username;
      let fb_id = req.body.fb_id;
      let name = req.body.name;
      let mobile = req.body.mobile;
      let alternate_mobile = req.body.alternate_mobile;
      let insta = req.body.insta;
      let facebook = req.body.facebook;
      let youtube = req.body.youtube;
      let email = req.body.email;
      let type = req.body.type.toUpperCase();
      let other = req.body.other;
      let portfolio = "-";

      if (type == "USER") {
        await updateUser(type, fb_id);
        let output = {
          code: "200",
          message: "Data Saved",
        };
        res.status(200).json(output);
      } else {
        if (
          typeof req.files.portfolio1 !== "undefined" &&
          typeof req.files.portfolio2 !== "undefined" &&
          typeof req.files.portfolio3 !== "undefined"
        ) {
          let cnt001 = await selectCreators(fb_id);

          if (cnt001.length == 0) {
            let qrry_1 =
              "insert into creators(`fb_id`,  `username`, `name`, `mobile`, `alternate_mobile`, `insta`, `facebook`, `youtube`, `email`, `other`,`verified`,`created`)values(";
            qrry_1 += "" + pool.escape(fb_id) + ",";
            qrry_1 += "" + pool.escape(username) + ",";
            qrry_1 += "" + pool.escape(name) + ",";
            qrry_1 += "" + pool.escape(mobile) + ",";
            qrry_1 += "" + pool.escape(alternate_mobile) + ",";
            qrry_1 += "" + pool.escape(insta) + ",";
            qrry_1 += "" + pool.escape(facebook) + ",";
            qrry_1 += "" + pool.escape(youtube) + ",";
            qrry_1 += "" + pool.escape(email) + ",";
            qrry_1 += "" + pool.escape(other) + ",";
            qrry_1 += "'1',";
            qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_1 += ")";
            await reqInsertTimeEventLiveData(qrry_1);
          } else {
            let update =
              "update creators SET username =" +
              pool.escape(username) +
              ",name =" +
              pool.escape(name) +
              ",mobile =" +
              pool.escape(mobile) +
              ",alternate_mobile =" +
              pool.escape(alternate_mobile) +
              ",insta =" +
              pool.escape(insta) +
              ",facebook =" +
              pool.escape(facebook) +
              ",youtube =" +
              pool.escape(youtube) +
              ",email =" +
              pool.escape(email) +
              ",other =" +
              pool.escape(other) +
              " WHERE fb_id ='" +
              fb_id +
              "'";
            await reqInsertTimeEventLiveData(update);
          }

          let newPath = "UpLoad/Vidz/bank/";

          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, {
              recursive: true,
            });
          }

          if (typeof req.files.portfolio1 !== "undefined") {
            let portfolio = req.files.portfolio1;

            let uploadPortfolio = newPath + dtT + portfolio.name;

            portfolio.mv(uploadPortfolio, async function (err, res) {
              if (err) {
              } else {
                await updatePortfolioAll(
                  "portfolio1",
                  newPath + dtT + portfolio.name,
                  fb_id
                );
                if (process.env.media_storage == "ftp") {
                  await CreateDirectoryToFTP(newPath);
                  await uploadFileToFTP(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
              }
            });
          }

          if (typeof req.files.portfolio2 !== "undefined") {
            let portfolio = req.files.portfolio2;
            let uploadPortfolio = newPath + dtT + portfolio.name;
            portfolio.mv(uploadPortfolio, async function (err, res) {
              if (err) {
              } else {
                await updatePortfolioAll(
                  "portfolio2",
                  newPath + dtT + portfolio.name,
                  fb_id
                );
                if (process.env.media_storage == "ftp") {
                  await CreateDirectoryToFTP(newPath);
                  await uploadFileToFTP(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
              }
            });
          }

          if (typeof req.files.portfolio3 !== "undefined") {
            let portfolio = req.files.portfolio3;
            let uploadPortfolio = newPath + dtT + portfolio.name;
            portfolio.mv(uploadPortfolio, async function (err, res) {
              if (err) {
              } else {
                await updatePortfolioAll(
                  "portfolio3",
                  newPath + dtT + portfolio.name,
                  fb_id
                );
                if (process.env.media_storage == "ftp") {
                  await CreateDirectoryToFTP(newPath);
                  await uploadFileToFTP(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }
              }
            });
          }

          await updateUser(type, fb_id);

          let output = {
            code: "200",
            message: "Data Saved",
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            message: "Please fillup all the details.",
          };
          res.status(200).json(output);
        }
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  diamondExchange: async function (req, res, next) {
    const ar = [
      { diamond: 100, rupee: 10 },
      { diamond: 500, rupee: 50 },
      { diamond: 1000, rupee: 100 },
      { diamond: 2000, rupee: 200 },
      { diamond: 2500, rupee: 250 },
      { diamond: 5000, rupee: 500 },
      { diamond: 10000, rupee: 1000 },
    ];

    let output = {
      code: "200",
      data: ar,
    };
    res.status(200).json(output);
  },

  ifParticipateThenStartLive: async function (req, res, next) {
    try {
      if (
        typeof req.eventId !== "undefined" &&
        typeof req.fb_id !== "undefined"
      ) {
        let eventId = req.eventId;
        let fb_id = req.fb_id;
        let resLiveData = await selectTimeEventLiveData(eventId, fb_id);

        for (i = 0; i < resLiveData.length; i++) {
          let row = resLiveData[i];
          let resLiveData = await updateTimeEventLiveData(
            row.tmp_date,
            row.liveId
          );
        }

        let join_at = moment().format("YYYY-MM-DD HH:mm:ss");

        let qrry_1 =
          "insert into timeEventLiveData(`fb_id`, `eventId`, `join_date`,`tmp_date`,`state`, `created`)values(";
        qrry_1 += "'" + fb_id + "',";
        qrry_1 += "'" + eventId + "',";
        qrry_1 += "'" + join_at + "',";
        qrry_1 += "'" + join_at + "',";
        qrry_1 += "'" + join_at + "',";
        qrry_1 += "'" + join_at + "'";
        qrry_1 += ")";

        let last_id = await reqInsertTimeEventLiveData(qrry_1);
        let liveId = last_id.insertId;

        let resTimeEntry = await SelectWithoutLiveTimeEventLiveData(
          eventId,
          fb_id
        );
        let liveDuration = "";
        if (resTimeEntry.length > 0) {
          let resLiveTime = await sumtimeEventLiveData(eventId, fb_id);
          if (resLiveTime.length > 0) {
            let rlt = resLiveTime[0];
            if (rlt.spendTime != "") {
              liveDuration = await customerFunctions.hoursandmins(
                rlt.spendTime
              );
            } else {
              liveDuration = "00:00:00";
            }
          } else {
            liveDuration = "00:00:00";
          }
        } else {
          liveDuration = "00:00:00";
        }

        let output = {
          code: "200",
          msg: "Live Session Start",
          liveId: liveId,
          liveDuration: liveDuration,
        };
        res.status(200).json(output);
      } else {
        liveDuration = "00:00:00";
        let output = {
          code: "200",
          msg: "Param missing",
          liveId: 0,
          liveDuration: liveDuration,
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  updateLiveEventTime: async function (req, res, next) {
    try {
      if (
        typeof req.eventId !== "undefined" &&
        typeof req.fb_id !== "undefined" &&
        typeof req.liveId !== "undefined"
      ) {
        let eventId = req.eventId;
        let fb_id = req.fb_id;
        let liveId = req.liveId;
        let tmp_date = moment().format("YYYY-MM-DD HH:mm:ss");

        let timeEventRes = await updateTimeEventLiveData1(
          tmp_date,
          liveId,
          eventId,
          fb_id
        );
        let resEvent = await selectTimeEvent(API_path);
        let EventArray = [];

        if (resEvent.length > 0) {
          let re = resEvent[0];
          let id = re.id;
          EventArray.push(re);

          let resEventJoinCheck = await sequelize.query(
            "SELECT count(eventId) as count FROM `timeEventJoin` where eventId='" +
              id +
              "' and fb_id='" +
              fb_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          if (resEventJoinCheck.count > 0) {
            EventArray.push({ isParticipate: true });
          } else {
            EventArray.push({ isParticipate: false });
          }
        }

        if (timeEventRes) {
          let output = {
            code: "200",
            msg: "Time Updated",
            timeEvent: EventArray,
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "200",
            msg: "Something went wrong",
            timeEvent: EventArray,
          };
          res.status(200).json(output);
        }
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  participateEvent: async function (req, res, next) {
    try {
      if (
        typeof req.eventId !== "undefined" &&
        typeof req.fb_id !== "undefined"
      ) {
        let eventId = req.eventId;
        let fb_id = req.fb_id;
        let join_at = moment().format("YYYY-MM-DD HH:mm:ss");
        let dated = moment().format("Y-MM-DD");

        let timeEventRes = await timeEventJoin1(eventId, fb_id);

        if (timeEventRes.length == 0) {
          let qrry_1 =
            "insert into timeEventJoin(`fb_id`, `eventId`, `join_at`, `dated`)values(";
          qrry_1 += "'" + fb_id + "',";
          qrry_1 += "'" + eventId + "',";
          qrry_1 += "'" + join_at + "',";
          qrry_1 += "'" + dated + "'";
          qrry_1 += ")";

          await reqInsertTimeEventLiveData(qrry_1);

          let qrry_2 =
            "insert into timeEventLiveData(`fb_id`, `eventId`, `join_date`,`tmp_date`,`state`, `created`)values(";
          qrry_2 += "'" + fb_id + "',";
          qrry_2 += "'" + eventId + "',";
          qrry_2 += "'" + join_at + "',";
          qrry_2 += "'" + join_at + "',";
          qrry_2 += "'LIVE',";
          qrry_2 += "'" + join_at + "'";
          qrry_2 += ")";

          let liveEventRes1 = await reqInsertTimeEventLiveData(qrry_2);
          let last_id = liveEventRes1.insertId;

          let output = {
            code: "200",
            msg: "You are successfully join the event",
            liveId: last_id,
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "200",
            msg: "You are already join the event",
            liveId: 0,
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: "Param missing",
          liveId: 0,
        };
        res.status(200).json(output);
      }
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

  addWithdrawRequest: async function (req, res, next) {
    try {
      if (
        typeof req.amount !== "undefined" &&
        typeof req.fb_id !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let amount = req.amount;
        let r001 = await BankDetail(fb_id);

        if (r001.length > 0) {
          let verify = r001[0].verified;
          if (verify == "Yes") {
            let res2 = await wallet(fb_id);
            if (res2.length == 0) {
              let res1 = await wallet1(fb_id);
              if (res1.length > 0) {
                let r = await walletSum(fb_id);
                let tot = r[0].cr - r[0].dr;
                if (amount <= tot) {
                  let r1 = await setting();

                  let thres = r1[0].threshold;

                  if (thres <= amount) {
                    let dt = moment().format("YYYY-MM-DD HH:mm:ss");
                    let dated = moment().format("YYYY-MM-DD");
                    let txn_id = "-";
                    let desc = "Widthrawal Request Pending";
                    let qrry_1 =
                      "insert into wallet(`fb_id`, `description`, `credit`, `debit`, `txn_id`,`status`,`dated`,`created`)values(";
                    qrry_1 += "'" + fb_id + "',";
                    qrry_1 += "'" + desc + "',";
                    qrry_1 += "'0',";
                    qrry_1 += "'" + amount + "',";
                    qrry_1 += "'" + txn_id + "',";
                    qrry_1 += "'PENDING',";
                    qrry_1 += "'" + dated + "',";
                    qrry_1 +=
                      "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
                    qrry_1 += ")";

                    await reqInsertTimeEventLiveData(qrry_1);

                    let output = {
                      code: "200",
                      msg: "Withdraw request submit",
                    };
                    res.status(200).json(output);
                  } else {
                    let output = {
                      code: "201",
                      msg: "Minimum threshold for withdrw request",
                    };
                    res.status(200).json(output);
                  }
                } else {
                  let output = {
                    code: "201",
                    msg: "As on requested amount, No enough balance",
                  };
                  res.status(200).json(output);
                }
              } else {
                let output = {
                  code: "201",
                  msg: "No wallet balance found",
                };
                res.status(200).json(output);
              }
            } else {
              let output = {
                code: "201",
                msg: "You have already requested for withdrawal",
              };
              res.status(200).json(output);
            }
          } else {
            let output = {
              code: "201",
              msg: "KYC not verified",
            };
            res.status(200).json(output);
          }
        } else {
          let output = {
            code: "201",
            msg: "Please add bank detail",
          };
          res.status(200).json(output);
        }
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

  cronTimeEvent1: async function (req, res, next) {
    try {
      let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
      let r = await cronTimeEvent(currentDate);

      if (r.length > 0) {
        let id = r[0].id;
        let status = "ENABLED";
        await cronUpdate(id, status);
        await cronUpdate1(id);
        // console.log("cron se time event disabled");
      }
      let res = await cronSelectTimeEvent(currentDate);

      if (res.length > 0) {
        let id = res[0].id;
        let status = "DISABLED";
        await cronUpdate(id, status);
        // console.log("cron se time event disabled");
      }

      let res1 = await liveTimeEventLiveData();

      if (res1.length > 0) {
        let r1 = res1[0];
        let liveId = r1["liveId"];
        let tempDate = moment(r1.tmp_date).format("x") / 1000;
        let currentDate =
          moment(moment().format("YYYY-MM-DD HH:mm:ss")).format("x") / 1000;

        // console.log(
        //   "<br>TempDate: " +
        //     tempDate +
        //     " AND CurrentDate: " +
        //     currentDate +
        //     " = " +
        //     (currentDate - tempDate)
        // );

        let DiffSecond = currentDate - tempDate;
        if (DiffSecond >= 60) {
          let archivedDate = r1.tmp_date;
          await archiveTimeEventLiveData(archivedDate, liveId);
        }
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getYourBank: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id;

        let result = await BankDetail(fb_id);
        if (result.length > 0) {
          let r = result[0];

          let ar = {
            fb_id: r.fb_id,
            payment_mode: r.payment_mode,
            ac_name: r.ac_name,
            ac_no: r.ac_no,
            bank_name: r.bank_name,
            ifsc_code: r.ifsc_code,
            adharFront: customerFunctions.checkProfileURL(r.adharFront),
            adharBack: customerFunctions.checkProfileURL(r.adharBack),
            pan: customerFunctions.checkProfileURL(r.pan),
            verified: r.verified,
            upi: r.upi,
            created: moment(r.created).format("YYYY-MM-DD HH:mm:ss"),
          };

          let output = {
            code: "200",
            msg: "Bank Detail found successfully",
            data: [ar],
          };

          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: "No bank detail found",
            data: [],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: "Param missing",
          data: [],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  uploadVideo: async function (req, res, next) {
    try {
      if (typeof req.body.fb_id !== "undefined") {
        let fb_id = req.body.fb_id;
        let rd014 = await blockUsersList(fb_id);

        if (rd014[0].block == "0") {
          let description = req.body.description;
          let category = req.body.category;
          let sound_id = req.body.sound_id;
          let sound_check = "";
          if (sound_id != "") {
            sound_check = "1";
          }
          let v_location = req.body.v_location;
          let duet = 0;
          category = category.charAt(0).toUpperCase() + category.substring(1);

          let dirName = moment().format("MMMMYYYY");
          let newPath = "UpLoad/UpLoad/" + dirName;
          let newTmp = "UpLoad/TMP";

          if (!fs.existsSync(newTmp)) {
            fs.mkdirSync(newTmp, {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/video")) {
            fs.mkdirSync(newPath + "/video", {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/thum")) {
            fs.mkdirSync(newPath + "/thum", {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/gif")) {
            fs.mkdirSync(newPath + "/gif", {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/audio")) {
            fs.mkdirSync(newPath + "/audio", {
              recursive: true,
            });
          }

          let fileName = Date.now() + "_" + uuidv4();
          let video_url = newPath + "/video/" + fileName + ".mp4";
          let thum_url = newPath + "/thum/" + fileName + ".jpg";
          let gif_url = newPath + "/gif/" + fileName + ".gif";

          if (typeof req.files.uploaded_file !== "undefined") {
            let portfolio = req.files.uploaded_file;
            let tempName = Date.now() + uuidv4() + portfolio.name;
            let orignalVideoPath = "UpLoad/TMP/" + tempName;
            let uploadPortfolio = "UpLoad/TMP/" + tempName;
            let generateJpg = "UpLoad/TMP/" + fileName + ".jpg";
            let generateMP3FromVideo = "UpLoad/TMP/" + fileName + ".mp3";
            let generateAacFromMp3 = "UpLoad/TMP/" + fileName + ".aac";
            let genrateGif = "UpLoad/TMP/" + fileName + ".gif";

            portfolio.mv(uploadPortfolio, async function (err) {
              if (err) {
                let output = {
                  code: "201",
                  msg: [{ response: err }],
                };
                res.status(200).json(output);
              } else {  
                let optimizeResultFile =
                  "UpLoad/TMP/" + fileName + "_optimize.mp4";

                // *********optimize video size start**********//

                ffmpeg(orignalVideoPath)
                  .output(optimizeResultFile)
                  .videoCodec("libx264")
                  .videoFilters([
                    "scale=576:1024:force_original_aspect_ratio=decrease",
                    "pad=576:1024:(ow-iw)/2:(oh-ih)/2",
                    "setsar=1",
                  ])
                  .on("error", function (err) {
                    let output = {
                      code: "201",
                      msg: [{ response: err }],
                    };
                    res.status(200).json(output);
                  })
                  .on("progress", function (progress) {
                    // console.log(progress);
                  })
                  .on("end", async function (err) {
                    if (process.env.media_storage == "local") {
                      fs.copyFile(optimizeResultFile, video_url, (error) => {
                        if (error) {
                          let output = {
                            code: "201",
                            msg: [{ response: error }],
                          };
                          res.status(200).json(output);
                        } else {
                          let output = {
                            code: "201",
                            msg: [{ response: "Error please try again." }],
                          };
                          res.status(200).json(output);
                        }
                      });
                    }

                    if (process.env.media_storage == "ftp") {
                      let createVideoFolder = newPath + "/video";
                      await CreateDirectoryToFTP(createVideoFolder);
                      await uploadFileToFTP(optimizeResultFile, video_url);
                    }

                    if (process.env.media_storage == "s3") {
                      await uploadToS3(optimizeResultFile, video_url);
                    }

                    async function ffmpegSyncImage() {
                      return new Promise((resolve, reject) => {
                        // *********generate jpg from video start**********//
                        ffmpeg({ source: optimizeResultFile })
                          .on("filenames", (filenames) => {
                            // console.log(filenames);
                          })
                          .on("end", async () => {
                            if (process.env.media_storage == "ftp") {
                              let createThumFolder = newPath + "/thum";
                              await CreateDirectoryToFTP(createThumFolder);
                              await uploadFileToFTP(generateJpg, thum_url);
                            }
                            if (process.env.media_storage == "s3") {
                              await uploadToS3(generateJpg, thum_url);
                            }
                            if (process.env.media_storage == "local") {
                              fs.copyFile(generateJpg, thum_url, (error) => {
                                if (error) {
                                  // console.log(error);
                                } else {
                                  // console.log(
                                  //   "Thum File has been moved to another folder."
                                  // );
                                }
                              });
                            }
                            resolve();
                          })
                          .on("error", (err) => {
                            // console.log(err);
                          })
                          .takeScreenshots({
                            filename: generateJpg,
                            timemarks: [2],
                          });
                      });
                    }

                    async function ffmpegSyncGif() {
                      return new Promise((resolve, reject) => {
                        // *********generate gif from video start**********//
                        ffmpeg(optimizeResultFile)
                          .setStartTime("00:00:05")
                          .complexFilter(["scale=320:-1:flags=lanczos"])
                          .setDuration("5")
                          .fps(10)
                          .output(genrateGif)
                          .on("error", function (err) {
                            // console.log(err);
                          })
                          .on("end", async function (err) {
                            ffmpeg.ffprobe(
                              optimizeResultFile,
                              async function (err, metadata) {
                                if (err) {
                                  // console.log(err);
                                } else {
                                  if (process.env.media_storage == "ftp") {
                                    let createGifFolder = newPath + "/gif";
                                    await CreateDirectoryToFTP(createGifFolder);
                                    await uploadFileToFTP(genrateGif, gif_url);
                                    if (sound_check == "1") {
                                      resolve();
                                    }
                                    if (metadata.streams.length == "1") {
                                      resolve();
                                    }
                                    if (
                                      metadata.streams.length != "1" ||
                                      sound_check != "1"
                                    ) {
                                      resolve();
                                    }
                                  }
                                  if (process.env.media_storage == "s3") {
                                    await uploadToS3(genrateGif, gif_url);
                                    if (sound_check == "1") {
                                      resolve();
                                    }
                                    if (metadata.streams.length == "1") {
                                      resolve();
                                    }
                                    if (
                                      metadata.streams.length != "1" ||
                                      sound_check != "1"
                                    ) {
                                      resolve();
                                    }
                                  }
                                  if (process.env.media_storage == "local") {
                                    fs.copyFile(
                                      genrateGif,
                                      gif_url,
                                      (error) => {
                                        if (error) {
                                          let output = {
                                            code: "200",
                                            msg: [
                                              { response: "file uploaded" },
                                            ],
                                          };
                                          res.status(200).json(output);
                                        } else {
                                          if (sound_check == "1") {
                                            resolve();
                                          }
                                          if (metadata.streams.length == "1") {
                                            resolve();
                                          }
                                          if (
                                            metadata.streams.length != "1" ||
                                            sound_check != "1"
                                          ) {
                                            resolve();
                                          }
                                        }
                                      }
                                    );
                                  }
                                }
                              }
                            );
                          })
                          .run();
                      });
                    }

                    async function ffmpegSyncSound() {
                      return new Promise(async (resolve, reject) => {
                        if (sound_id == "") {
                          let rd101 = await usersList(fb_id);
                          let soundName =
                            "Orignal Sound - " + rd101[0]["first_name"];

                          let qrry_1 =
                            "insert into sound(sound_name,description,section,uploaded_by,thum)values(";
                          qrry_1 += "" + pool.escape(soundName) + ",";
                          qrry_1 += "'',";
                          qrry_1 += "'',";
                          qrry_1 += "'" + fb_id + "',";
                          qrry_1 += "''";
                          qrry_1 += ")";
                          let last_id = await reqInsertTimeEventLiveData(
                            qrry_1
                          );
                          let insert_id = last_id.insertId;

                          sound_id = insert_id;

                          // *********generate mp3 file start**********//
                          ffmpeg.ffprobe(
                            optimizeResultFile,
                            function (err, metadata) {
                              if (err) {
                              } else {
                                if (metadata.streams.length > 1) {
                                  ffmpeg(optimizeResultFile)
                                    .output(generateMP3FromVideo)
                                    .audioCodec("libmp3lame")
                                    .on("error", function (err) {})
                                    .on("end", async function (err) {
                                      let copy =
                                        newPath +
                                        "/audio/" +
                                        insert_id +
                                        ".mp3";
                                      if (process.env.media_storage == "ftp") {
                                        let createAudioFolder =
                                          newPath + "/audio";
                                        await CreateDirectoryToFTP(
                                          createAudioFolder
                                        );
                                        await uploadFileToFTP(
                                          generateMP3FromVideo,
                                          copy
                                        );
                                      }

                                      if (process.env.media_storage == "s3") {
                                        await uploadToS3(
                                          generateMP3FromVideo,
                                          copy
                                        );
                                      }

                                      if (
                                        process.env.media_storage == "local"
                                      ) {
                                        fs.copyFile(
                                          generateMP3FromVideo,
                                          copy,
                                          (error) => {
                                            if (error) {
                                            } else {
                                              // console.log(
                                              //   "Mp3 File has been moved to another folder."
                                              // );
                                            }
                                          }
                                        );
                                      }
                                    })
                                    .run();
                                  // *********generate mp3 file end**********//

                                  // *********generate aac file start**********//

                                  ffmpeg(optimizeResultFile)
                                    .output(generateAacFromMp3)
                                    .on("error", function (err) {
                                      // console.log(err);
                                    })
                                    .on("end", async function (err) {
                                      let copy =
                                        newPath +
                                        "/audio/" +
                                        insert_id +
                                        ".aac";

                                      if (process.env.media_storage == "ftp") {
                                        let createAudioFolder =
                                          newPath + "/audio";
                                        await CreateDirectoryToFTP(
                                          createAudioFolder
                                        );
                                        await uploadFileToFTP(
                                          generateAacFromMp3,
                                          copy
                                        );
                                        resolve();
                                      }

                                      if (process.env.media_storage == "s3") {
                                        await uploadToS3(
                                          generateAacFromMp3,
                                          copy
                                        );
                                        resolve();
                                      }

                                      if (
                                        process.env.media_storage == "local"
                                      ) {
                                        fs.copyFile(
                                          generateAacFromMp3,
                                          copy,
                                          (error) => {
                                            if (error) {
                                              // console.log(error);
                                            } else {
                                              // console.log(
                                              //   "aac File has been moved to another folder."
                                              // );
                                              resolve();
                                            }
                                          }
                                        );
                                      }
                                    })
                                    .run();
                                  // *********generate aac file start**********//
                                } else {
                                  resolve();
                                }
                              }
                            }
                          );
                        }
                      });
                    }

                    function ffmpegUnlinkFile() {
                      return new Promise((resolve, reject) => {
                        fs.unlinkSync(generateJpg);
                        if (sound_id == "") {
                          fs.unlinkSync(generateAacFromMp3);
                          fs.unlinkSync(generateMP3FromVideo);
                        }
                        fs.unlinkSync(genrateGif);
                        fs.unlinkSync(orignalVideoPath);
                        fs.unlinkSync(optimizeResultFile);
                        let output = {
                          code: "200",
                          msg: [{ response: "file uploaded" }],
                        };
                        res.status(200).json(output);
                        resolve();
                      });
                    }

                    await ffmpegSyncImage();
                    if (sound_id == "") {
                      await ffmpegSyncSound();
                    }
                    await ffmpegSyncGif();
                    await ffmpegUnlinkFile();

                    // *********generate jpg from video end**********//

                    // *********generate gif from video end**********//
                    let qrry_2 =
                      "insert into videos(description,category, video,sound_id,v_location,fb_id,gif,thum,created)values(";
                    qrry_2 += "" + pool.escape(description) + ",";
                    qrry_2 += "" + pool.escape(category) + ",";
                    qrry_2 += "" + pool.escape(video_url) + ",";
                    qrry_2 += "" + pool.escape(sound_id) + ",";
                    qrry_2 += "" + pool.escape(v_location) + ",";
                    qrry_2 += "" + pool.escape(fb_id) + ",";
                    qrry_2 += "" + pool.escape(gif_url) + ",";
                    qrry_2 += "" + pool.escape(thum_url) + ",";
                    qrry_2 +=
                      "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
                    qrry_2 += ")";

                    await reqInsertTimeEventLiveData(qrry_2);

                    let output = {
                      code: "200",
                      msg: [{ response: "File uploaded" }],
                    };
                    res.status(200).json(output);
                  })
                  .run();
                // *********optimize video size end**********//
              }
            });
          } else {
            let output = {
              code: "201",
              msg: [{ response: "error" }],
            };
            res.status(200).json(output);
          }
        } else {
          let output = {
            code: "201",
            msg: [{ response: "You are Blocked, So you can not upload Video" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json parem missing 3" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  uploadVideoClip: async function (req, res, next) {
    try {
      if (typeof req.body.fb_id !== "undefined") {
        let fb_id = req.body.fb_id;
        let rd014 = await blockUsersList(fb_id);

        if (rd014[0].block == "0") {
          let description = req.body.description;
          let category = req.body.category;
          let vtype = "Clip";
          let sound_id = req.body.sound_id;
          let v_location = req.body.v_location;
          let duet = 0;
          category = category.charAt(0).toUpperCase() + category.substring(1);

          let dirName = moment().format("MMMMYYYY");
          let newPath = "UpLoad/UpLoad/" + dirName;

          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/video")) {
            fs.mkdirSync(newPath + "/video", {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/thum")) {
            fs.mkdirSync(newPath + "/thum", {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/gif")) {
            fs.mkdirSync(newPath + "/gif", {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/clip")) {
            fs.mkdirSync(newPath + "/clip", {
              recursive: true,
            });
          }

          let fileName = Date.now() + "_" + uuidv4();
          let video_url = newPath + "/video/" + fileName + ".mp4";
          let thum_url = newPath + "/thum/" + fileName + ".jpg";
          let gif_url = newPath + "/gif/" + fileName + ".gif";

          if (typeof req.files.uploaded_file !== "undefined") {
            let portfolio = req.files.uploaded_file;
            let tempName = Date.now() + uuidv4() + portfolio.name;
            let orignalVideoPath = "UpLoad/TMP/" + tempName;
            let uploadPortfolio = "UpLoad/TMP/" + tempName;
            portfolio.mv(uploadPortfolio, async function (err) {
              if (err) {
              } else {
                let optimizeResultFile = orignalVideoPath;
                if (process.env.media_storage == "local") {
                  fs.copyFile(optimizeResultFile, video_url, (error) => {
                    if (error) {
                      throw error;
                    } else {
                      // console.log(
                      //   "Video File has been moved to another folder."
                      // );
                    }
                  });
                }

                if (process.env.media_storage == "ftp") {
                  let createVideoFolder = newPath + "/video";
                  await CreateDirectoryToFTP(createVideoFolder);
                  await uploadFileToFTP(optimizeResultFile, video_url);
                }

                if (process.env.media_storage == "s3") {
                  await uploadToS3(optimizeResultFile, video_url);
                }

                // *********generate jpg from video start**********//
                let generateJpg = "UpLoad/TMP/" + fileName + ".jpg";
                ffmpeg({ source: optimizeResultFile })
                  .on("filenames", (filenames) => {
                    // console.log(filenames);
                  })
                  .on("end", async () => {
                    if (process.env.media_storage == "ftp") {
                      let createThumFolder = newPath + "/thum";
                      await CreateDirectoryToFTP(createThumFolder);
                      await uploadFileToFTP(generateJpg, thum_url);
                      fs.unlinkSync(generateJpg);
                    }
                    if (process.env.media_storage == "s3") {
                      await uploadToS3(generateJpg, thum_url);
                      fs.unlinkSync(generateJpg);
                    }
                    if (process.env.media_storage == "local") {
                      fs.copyFile(generateJpg, thum_url, (error) => {
                        if (error) {
                          throw error;
                        } else {
                          // console.log(
                          //   "Thum File has been moved to another folder."
                          // );
                          fs.unlinkSync(generateJpg);
                        }
                      });
                    }
                  })
                  .on("error", (err) => {
                    // console.log(err);
                  })
                  .takeScreenshots({
                    filename: generateJpg,
                    timemarks: [2],
                  });
                // *********generate jpg from video end**********//

                // *********generate gif from video start**********//
                let genrateGif = "UpLoad/TMP/" + fileName + ".gif";
                ffmpeg(optimizeResultFile)
                  .setStartTime("00:00:05")
                  .setDuration("5")
                  .complexFilter(["scale=320:-1:flags=lanczos"])
                  .fps(10)
                  .output(genrateGif)
                  .on("error", function (err) {
                    // console.log(err);
                  })
                  .on("end", async function (err) {
                    if (process.env.media_storage == "ftp") {
                      let createGifFolder = newPath + "/gif";
                      await CreateDirectoryToFTP(createGifFolder);
                      await uploadFileToFTP(genrateGif, gif_url);
                      fs.unlinkSync(genrateGif);
                      fs.unlinkSync(optimizeResultFile);
                      let output = {
                        code: "200",
                        msg: [{ response: "file uploaded" }],
                      };
                      res.status(200).json(output);
                    }
                    if (process.env.media_storage == "s3") {
                      await uploadToS3(genrateGif, gif_url);
                      fs.unlinkSync(genrateGif);
                      fs.unlinkSync(optimizeResultFile);
                      let output = {
                        code: "200",
                        msg: [{ response: "file uploaded" }],
                      };
                      res.status(200).json(output);
                    }
                    if (process.env.media_storage == "local") {
                      fs.copyFile(genrateGif, gif_url, (error) => {
                        if (error) {
                          throw error;
                        } else {
                          // console.log(
                          //   "Gif File has been moved to another folder."
                          // );
                          fs.unlinkSync(genrateGif);
                          fs.unlinkSync(optimizeResultFile);
                          let output = {
                            code: "200",
                            msg: [{ response: "file uploaded" }],
                          };
                          res.status(200).json(output);
                        }
                      });
                    }
                  })
                  .run();
                // *********generate gif from video end**********//
                let duration = "00:00";
                let sound_id = "0";
                let qrry_2 =
                  "insert into videos(description,category,vtype, video,sound_id,v_location,fb_id,gif,duration,thum,created)values(";
                qrry_2 += "" + pool.escape(description) + ",";
                qrry_2 += "" + pool.escape(category) + ",";
                qrry_2 += "" + pool.escape(vtype) + ",";
                qrry_2 += "" + pool.escape(video_url) + ",";
                qrry_2 += "" + pool.escape(sound_id) + ",";
                qrry_2 += "" + pool.escape(v_location) + ",";
                qrry_2 += "" + pool.escape(fb_id) + ",";
                qrry_2 += "" + pool.escape(gif_url) + ",";
                qrry_2 += "" + pool.escape(duration) + ",";
                qrry_2 += "" + pool.escape(thum_url) + ",";
                qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
                qrry_2 += ")";

                let last_id = await reqInsertTimeEventLiveData(qrry_2);
                let liveId = last_id.insertId;

                ffmpeg.ffprobe(
                  orignalVideoPath,
                  async function (err, metadata) {
                    if (err) {
                    } else {
                      let text = metadata.format.duration;

                      const sec = parseInt(text, 10); // convert value to number if it's string
                      let hours = Math.floor(sec / 3600); // get hours
                      let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
                      let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
                      // add 0 if value < 10; Example: 2 => 02
                      if (hours < 10) {
                        hours = "0" + hours;
                      }
                      if (minutes < 10) {
                        minutes = "0" + minutes;
                      }
                      if (seconds < 10) {
                        seconds = "0" + seconds;
                      }
                      if (hours == "00") {
                        duration = minutes + ":" + seconds;
                      } else {
                        duration = hours + ":" + minutes + ":" + seconds;
                      }

                      let update =
                        "update videos SET duration ='" +
                        duration +
                        "' WHERE id ='" +
                        liveId +
                        "'";
                      await reqInsertTimeEventLiveData(update);
                    }
                  }
                );
                // *********optimize video size end**********//
              }
            });
          } else {
            let output = {
              code: "201",
              msg: [{ response: "Please Upload a file." }],
            };
            res.status(200).json(output);
          }
        } else {
          let output = {
            code: "201",
            msg: [{ response: "You are Blocked, So you can not upload Video" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json parem missing 3" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  addBank: async function (req, res, next) {
    try {
      if (
        typeof req.body.fb_id !== "undefined" &&
        typeof req.body.payment_mode !== "undefined"
      ) {
        let fb_id = req.body.fb_id;

        let dirName = moment().format("MMMMYYYY");
        let newPath = "UpLoad/UpLoad/" + dirName;

        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath, {
            recursive: true,
          });
        }

        if (!fs.existsSync(newPath + "/bank")) {
          fs.mkdirSync(newPath + "/bank", {
            recursive: true,
          });
        }

        let res1 = await BankDetail(fb_id);

        if (res1.length == 0) {
          let uploadadharFront = "";
          let uploadadharBack = "";
          let uploadpan = "";
          let verified = "No";

          if (typeof req.files.adharFront !== "undefined") {
            let adharFront = req.files.adharFront;
            uploadadharFront =
              newPath + "/bank/" + Date.now() + adharFront.name;
            adharFront.mv(uploadadharFront, async function (err, res) {
              if (err) {
              } else {
                if (process.env.media_storage == "ftp") {
                  let createBanknFolder = newPath + "/bank";
                  await CreateDirectoryToFTP(createBanknFolder);
                  await uploadFileToFTP(uploadadharFront, uploadadharFront);
                  fs.unlinkSync(uploadadharFront);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadadharFront, uploadadharFront);
                  fs.unlinkSync(uploadadharFront);
                }
              }
            });
          }

          if (typeof req.files.adharBack !== "undefined") {
            let adharBack = req.files.adharBack;
            uploadadharBack = newPath + "/bank/" + Date.now() + adharBack.name;
            adharBack.mv(uploadadharBack, async function (err, res) {
              if (err) {
              } else {
                if (process.env.media_storage == "ftp") {
                  let createBanknFolder = newPath + "/bank";
                  await CreateDirectoryToFTP(createBanknFolder);
                  await uploadFileToFTP(uploadadharBack, uploadadharBack);
                  fs.unlinkSync(uploadadharBack);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadadharBack, uploadadharBack);
                  fs.unlinkSync(uploadadharBack);
                }
              }
            });
          }

          if (typeof req.files.pan !== "undefined") {
            let pan = req.files.pan;
            uploadpan = newPath + "/bank/" + Date.now() + pan.name;
            pan.mv(uploadpan, async function (err, res) {
              if (err) {
              } else {
                if (process.env.media_storage == "ftp") {
                  let createBanknFolder = newPath + "/bank";
                  await CreateDirectoryToFTP(createBanknFolder);
                  await uploadFileToFTP(uploadpan, uploadpan);
                  fs.unlinkSync(uploadpan);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadpan, uploadpan);
                  fs.unlinkSync(uploadpan);
                }
              }
            });
          }

          let payment_mode = req.body.payment_mode;

          if (payment_mode == "BANK") {
            let ac_name = req.body.ac_name;
            let ac_no = req.body.ac_no;
            let bank_name = req.body.bank_name;
            let ifsc_code = req.body.ifsc_code;
            let qrry_1 =
              "insert into bank_detail(`fb_id`, `payment_mode`, `ac_name`, `ac_no`, `bank_name`, `ifsc_code`,`adharFront`,`adharBack`,`pan`,`verified`,`created`)values(";
            qrry_1 += "" + pool.escape(fb_id) + ",";
            qrry_1 += "" + pool.escape(payment_mode) + ",";
            qrry_1 += "" + pool.escape(ac_name) + ",";
            qrry_1 += "" + pool.escape(ac_no) + ",";
            qrry_1 += "" + pool.escape(bank_name) + ",";
            qrry_1 += "" + pool.escape(ifsc_code) + ",";
            qrry_1 += "" + pool.escape(uploadadharFront) + ",";
            qrry_1 += "" + pool.escape(uploadadharBack) + ",";
            qrry_1 += "" + pool.escape(uploadpan) + ",";
            qrry_1 += "" + pool.escape(verified) + ",";
            qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_1 += ")";
            await reqInsertTimeEventLiveData(qrry_1);
          } else {
            let upi = req.body.upi;
            let qrry_1 =
              "insert into bank_detail(`fb_id`, `payment_mode`, `upi`,`adharFront`,`adharBack`,`pan`,`verified`,`created`)values(";
            qrry_1 += "" + pool.escape(fb_id) + ",";
            qrry_1 += "" + pool.escape(payment_mode) + ",";
            qrry_1 += "" + pool.escape(upi) + ",";
            qrry_1 += "" + pool.escape(adharFront) + ",";
            qrry_1 += "" + pool.escape(adharBack) + ",";
            qrry_1 += "" + pool.escape(pan) + ",";
            qrry_1 += "" + pool.escape(verified) + ",";
            qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_1 += ")";
            await reqInsertTimeEventLiveData(qrry_1);
          }

          let output = {
            code: "200",
            msg: "Bank/UPI added successfully",
          };
          res.status(200).json(output);
        } else {
          let verified = "No";
          let created = moment().format("YYYY-MM-DD HH:mm:ss");

          if (typeof req.files.adharFront !== "undefined") {
            adharFront = req.files.adharFront;
            let uploadadharFront =
              newPath + "/bank/" + Date.now() + adharFront.name;
            adharFront.mv(uploadadharFront, async function (err, res) {
              if (err) {
              } else {
                await updateBankDetail(
                  "adharFront",
                  uploadadharFront,
                  created,
                  fb_id
                );
                if (process.env.media_storage == "ftp") {
                  let createBanknFolder = newPath + "/bank";
                  await CreateDirectoryToFTP(createBanknFolder);
                  await uploadFileToFTP(uploadadharFront, uploadadharFront);
                  fs.unlinkSync(uploadadharFront);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadadharFront, uploadadharFront);
                  fs.unlinkSync(uploadadharFront);
                }
              }
            });
          }

          if (typeof req.files.adharBack !== "undefined") {
            adharBack = req.files.adharBack;
            let uploadadharBack =
              newPath + "/bank/" + Date.now() + adharBack.name;
            adharBack.mv(uploadadharBack, async function (err, res) {
              if (err) {
              } else {
                await updateBankDetail(
                  "adharBack",
                  uploadadharBack,
                  created,
                  fb_id
                );
                if (process.env.media_storage == "ftp") {
                  let createBanknFolder = newPath + "/bank";
                  await CreateDirectoryToFTP(createBanknFolder);
                  await uploadFileToFTP(uploadadharBack, uploadadharBack);
                  fs.unlinkSync(uploadadharBack);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadadharBack, uploadadharBack);
                  fs.unlinkSync(uploadadharBack);
                }
              }
            });
          }

          if (typeof req.files.pan !== "undefined") {
            pan = req.files.pan;
            let uploadpan = newPath + "/bank/" + Date.now() + pan.name;
            pan.mv(uploadpan, async function (err, res) {
              if (err) {
              } else {
                await updateBankDetail("pan", uploadpan, created, fb_id);
                if (process.env.media_storage == "ftp") {
                  let createBanknFolder = newPath + "/bank";
                  await CreateDirectoryToFTP(createBanknFolder);
                  await uploadFileToFTP(uploadpan, uploadpan);
                  fs.unlinkSync(uploadpan);
                }
                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadpan, uploadpan);
                  fs.unlinkSync(uploadpan);
                }
              }
            });
          }

          let payment_mode = req.body.payment_mode;

          if (payment_mode == "BANK") {
            let ac_name = req.body.ac_name;
            let ac_no = req.body.ac_no;
            let bank_name = req.body.bank_name;
            let ifsc_code = req.body.ifsc_code;
            await updateBankDetail1(
              payment_mode,
              ac_name,
              ac_no,
              bank_name,
              ifsc_code,
              verified,
              fb_id
            );
          } else {
            await updateBankDetail2(payment_mode, upi, verified, fb_id);
          }
          let output = {
            code: "200",
            msg: "Bank/UPI updated successfully",
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: "param missing",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getYourWallet: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id;

        let r01 = await settingThreshold();
        let threshold = r01[0].threshold;

        let log_in_rs = await wallet2(fb_id);

        if (log_in_rs.length > 0) {
          let array_outH = [];
          for (i = 0; i < log_in_rs.length; i++) {
            let rd = log_in_rs[i];
            let get_data = {
              fb_id: rd.fb_id,
              credit: rd.credit,
              debit: rd.debit,
              description: rd.description,
              txn_id: rd.txn_id,
              status: rd.status,
              date: rd.dated,
              created: moment(rd.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            array_outH.push(get_data);
          }

          let r = await walletSum(fb_id);

          let tot = r[0].cr - r[0].dr;

          let r001 = await BankDetail(fb_id);
          let verify = "No Bank Added";
          if (r001.length > 0) {
            verify = r001[0].verified;
          }

          let output = {
            code: "200",
            isBankVerified: verify,
            threshold: threshold,
            credit: r[0].cr,
            debit: r[0].dr,
            balance: tot,
            msg: [{ response: "Data found on your wallet" }],
            history: array_outH,
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "200",
            isBankVerified: "",
            threshold: threshold,
            credit: 0,
            debit: 0,
            balance: 0,
            msg: [{ response: "No data found on your wallet" }],
            history: [],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          isBankVerified: "",
          threshold: 0,
          credit: 0,
          debit: 0,
          balance: 0,
          msg: [{ response: "Json code param are missing fb id" }],
          history: [],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  appSetting: async function (req, res, next) {
    try {
      let r = await setting();
      let output = {
        code: "200",
        referral_amount: r[0].referral_amount,
        threshold: r[0].threshold,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  updatePhoneNumber: async function (req, res, next) {
    try {
      if (
        typeof req.mobile !== "undefined" &&
        typeof req.fb_id !== "undefined"
      ) {
        let mobile = req.mobile;
        let fb_id = req.fb_id;
        let res1 = await usersList(fb_id);

        if (res1.length > 0) {
          let res11 = await selectUserPhone(mobile);
          if (res11.length == 0) {
            await updateUserPhone(mobile, fb_id);
            let output = {
              code: "200",
              msg: "Phone Number update successfully",
            };
            res.status(200).json(output);
          } else {
            let output = {
              code: "201",
              msg: "Phone Number already exist",
            };
            res.status(200).json(output);
          }
        } else {
          let output = {
            code: "201",
            msg: "user not found",
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: "param missing",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  forgotpassword: async function (req, res, next) {
    try {
      if (
        typeof req.mobile !== "undefined" &&
        typeof req.password !== "undefined"
      ) {
        let mobile = req.mobile;
        let password = req.password;

        let res1 = await selectUserPhone(mobile);

        if (res1.length > 0) {
          await updateUserPassword(password, mobile);
          let output = {
            code: "200",
            msg: "Password update successfully",
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: "Mobile number not found, either you are logged in from social media",
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: "param missing",
        };
        res.status(200).json(output);
      }
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

  userViewUpdateStory: async function (req, res, next) {
    try {
      if (typeof req.id !== "undefined" && typeof req.fb_id !== "undefined") {
        let story_id = req.id;
        let fb_id = req.fb_id;
        let view_on = moment().format("YYYY-MM-DD HH:mm:ss");

        let res1 = await storyView(story_id, fb_id);

        if (res1.length == 0) {
          let qrry_1 = "insert into story_view(story_id,fb_id,view_on)values(";
          qrry_1 += "'" + story_id + "',";
          qrry_1 += "'" + fb_id + "',";
          qrry_1 += "'" + view_on + "'";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);
          let output = {
            code: "200",
            msg: [{ response: "Story View added" }],
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: [{ response: "You already seen" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json param missing" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addStory: async function (req, res, next) {
    try {
      if (typeof req.body.fb_id !== "undefined") {
        let fb_id = req.body.fb_id;
        let title = req.body.title;

        let fileName = Date.now() + uuidv4();
        let dirName = moment().format("MMMMYYYY");
        let newPath = "UpLoad/UpLoad/" + dirName;

        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath, {
            recursive: true,
          });
        }

        if (!fs.existsSync(newPath + "/story")) {
          fs.mkdirSync(newPath + "/story", {
            recursive: true,
          });
        }

        let post_url = newPath + "/story/" + fileName;
        let created = moment().format("YYYY-MM-DD HH:mm:ss");
        if (typeof req.files.post_file !== "undefined") {
          let post_file = req.files.post_file;
          let uploadPortfolio = post_url + post_file.name;

          post_file.mv(uploadPortfolio, async function (err, res1) {
            if (err) {
            } else {
              let qrry_1 =
                "insert into story(fb_id,title, post,created)values(";
              qrry_1 += "" + pool.escape(fb_id) + ",";
              qrry_1 += "" + pool.escape(title) + ",";
              qrry_1 += "" + pool.escape(uploadPortfolio) + ",";
              qrry_1 += "" + created + "'";
              qrry_1 += ")";
              await reqInsertTimeEventLiveData(qrry_1);
            }
          });
          let output = {
            code: "200",
            msg: [{ response: "Story uploaded" }],
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: [{ response: "Post uploading error" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json param missing" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getStory: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined") {
        let mainAr = [];
        let fb_id = req.fb_id;

        let query01 = await selectStory(fb_id);
        let SubAr = [];
        if (query01.length > 0) {
          for (i = 0; i < query01.length; i++) {
            let r01 = query01[i];

            let storyAr = [];
            let fbId = r01.fb_id;

            let query02 = await selectStory1(fbId);

            let Seen = 0;
            let Remain = 0;
            let newArray = [];
            let seenStatus = "";
            for (i = 0; i < query02.length; i++) {
              let r2 = query02[i];
              let id = r2.id;

              let res03 = await viewStoryWithFbId(fb_id, id);

              if (res03.length > 0) {
                Seen++;
                newArray.push({ seen: "Y", viewOn: res03[0].view_on });
              } else {
                Remain++;
                newArray.push({ seen: "N", viewOn: "-" });
              }

              if (Seen > 0 && Remain == 0) {
                seenStatus = "AllSeen";
              } else if (Seen == 0 && Remain > 0) {
                seenStatus = "AllRemain";
              } else if (Seen >= Remain || Seen <= Remain) {
                seenStatus = "PartialSeen";
              }

              newArray.push({
                post: customerFunctions.checkProfileURL(r2.post),
              });

              let res04 = await viweSingleStory(id);

              newArray.push({ viewCount: res04.length });

              storyAr.push(r2);
            }

            let users = await userInfo(fbId);

            let SubAr_array = {
              fb_id: fbId,
              userName: users[0].username,
              firstName: users[0].first_name,
              lastName: users[0].last_name,
              profilePic: customerFunctions.checkProfileURL(
                users[0].profile_pic
              ),
              storySeenStaus: seenStatus,
              StoryData: storyAr,
            };

            SubAr.push(SubAr_array);
          }
          let output = {
            code: "200",
            msg: [{ response: "Success, Story List" }],
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: [{ response: "No story found" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json param missing" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  generateAgoraToken: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.username !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let username = req.username;

        const appID = "970CA35de60c44645bbae8a215061b33";
        const appCertificate = "5CFd2fd1755d40ecb72977518be15d3b";
        const channelName = username;
        const uid = 2882341273;
        const account = fb_id;
        const role = RtcRole.PUBLISHER;

        const expirationTimeInSeconds = 3600;

        const currentTimestamp = Math.floor(Date.now() / 1000);

        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

        // Build token with uid
        // const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
        // console.log("Token With Integer Number Uid: " + tokenA);

        // Build token with user account
        const tokenB = RtcTokenBuilder.buildTokenWithAccount(
          appID,
          appCertificate,
          channelName,
          account,
          role,
          privilegeExpiredTs
        );
        // console.log("Token With UserAccount: " + tokenB);

        let output = {
          code: "200",
          msg: "Success",
          data: tokenB,
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  get_followers_user_s_user: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.my_fb_id !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let my_fb_id = req.my_fb_id;

        let query = await followedFbIid(fb_id);
        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let rd1 = await usersList(row.fb_id);
          if (rd1.length > 0) {
            let follow_count = await followUsers(row.fb_id, my_fb_id);

            let follow = "";
            let follow_button_status = "";

            if (follow_count[0].count == "0") {
              follow = "0";
              follow_button_status = "Follow";
            } else if (follow_count[0].count != "0") {
              follow = "1";
              follow_button_status = "Unfollow";
            }
            if (rd1.length > 0) {
              let sub_array = {
                fb_id: rd1[0].fb_id,
                username: "@" + rd1[0].username,
                verified: rd1[0].verified,
                first_name: rd1[0].first_name,
                last_name: rd1[0].last_name,
                gender: rd1[0].gender,
                bio: rd1[0].bio,
                profile_pic: customerFunctions.checkProfileURL(
                  rd1[0].profile_pic
                ),
                created: moment(rd1[0].created).format("YYYY-MM-DD HH:mm:ss"),
                marked: rd1[0].marked,
                follow_Status: {
                  follow: follow,
                  follow_status_button: follow_button_status,
                },
              };
              array_out.push(sub_array);
            }
          }
        }
        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  Admin_Login: async function (req, res, next) {
    try {
      if (
        typeof req.email !== "undefined" &&
        typeof req.password !== "undefined"
      ) {
        let email = req.email;
        let password = req.password;

        let log_in_rs = await adminLogin(email, password);

        if (log_in_rs.length > 0) {
          const tokens = await tokenService.generateTokens({
            id: log_in_rs[0].id,
            email: log_in_rs[0].email,
            roles: log_in_rs[0].roles,
          });

          const allInformation1 = {
            cc: "howtostart192@gmail.com, gsingh.shael@gmail.com, anuj@fihd.in",
            subject: "Hithot admin verification",
            template: "verification",
            date: moment().format("YYYY"),
            otp: req.otp,
            logo: "https://node.hithot.club/logo.png",
          };

          await sendNodeEmailFuc(allInformation1)
            .then((response) => {
              response.transporter.sendMail(
                response.mailOptions,
                async function (err, info) {
                  if (err) {
                    return res.status(500).json({
                      status: false,
                      message: "Internal Server Error",
                    });
                  } else {
                  }
                }
              );
            })
            .catch((err) => {
              return res.status(500).json({
                status: false,
                message: "Internal Server Error" + err,
              });
            });

          const tokenExpiry = await tokenService.getTokenExpiry(
            tokens.access_token
          );
          tokens.accessTokenExpiresIn = tokenExpiry.exp;
          let output = {
            code: "200",
            msg: [{ response: "login success" }],
            role: log_in_rs[0].roles,
            token: tokens,
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: { response: "Error in login" },
          };
          res.status(401).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: { response: "Json Parem are missing" },
        };
        res.status(500).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.headers.authorization.split(" ")[1];
      var decoded = jwt_decode(refreshToken);
      const tokens = await tokenService.refreshTokenExpiry({
        decoded,
      });
      const tokenExpiry = await tokenService.getTokenExpiry(
        tokens.access_token
      );
      tokens.accessTokenExpiresIn = tokenExpiry.exp;
      tokens.refresh_token = req.body.refresh_token;

      let output = {
        code: "200",
        token: tokens,
        message: "The access token has been refreshed",
      };
      res.status(200).json(output);
    } catch (error) {
      // console.log(error);
      res.sendStatus(500);
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

  allProfileVerification: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let type = req.data.type;
      let search = req.data.search ? pool.escape(req.data.search) : "";
      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  u.username like "%" ' + search + ' "%"';
        }
      }
      if (type == "name") {
        if (search != "") {
          qq =
            ' AND  CONCAT(u.first_name, " ", u.last_name) like "%" ' +
            search +
            ' "%"';
        }
      }
      if (type == "addedon") {
        if (search != "") {
          qq = ' AND  u.created like "%" ' + search + ' "%"';
        }
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let query = await verificationRequest1(qq, offset, limit);
      let queryCount = await verificationRequest();
      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount.length / limit) : 0;
      let array_out1 = [];

      for (i = 0; i < query.length; i++) {
        let row1 = query[i];
        let checkurl = row1.attachment.indexOf("hithot");
        let attachment = "";
        let attachment1 = "";
        if (checkurl > 0) {
          attachment = row1.attachment
            ? API_path + row1.attachment.replace("https://hithot.club/API/", "")
            : "";
          attachment1 = row1.attachment1
            ? API_path +
              row1.attachment1.replace("https://hithot.club/API/", "")
            : "";
        } else {
          attachment = row1.attachment ? API_path + row1.attachment : "";
          attachment1 = row1.attachment1 ? API_path + row1.attachment1 : "";
        }
        let rd = await verificationUser(row1.fb_id);
        if (rd.length > 0) {
          let sub_array = {
            id: row1.id,
            fb_id: row1.fb_id,
            user_info: {
              first_name: rd[0].first_name,
              last_name: rd[0].last_name,
              profile_pic: customerFunctions.checkProfileURL(rd[0].profile_pic),
              username: "@" + rd[0].username,
              verified: rd[0].verified,
            },
            attachment: attachment,
            attachment1: attachment1,
            instagram: row1.instagram,
            youtube: row1.youtube,
            facebook: row1.facebook,
            created: row1.created,
          };
          array_out1.push(sub_array);
        }
      }
      let output = {
        code: "200",
        msg: array_out1,
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

  addRewardAmount: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined" && typeof req.vals !== "undefined") {
        let vals = req.vals;
        let fb_id = req.fb_id;
        let ref = "Reward";

        let query001 = await refRewardDiamond(fb_id);

        if (query001.length > 0) {
          let wid = query001[0].id;
          if (vals == "0") {
            let deletes = "delete from diamond  where id='" + wid + "'";
            await reqInsertTimeEventLiveData(deletes);
          } else {
            let update =
              "UPDATE diamond set diamond='" +
              vals +
              "' where id='" +
              wid +
              "'";
            await reqInsertTimeEventLiveData(update);
          }
        } else {
          if (vals != "0") {
            let dated = moment().format("Y-MM-DD");
            let qrry_2 =
              "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`video_id`,`category`, `description`, `diamond`, `convertedDiamond`, `dated`, `created`)values(";
            qrry_2 += "'" + fb_id + "',";
            qrry_2 += "'-',";
            qrry_2 += "'-',";
            qrry_2 += "'0',";
            qrry_2 += "'Reward',";
            qrry_2 += "'" + ref + "',";
            qrry_2 += "'" + vals + "',";
            qrry_2 += "'0',";
            qrry_2 += "'" + dated + "',";
            qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_2 += ")";
            await reqInsertTimeEventLiveData(qrry_2);
          }
        }

        let output = {
          code: "200",
          msg: "Diamond Updated",
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

  allowUsertoUploadClip: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined" && typeof req.type !== "undefined") {
        let fb_id = req.fb_id;
        let type = req.type;
        await updateUserClip(fb_id, type);
        if (type == "Yes") {
          let output = {
            code: "200",
            msg: "Now this user has rights to upload clip",
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "200",
            msg: "Clip upload rights revoked from user",
          };
          res.status(200).json(output);
        }
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

  updateVerificationStatus: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.action !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let action = req.action;

        if (action == "approve") {
          let update =
            "update users SET verified ='1' WHERE fb_id ='" + fb_id + "'";
          await reqInsertTimeEventLiveData(update);

          let deletes =
            "delete from verification_request where fb_id ='" + fb_id + "'";
          await reqInsertTimeEventLiveData(deletes);

          let output = {
            code: "200",
            msg: "Updated Successfully",
          };
          res.status(200).json(output);
        }

        if (action == "decline") {
          let deletes =
            "delete from verification_request where fb_id ='" + fb_id + "'";
          await reqInsertTimeEventLiveData(deletes);

          let output = {
            code: "200",
            msg: "Request rejected and deleted",
          };
          res.status(200).json(output);
        }
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

  addFakeViewLike: async function (req, res, next) {
    try {
      if (
        typeof req.id !== "undefined" &&
        typeof req.vals !== "undefined" &&
        typeof req.types !== "undefined"
      ) {
        let id = req.id;
        let vals = req.vals;
        let types = req.types;

        if (types == "View") {
          let update =
            "UPDATE videos set fake_view='" + vals + "' where id='" + id + "'";
          await reqInsertTimeEventLiveData(update);

          let output = {
            code: "200",
            msg: "View Updated",
          };
          res.status(200).json(output);
        } else {
          let update =
            "UPDATE videos set fake_like='" + vals + "' where id='" + id + "'";
          await reqInsertTimeEventLiveData(update);

          let output = {
            code: "200",
            msg: "Like Updated",
          };
          res.status(200).json(output);
        }
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

  DeleteVideo: async function (req, res, next) {
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
            body: "Your video has been deleted",
          },
        };
        let ss = await customerFunctions.sendPushNotificationToMobileDevice(
          notification
        );
        let output = {
          code: "200",
          msg: [{ response: "Video Unlike" }],
          data: ss,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json parem missing" }],
        };
        res.status(200).json(output);
      }
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

  admin_show_allVideos: async function (req, res, next) {
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
          created:
            row.id > 2168801
              ? moment(row.vcreated)
                  .add(5, "hours")
                  .add(30, "minutes")
                  .format("YYYY-MM-DD HH:mm:ss")
              : moment(row.vcreated).format("YYYY-MM-DD HH:mm:ss"),
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

  getBank: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let verified = req.data.verified;
      let qq = "";
      let type = req.data.type;
      let search = req.data.search ? pool.escape(req.data.search) : "";

      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  u.username like "%" ' + search + ' "%"';
        }
      }
      if (type == "ac_name") {
        if (search != "") {
          qq = ' AND  w.ac_name like "%" ' + search + ' "%"';
        }
      }
      if (type == "ac_no") {
        if (search != "") {
          qq = ' AND  w.ac_no like "%" ' + search + ' "%"';
        }
      }
      if (type == "upi") {
        if (search != "") {
          qq = ' AND  w.upi like "%" ' + search + ' "%"';
        }
      }
      if (type == "addedon") {
        if (search != "") {
          qq = ' AND  w.created like "%" ' + search + ' "%"';
        }
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;
      let query = await getAllKyc(verified, qq, offset, limit);
      let queryCount = await getAllKycCount(verified, qq);
      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let get_data = {
          id: row.id,
          fb_id: row.fb_id,
          username: "@" + row.username,
          payment_mode: row.payment_mode,
          ac_no: row.ac_no,
          ac_name: row.ac_name,
          ifsc_code: row.ifsc_code,
          bank_name: row.bank_name,
          upi: row.upi,
          adharFront: customerFunctions.checkProfileURL(row.adharFront),
          adharBack: customerFunctions.checkProfileURL(row.adharBack),
          pan: customerFunctions.checkProfileURL(row.pan),
          verified: row.verified,
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

  admin_show_creator: async function (req, res, next) {
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
      let query = await getCreator(qq, offset, limit);
      let queryCount = await getCreatorCount(qq);
      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let portfolio1 = "";
        let portfolio2 = "";
        let portfolio3 = "";
        if (row.portfolio1) {
          portfolio1 = API_path + row.portfolio1;
        }
        if (row.portfolio2) {
          portfolio2 = API_path + row.portfolio2;
        }
        if (row.portfolio3) {
          portfolio3 = API_path + row.portfolio3;
        }

        let get_data = {
          id: row.id,
          fb_id: row.fb_id,
          vid_count: row.vid_count,
          username: row.username,
          name: row.name,
          mobile: row.mobile,
          insta: row.insta,
          facebook: row.facebook,
          youtube: row.youtube,
          email: row.email,
          other: row.other,
          portfolio1: portfolio1,
          portfolio2: portfolio2,
          portfolio3: portfolio3,
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

  getWithdrawRequest: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let verified = req.data.verified;
      let qq = "";
      let type = req.data.type;
      let search = req.data.search ? pool.escape(req.data.search) : "";

      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  u.username like "%" ' + search + ' "%"';
        }
      }
      if (type == "addedon") {
        if (search != "") {
          qq = ' AND  w.created like "%" ' + search + ' "%"';
        }
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;
      let query = await getWithdraw(verified, qq, offset, limit);
      let queryCount = await getWithdrawCount(verified, qq);
      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;

      let output = {
        code: "200",
        msg: query,
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

  getWallet: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let type = req.data.type;
      let search = req.data.search ? pool.escape(req.data.search) : "";

      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  u.username like "%" ' + search + ' "%"';
        }
      }
      if (type == "addedon") {
        if (search != "") {
          qq = ' AND  w.created like "%" ' + search + ' "%"';
        }
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;
      let query = await getWalletList(qq, offset, limit);
      let queryCount = await getWalletListCount(qq);
      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;

      let output = {
        code: "200",
        msg: query,
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

  walletHistory: async function (req, res, next) {
    try {
      let page = req.data.page;
      let fb_id = req.data.fb_id;

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let ru = await getWalletUser(fb_id);
      let query = await getWalletSingle(fb_id, offset, limit);
      let queryCount = await getWalletSingleCount(fb_id);
      let countRec = queryCount.length > 0 ? queryCount[0].count : 0;

      let output = {
        code: "200",
        msg: query,
        total_record: countRec,
        no_of_records_per_page: limit,
        username: ru[0].username,
        first_name: ru[0].first_name,
        last_name: ru[0].last_name,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getDiamond: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let type = req.data.type;
      let search = req.data.search ? pool.escape(req.data.search) : "";

      if (type == "name") {
        if (search != "") {
          qq =
            ' AND  CONCAT(u.first_name, " ", u.last_name) like "%" ' +
            search +
            ' "%"';
        }
      }

      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  u.username like "%" ' + search + ' "%"';
        }
      }
      if (type == "addedon") {
        if (search != "") {
          qq = ' AND  w.created like "%" ' + search + ' "%"';
        }
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let query = await getConvertedDiamond(qq, offset, limit);
      let queryCount = await getConvertedDiamondCount(qq);
      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount.length / limit) : 0;

      let output = {
        code: "200",
        msg: query,
        total_record: countRec,
        no_of_records_per_page: limit,
        total_number: queryCount.length > 0 ? queryCount.length : 0,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
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
  adminAllReferral: async function (req, res, next) {
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

      let q1 = "select code from users where code!='-' " + qq + "";
      let res1 = await getUserCodeList(q1);
      let s = 1;
      let XX = "";
      for (i = 0; i < res1.length; i++) {
        if (s < res1.length) {
          XX += "'" + res1[i].code + "',";
        } else {
          XX += "'" + res1[i].code + "'";
        }
        s++;
      }
      let array_out = [];
      let queryCount = 0;
      let countRec = await referralUserList(XX);
      queryCount = Math.ceil(countRec[0].count / limit);

      if (XX !== "") {
        let log_in_rs = await referralUserListLimit(XX, offset, limit);
        if (log_in_rs.length > 0) {
          for (i = 0; i < log_in_rs.length; i++) {
            let rd = log_in_rs[i];
            let resRef = await referralDetail(rd.referral);
            let rf = resRef[0];
            let get_data = {
              fb_id: rd.fb_id,
              created: rd.created,
              username: "@" + rd.username,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              first_name: rd.first_name,
              last_name: rd.last_name,
              signup_type: rd.signup_type,
              code: rd.code,
              referral: rd.referral,
              r_code: rf.code,
              r_fb_id: rf.fb_id,
              r_username: "@" + rf.username,
              r_profile_pic: customerFunctions.checkProfileURL(rf.profile_pic),
              r_first_name: rf.first_name,
              r_last_name: rf.last_name,
            };
            array_out.push(get_data);
          }
        }
      }

      let output = {
        code: "200",
        msg: array_out,
        no_of_records_per_page: limit,
        total_record: queryCount,
        total_number: countRec[0].count,
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

  admin_show_allFeedback: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let search = req.data.search ? pool.escape(req.data.search) : "";
      if (search != "") {
        qq =
          ' where  (fb_id like "%" ' +
          search +
          ' "%" OR feedback like "%" ' +
          search +
          ' "%" OR username like "%" ' +
          search +
          ' "%" OR star like "%" ' +
          search +
          ' "%")';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let query = await getAllFeedback(qq, offset, limit);
      let query2 = await getAllFeedbackCount(qq);
      let countRec = query2.length > 0 ? Math.ceil(query2[0].count / limit) : 0;

      let array_out1 = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];
        let attach = "";
        if (row.attachment == "-") {
          attach = "-";
        } else {
          attach = customerFunctions.checkVideoUrl(row.attachment);
        }
        let get_data = {
          feed_id: row.feed_id,
          fb_id: row.fb_id,
          username: row.username,
          star: row.star,
          feedback: row.feedback,
          attachment: attach,
          email_mobile: row.email_mobile,
          dated: row.dated,
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

  admin_show_allContest: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let search = req.data.search ? pool.escape(req.data.search) : "";
      if (search != "") {
        qq =
          ' where  (id like "%" ' +
          search +
          ' "%" OR name like "%" ' +
          search +
          ' "%" OR mobile like "%" ' +
          search +
          ' "%" OR insta like "%" ' +
          search +
          ' "%" OR hhid like "%" ' +
          search +
          ' "%" OR type like "%" ' +
          search +
          ' "%")';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let query = await getAllContest(qq, offset, limit);
      let query2 = await getAllContestCount(qq);
      let countRec = query2.length > 0 ? Math.ceil(query2[0].count / limit) : 0;

      let output = {
        code: "200",
        msg: query,
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

  getAllDaysByMonth: async function (req, res, next) {
    try {
      // Query to count total users
      const totalUserQuery = "SELECT count(fb_id) as count FROM users";
      const [totalUserResult] = await sequelize.query(totalUserQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // Query to get count of users created on each day of the current month
      const daysCountQuery = `
            SELECT
                DATE_FORMAT(created, '%Y-%m-%d') AS day,
                COUNT(*) AS counted_leads
            FROM users
            WHERE
                MONTH(created) = MONTH(CURDATE()) AND
                YEAR(created) = YEAR(CURDATE())
            GROUP BY day
            ORDER BY day;
        `;
      const dailyCounts = await sequelize.query(daysCountQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // Map results to desired format
      const nf = new Intl.NumberFormat();
      let total = dailyCounts.reduce((acc, cur) => acc + cur.counted_leads, 0);
      let array_out = dailyCounts.map((item) => ({
        x: moment(item.day).format("MMM Do YY"),
        y: item.counted_leads,
      }));

      // Prepare output
      let output = {
        code: "200",
        totalUser: nf.format(totalUserResult.count),
        total: nf.format(total),
        msg: array_out,
      };

      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e.toString() });
    }
  },

  getAllMonthsByYear: async function (req, res, next) {
    try {
      const year = new Date().getFullYear(); // current year
      const query = `
            SELECT 
                DATE_FORMAT(created, '%m') AS month,
                COUNT(*) AS counted_leads
            FROM users
            WHERE YEAR(created) = ${year}
            GROUP BY DATE_FORMAT(created, '%m')
            ORDER BY DATE_FORMAT(created, '%m');
        `;

      const results = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      const months = [
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
      const nf = new Intl.NumberFormat();
      let total = 0;
      let array_out = months.map((month) => {
        const data = results.find((result) => result.month === month);
        const count = data ? data.counted_leads : 0;
        total += count;

        return {
          x: moment(`${year}-${month}`, "YYYY-MM").format("MMM YY"),
          y: count,
        };
      });

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

  getAllShotsAndClipByYear: async function (req, res, next) {
    try {
      const year = new Date().getFullYear(); // Current year
      const query = `
            SELECT DATE_FORMAT(created, '%b %Y') as x, COUNT(fb_id) as y 
            FROM videos 
            WHERE vtype = :vtype AND YEAR(created) = :year
            GROUP BY MONTH(created)
            ORDER BY MONTH(created);
        `;

      const result = await sequelize.query(query, {
        replacements: { vtype: req.body.vtype, year: year },
        type: Sequelize.QueryTypes.SELECT,
      });

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const data = monthNames.map((month, index) => {
        const item = result.find((r) => r.x.startsWith(month));
        return {
          x: `${month} ${year}`,
          y: item ? item.y : 0,
        };
      });

      const totalVideos = data.reduce((sum, record) => sum + record.y, 0);
      const nf = new Intl.NumberFormat();

      let output = {
        code: "200",
        total: nf.format(totalVideos),
        totalVideos: data,
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
          // console.log(query001);
          // //  for (i = 0; i < query001.length; i++) {
          // //     let r001 = query001[i];
          // //     let AgAr_array = {
          // //       id:r001.id,
          // //       fb_id:r001.fb_id,
          // //       agencyName:r001.agencyName,
          // //       country:r001.country,
          // //       profile_pic:r001.profile_pic
          // //     };
          // //     AgAr.push(AgAr_array);
          // //  }
        } else {
          let query001 = await selectAgencyANDuser(row.fb_id);
          if (query001.length > 0) {
            let r001 = query001[0];
            agencyName = r001.agencyName;
          } else {
            AgAr = await selectAgency();
            // for (i = 0; i < query001.length; i++) {
            //   let r001 = query001[i];
            //   let AgAr_array = {
            //     id:r001.id,
            //     fb_id:r001.fb_id,
            //     agencyName:r001.agencyName,
            //     country:r001.country,
            //     profile_pic:r001.profile_pic
            //   };
            //   AgAr.push(AgAr_array);
            // }
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

  webUploadImage: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.image !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let image = req.image;
        var base64Data = image.split(",")[1]; // split with `,`

        let dirName = moment().format("MMMMYYYY");
        let newPath = "UpLoad/UpLoad/" + dirName;

        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath, {
            recursive: true,
          });
        }

        if (!fs.existsSync(newPath + "/images")) {
          fs.mkdirSync(newPath + "/images", {
            recursive: true,
          });
        }

        let fileName = Date.now() + "_" + uuidv4();
        let file = newPath + "/images/" + fileName + ".png";

        try {
          fs.writeFileSync(file, base64Data, "base64");

          if (process.env.media_storage == "ftp") {
            let createImageFolder = newPath + "/images";
            await CreateDirectoryToFTP(createImageFolder);
            await uploadFileToFTP(file, file);
            fs.unlinkSync(file);
          }

          if (process.env.media_storage == "s3") {
            await uploadToS3(file, file);
            fs.unlinkSync(file);
          }

          let log_in_rs = await usersList(fb_id);
          if (log_in_rs.length > 0) {
            let rd = log_in_rs[0];

            let update =
              "update users SET profile_pic =" +
              pool.escape(imageURl) +
              " WHERE fb_id ='" +
              fb_id +
              "'";
            await reqInsertTimeEventLiveData(update);

            let array_out = {
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(file),
              username: "@" + rd.username,
              verified: rd.verified,
              bio: rd.bio,
              gender: rd.gender,
              category: rd.category,
              code: rd.code,
            };

            let output = {
              code: "200",
              msg: [array_out],
            };
            res.status(200).json(output);
          }
        } catch (err) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing 2" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  uploadImage: async function (req, res, next) {
    try {
      if (
        typeof req.body.fb_id !== "undefined" &&
        typeof req.body.image !== "undefined"
      ) {
        let fb_id = req.body.fb_id;
        let image = req.body.image.file_data;

        let dirName = moment().format("MMMMYYYY");
        let newPath = "UpLoad/UpLoad/" + dirName;

        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath, {
            recursive: true,
          });
        }

        if (!fs.existsSync(newPath + "/images")) {
          fs.mkdirSync(newPath + "/images", {
            recursive: true,
          });
        }

        let imageURl = "";
        if (image) {
          let fileName = Date.now() + "_" + uuidv4();
          imageURl = newPath + "/images/" + fileName + ".png";

          fs.writeFileSync(imageURl, image, "base64");

          if (process.env.media_storage == "ftp") {
            let createImageFolder = newPath + "/images";
            await CreateDirectoryToFTP(createImageFolder);
            await uploadFileToFTP(imageURl, imageURl);
            fs.unlinkSync(imageURl);
          }

          if (process.env.media_storage == "s3") {
            await uploadToS3(imageURl, imageURl);
            fs.unlinkSync(imageURl);
          }

          let log_in_rs = await usersList(fb_id);
          if (log_in_rs.length > 0) {
            let rd = log_in_rs[0];

            let update =
              "update users SET profile_pic =" +
              pool.escape(imageURl) +
              " WHERE fb_id ='" +
              fb_id +
              "'";
            await reqInsertTimeEventLiveData(update);

            let array_out = {
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(imageURl),
              username: "@" + rd.username,
              verified: rd.verified,
              bio: rd.bio,
              gender: rd.gender,
              category: rd.category,
              code: rd.code,
            };
            // console.log(array_out);

            let output = {
              code: "200",
              msg: [array_out],
            };
            res.status(200).json(output);
          }
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing 2" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  admin_all_sounds: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let search = req.data.search ? pool.escape(req.data.search) : "";
      if (search != "") {
        qq =
          ' where  (sound_name like "%" ' +
          search +
          ' "%" OR uploaded_by like "%" ' +
          search +
          ' "%")';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let parameters =
        "select * from sound " +
        qq +
        " order by id DESC limit " +
        offset +
        ", " +
        limit +
        "";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      let parameters1 = "select count(id) as count from sound " + qq + "";
      const queryCount = await sequelize.query(`${parameters1}`, {
        type: sequelize.QueryTypes.SELECT,
      });
      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let get_data = {
          id: row.id,
          sound:
            API_path +
            (await customerFunctions.checkFileExist(
              moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
              row.id + ".aac"
            )),
          sound_name: row.sound_name,
          description: row.description,
          thum: row.thum,
          section: row.section,
          created: row.created,
        };
        array_out.push(get_data);
      }

      let output = {
        code: "200",
        msg: array_out,
        total_record: countRec,
        no_of_records_per_page: limit,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  admin_getSoundSection: async function (req, res, next) {
    try {
      let page = req.data.page;
      let qq = "";
      let search = req.data.search ? pool.escape(req.data.search) : "";
      if (search != "") {
        qq = ' where  (section_name like "%" ' + search + ' "%")';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let parameters = "select * from sound_section " + qq + " order by id ASC";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      let parameters1 =
        "select count(id) as count from sound_section " + qq + "";
      const queryCount = await sequelize.query(`${parameters1}`, {
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      });

      let countRec = queryCount.count;

      let output = {
        code: "200",
        msg: query,
        total_record: countRec,
        no_of_records_per_page: limit,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  sendCommentFromPanel: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;
      let date = moment(req.date).format("Y-MM-DD");
      let work_action = req.work_action;
      let comment = req.comment;
      let str = [];

      if (work_action == "allUser") {
        let parameters =
          "SELECT id,fb_id FROM `videos` where created like '" + date + "%'";
        str = await sequelize.query(`${parameters}`, {
          type: sequelize.QueryTypes.SELECT,
        });
      } else if (work_action == "singleUser") {
        let sfb_id = req.sfb_id;
        let parameters1 =
          "SELECT id,fb_id FROM `videos` where fb_id='" +
          sfb_id +
          "' and  created like '" +
          date +
          "%'";
        str = await sequelize.query(`${parameters1}`, {
          type: sequelize.QueryTypes.SELECT,
        });
      } else {
        let parameters2 =
          "SELECT v.id,v.fb_id FROM videos v, users u where u.fb_id=v.fb_id and u.agency_id='" +
          work_action +
          "' and v.created like '" +
          date +
          "%'";
        str = await sequelize.query(`${parameters2}`, {
          type: sequelize.QueryTypes.SELECT,
        });
      }
      if (str.length > 0) {
        for (i = 0; i < str.length; i++) {
          let a = str[i];
          let qrry_1 =
            "insert into video_comment(video_id,fb_id,comments,created)values(";
          qrry_1 += "'" + a.id + "',";
          qrry_1 += "" + pool.escape(fb_id) + ",";
          qrry_1 += "" + pool.escape(comment) + ",";
          qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);
        }

        let output = {
          code: "200",
          msg: "Comment add successfull",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "200",
          msg: "No video found for comment",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showAllVideosClip_1: async function (req, res, next) {
    try {
      let event_json = req;
      let BLK_USR = "";
      let BLK_USR1 = await getBlockUsers();

      if (BLK_USR1 != "") {
        BLK_USR = " AND fb_id NOT IN (" + BLK_USR1 + ") ";
      }

      // if (typeof event_json.device_id !== "undefined") {
      //   if (event_json.device_id != "") {

      //     let devc_id = event_json.device_id;
      //     let query_2 = "SELECT video_id  from view_view_block where device_id='"+devc_id+"'";
      //     let query_2_main = await sequelize.query(`${query_2}`, {
      //       type: sequelize.QueryTypes.SELECT,
      //     });

      //     if (query_2_main.length > 0) {
      //       let e = 1;
      //       let XXXX = "";

      //       for (i = 0; i < query_2_main.length; i++) {
      //         let v = query_2_main[i];
      //         if (e < query_2_main.length) {
      //           XXXX += "'" + v.video_id + "',";
      //         } else {
      //           XXXX += "'" + v.video_id + "'";
      //         }
      //         e++;
      //       }
      //       NOTINV = XXXX;
      //     }
      //   }
      // }

      let VidID = [];

      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let token = event_json.token;
        let device_id = event_json.device_id;
        let category = event_json.category;
        let type = event_json.type;
        let qq = "";
        if (category != "") {
          qq = " AND category='" + category + "' ";
        }
        let update =
          "update users set tokon=" +
          pool.escape(token) +
          " where fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(update);

        let QStatus = "select * from users where fb_id='" + fb_id + "' ";
        let qs = await sequelize.query(`${QStatus}`, {
          type: sequelize.QueryTypes.SELECT,
        });
        let array_for_you = [];
        let query = [];

        if (typeof event_json.video_id !== "undefined") {
          query = await sequelize.query(
            "select * from videos where id='" +
              event_json.video_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "related") {
          query = await sequelize.query(
            "select * from videos where  AND for_you='1' and vtype='Clip' " +
              qq +
              " order by rand()",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "following") {
          let query123 = await sequelize.query(
            "select * from follow_users where fb_id='" + fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_count_heart = "";
          query123.forEach((row123) => {
            array_out_count_heart += '"' + row123.followed_fb_id + '",';
          });

          array_out_count_heart = array_out_count_heart + "0";

          query = await sequelize.query(
            "select * from videos where  for_you='1' and vtype='Clip' " +
              qq +
              " AND  fb_id IN(" +
              array_out_count_heart +
              ") order by rand()",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else {
          query = await sequelize.query(
            "select * from videos where for_you='1' and vtype='Clip' " +
              qq +
              " order by rand()",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        }

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await usersList(row.fb_id);
          let rd = query1[0];
          let countLikes = await countLike(row.id);
          let countLikes_count = countLikes[0];

          let countLikes_count_ = await getHeart(row.id);

          let countcomment = await commentCount(row.id);
          let countcomment_count = countcomment[0];

          let liked = await videoLikeDislike(row.id, fb_id);
          let liked_count = liked[0];

          // let FollowCountR = await sequelize.query(
          //   "select count(1) as count from follow_users where fb_id='" +
          //     fb_id +
          //     "' AND  followed_fb_id='" +
          //     row.fb_id +
          //     "'",
          //   {
          //     type: sequelize.QueryTypes.SELECT,
          //   }
          // );

          // let FollowCount = FollowCountR[0].count;

          VidID.push(row.id);

          let followStatus = await checkFollowStatus(fb_id, row.fb_id);
          let fStatus = followStatus[0].count == 0 ? false : true;

          let get_data = {
            tag: "trending",
            id: row.id,
            fb_id: row.fb_id,

            user_info: {
              fb_id: rd.fb_id,
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              username: "@" + rd.username,
              verified: rd.verified,
              bio: rd.bio,
              gender: rd.gender,
              category: rd.category,
              marked: rd.marked,
              acceptdiamonds: rd.acceptdiamonds,
            },
            count: {
              like_count: parseInt(countLikes_count.count + countLikes_count_),
              video_comment_count: countcomment_count.count,
              view: parseInt(row.view),
            },
            followStatus: fStatus,
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            description: row.description,
            type: row.type,
            marked: row.marked,
            allowDownload: row.allowDownload,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };

          array_for_you.push(get_data);
        }

        let array_for_you_mark = [];

        if (typeof event_json.video_id !== "undefined") {
          query = await sequelize.query(
            "select * from videos where  id='" +
              event_json.video_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "related") {
          query = await sequelize.query(
            "select * from videos where  AND for_you_mark='1' and vtype='Clip' " +
              qq +
              " order by rand() limit 5",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "following") {
          let query123 = await sequelize.query(
            "select * from follow_users where fb_id='" + fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_count_heart = "";
          query123.forEach((row123) => {
            array_out_count_heart += '"' + row123.followed_fb_id + '",';
          });

          array_out_count_heart = array_out_count_heart + "0";

          query = await sequelize.query(
            "select * from videos where  for_you_mark='1' and vtype='Clip' " +
              qq +
              " AND  fb_id IN(" +
              array_out_count_heart +
              ") order by rand()",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else {
          query = await sequelize.query(
            "select * from videos where for_you_mark='1' and vtype='Clip' " +
              qq +
              " order by rand()",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        }

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await usersList(row.fb_id);
          let rd = query1[0];

          // let query112 = await selectSound(row.sound_id);
          // let rd12 = query112[0];

          let countLikes = await countLike(row.id);
          let countLikes_count = countLikes[0];

          let countLikes_count_ = await getHeart(row.id);

          let countcomment = await commentCount(row.id);
          let countcomment_count = countcomment[0];

          let liked = await videoLikeDislike(row.id, fb_id);
          let liked_count = liked[0];

          // let FollowCountR = await sequelize.query(
          //   "select count(1) as count from follow_users where fb_id='" +
          //     fb_id +
          //     "' AND  followed_fb_id='" +
          //     row.fb_id +
          //     "'",
          //   {
          //     type: sequelize.QueryTypes.SELECT,
          //   }
          // );

          // let FollowCount = FollowCountR[0].count;

          VidID.push(row.id);

          let followStatus = await checkFollowStatus(fb_id, row.fb_id);
          let fStatus = followStatus[0].count == 0 ? false : true;

          let get_data = {
            tag: "regular",
            id: row.id,
            fb_id: row.fb_id,

            user_info: {
              fb_id: rd.fb_id,
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              username: "@" + rd.username,
              verified: rd.verified,
              bio: rd.bio,
              gender: rd.gender,
              category: rd.category,
              marked: rd.marked,
              acceptdiamonds: rd.acceptdiamonds,
            },
            count: {
              like_count: parseInt(countLikes_count.count + countLikes_count_),
              video_comment_count: countcomment_count.count,
              view: parseInt(row.view),
            },
            followStatus: fStatus,
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            description: row.description,
            type: row.type,
            marked: row.marked,
            allowDownload: row.allowDownload,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };

          array_for_you_mark.push(get_data);
        }
        let downBlock = "";

        if (VidID.length > 0) {
          downBlock = "and id NOT IN (" + VidID.join(",") + ")";
        }

        if (typeof event_json.video_id !== "undefined") {
          query = await sequelize.query(
            "select * from videos where  id='" +
              event_json.video_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "following") {
          let query123 = await sequelize.query(
            "select * from follow_users where fb_id='" + fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_count_heart = "";
          query123.forEach((row123) => {
            array_out_count_heart += '"' + row123.followed_fb_id + '",';
          });

          array_out_count_heart = array_out_count_heart + "0";

          query = await sequelize.query(
            "select * from videos where id !='' and vtype='Clip'  " +
              qq +
              " " +
              BLK_USR +
              " " +
              downBlock +
              " AND fb_id IN(" +
              array_out_count_heart +
              ") order by id DESC limit 25",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "related") {
          query = await sequelize.query(
            "select * from videos where id !='' and vtype='Clip' " +
              qq +
              " " +
              BLK_USR +
              " " +
              downBlock +
              " order by id DESC limit 25",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else {
          query = await sequelize.query(
            "select * from videos where id !='' and vtype='Clip'  " +
              qq +
              " " +
              BLK_USR +
              "  " +
              downBlock +
              " order by id DESC limit 25",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        }

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await usersList(row.fb_id);
          let rd = query1[0];

          // let query112 = await selectSound(row.sound_id);
          // let rd12 = query112[0];

          let countLikes = await countLike(row.id);
          let countLikes_count = countLikes[0];

          let countLikes_count_ = await getHeart(row.id);

          let countcomment = await commentCount(row.id);
          let countcomment_count = countcomment[0];

          let liked = await videoLikeDislike(row.id, fb_id);
          let liked_count = liked[0];

          // let FollowCountR = await sequelize.query(
          //   "select count(1) as count from follow_users where fb_id='" +
          //     fb_id +
          //     "' AND  followed_fb_id='" +
          //     row.fb_id +
          //     "'",
          //   {
          //     type: sequelize.QueryTypes.SELECT,
          //   }
          // );

          // let FollowCount = FollowCountR[0].count;

          VidID.push(row.id);

          let followStatus = await checkFollowStatus(fb_id, row.fb_id);
          let fStatus = followStatus[0].count == 0 ? false : true;

          let get_data = {
            tag: "regular",
            id: row.id,
            fb_id: row.fb_id,

            user_info: {
              fb_id: rd.fb_id,
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              username: "@" + rd.username,
              verified: rd.verified,
              bio: rd.bio,
              gender: rd.gender,
              category: rd.category,
              marked: rd.marked,
              acceptdiamonds: rd.acceptdiamonds,
            },
            count: {
              like_count: countLikes_count.count,
              video_comment_count: countcomment_count.count,
              view: parseInt(row.view),
            },
            followStatus: fStatus,
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            description: row.description,
            type: row.type,
            marked: row.marked,
            allowDownload: row.allowDownload,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };

          array_out.push(get_data);
        }
        let merge_array = [];
        if (typeof event_json.video_id !== "undefined") {
          merge_array = [...array_for_you];
        } else {
          merge_array = [...array_for_you, ...array_for_you_mark, ...array_out];
        }

        let arrr = [];
        let iss = 0;

        merge_array.forEach((ar) => {
          if (iss < 25) {
            arrr.push(ar);
          }
          iss++;
        });

        let resEvent = await sequelize.query(
          "SELECT *, concat('" +
            API_path +
            "',image) as image,concat('" +
            API_path +
            "',profile_image) as profile_image  FROM `timeEvent` where `status`='ENABLED' LIMIT 1",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let EventArray = [];
        let liveId = 0;

        if (resEvent.length > 0) {
          let re = resEvent[0];
          let id = re.id;
          EventArray.push(re);

          let resEventJoinCheck = await sequelize.query(
            "SELECT count(eventId) as count FROM `timeEventJoin` where eventId='" +
              id +
              "' and fb_id='" +
              fb_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (resEventJoinCheck[0].count > 0) {
            EventArray.push({ isParticipate: true });
          } else {
            EventArray.push({ isParticipate: false });
          }
        }

        let output = {
          code: "200",
          userStatus: qs.length > 0 ? qs[0].category : "",
          clipUpload: qs.length > 0 ? qs[0].clipUpload : "",
          msg: arrr,
          timeEvent: EventArray,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          userStatus: "-",
          msg: [{ response: "Json Parem are missing" }],
          timeEvent: [],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  All_Reported: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let qq = "";
      let search = req.data.search ? pool.escape(req.data.search) : "";
      if (search != "") {
        qq =
          ' AND  (v.fb_id like "%" ' +
          search +
          ' "%" OR v.vr_id like "%" ' +
          search +
          ' "%" OR v.fb_report_id like "%" ' +
          search +
          ' "%" OR v.message like "%" ' +
          search +
          ' "%" OR u.username like "%" ' +
          search +
          ' "%")';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let parameters =
        "select v.* from video_report v, users u where v.fb_id=u.fb_id AND action='PENDING' AND video_id!='0' " +
        qq +
        " order by v.added_at DESC LIMIT " +
        offset +
        ", " +
        limit +
        "";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      const queryCount = await sequelize.query(
        "select count(v.vr_id) as count from video_report v, users u  where v.fb_id=u.fb_id AND action='PENDING' AND video_id!='0' " +
          qq +
          "",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let countRec = Math.ceil(queryCount[0].count / limit);
      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let vr_id = row.vr_id;
        let fb_id = row.fb_id;
        let fb_report_id = row.fb_report_id;
        let video_id = row.video_id;
        let message = row.message;
        let action = row.action;
        let added_at = row.added_at;

        let r1 = await sequelize.query(
          "select username from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let whose_user = r1.length ? "@" + r1[0].username : "";

        let r2 = await sequelize.query(
          "select * from users where fb_id='" + fb_report_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let who_user = r2.length ? "@" + r2[0].username : "";

        let r3 = await sequelize.query(
          "SELECT * FROM videos where id='" + video_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (r3.length > 0) {
          let rd12 = await sequelize.query(
            "select * from sound where id='" + r3[0].sound_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

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
            vr_id: vr_id,
            fb_id: fb_id,
            whose_user: whose_user,
            fb_report_id: fb_report_id,
            who_user: who_user,
            message: message,
            action: action,
            added_at: added_at,

            video: {
              id: r3[0].id,
              fb_id: r3[0].fb_id,
              video: customerFunctions.checkVideoUrl(r3[0].video),
              thum: customerFunctions.checkVideoUrl(r3[0].thum),
              gif: customerFunctions.checkVideoUrl(r3[0].gif),
              description: r3[0].description,
            },

            sound: SoundObject,
            created: r3[0].created,
          };
          array_out.push(get_data);
        }
      }
      let output = {
        code: "200",
        msg: array_out,
        total_record: countRec,
        no_of_records_per_page: limit,
        total_number: queryCount[0].count,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  All_Reported_user: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let search = req.data.search ? pool.escape(req.data.search) : "";
      let qq = "";

      if (search != "") {
        qq =
          ' AND  fb_id like "%" ' +
          search +
          ' "%" OR vr_id like "%" ' +
          search +
          ' "%" OR fb_report_id like "%" ' +
          search +
          ' "%" OR message like "%" ' +
          search +
          ' "%"';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let parameters =
        "select fb_id,vr_id,fb_report_id,video_id,message,action,added_at from video_report where action='PENDING' AND video_id='0' " +
        qq +
        " order by added_at DESC LIMIT " +
        offset +
        ", " +
        limit +
        "";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      const queryCount = await sequelize.query(
        "select count(vr_id) as count from video_report where action='PENDING' AND video_id='0' " +
          qq +
          "",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let countRec = Math.ceil(queryCount[0].count / limit);
      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let vr_id = row.vr_id;
        let fb_id = row.fb_id;
        let fb_report_id = row.fb_report_id;
        let video_id = row.video_id;
        let message = row.message;
        let action = row.action;
        let added_at = row.added_at;

        let r1 = await sequelize.query(
          "select username,profile_pic from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        let whose_user = r1 ? "@" + r1.username : "";

        let profile_pic = customerFunctions.checkVideoUrl(
          r1 ? r1.profile_pic : ""
        );

        let r2 = await sequelize.query(
          "select * from users where fb_id='" + fb_report_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        let who_user = r2 ? "@" + r2.username : "";

        let get_data = {
          vr_id: vr_id,
          fb_id: fb_id,
          whose_user: whose_user,
          profile_pic: profile_pic,
          fb_report_id: fb_report_id,
          who_user: who_user,
          message: message,
          action: action,
          added_at: added_at,
        };
        array_out.push(get_data);
      }
      let output = {
        code: "200",
        msg: array_out,
        total_record: countRec,
        no_of_records_per_page: limit,
        total_number: queryCount[0].count,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showAllVideos_1: async function (req, res, next) {
    try {
      let event_json = req;
      let followers_video = [];
      let trending_video = [];
      let maximum_like_video = [];
      let latest_like_video = [];
      // let BLK_USR = "";
      // let BLK_USR1 = await getBlockUsers();

      // if (BLK_USR1 != "") {
      //   BLK_USR = " AND videos.fb_id NOT IN (" + BLK_USR1 + ") ";
      // }
      let REPET_VID1 = "";
      let REPET_VID = "";
      if (typeof event_json.device_id !== "undefined") {
        if (event_json.device_id != "") {
          let devc_id = event_json.device_id;
          REPET_VID1 = await blockRepeatVideo(devc_id);
          if (REPET_VID1 != "") {
            REPET_VID = " AND videos.id NOT IN (" + REPET_VID1 + ") ";
          }
        }
      }

      let VidID = [];
      let all_id1 = "";
      let all_id2 = "";
      let all_id3 = "";

      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let token = event_json.token;
        let device_id = event_json.device_id;
        let category = event_json.category;
        let type = event_json.type;
        let qq = "";
        if (category != "") {
          qq = " AND videos.category='" + category + "' ";
        }

        if (fb_id == "") {
          fb_id = null;
        }

        /* -------------------------------------------------- NTU ---------------------------------------------------------------------- */

        let update =
          "update users set tokon=" +
          pool.escape(token) +
          " where fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(update);

        /* ----------------------------------------------------------------------------------------------------------------------------- */

        let QStatus = "select * from users where fb_id='" + fb_id + "' ";
        let qs = await sequelize.query(`${QStatus}`, {
          type: sequelize.QueryTypes.SELECT,
        });

        let query = [];

        if (typeof event_json.video_id !== "undefined") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.id='" +
              event_json.video_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          for (i = 0; i < query.length; i++) {
            let row = query[i];

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            followers_video.push(get_data);
          }
        } else if (type == "related") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.vtype='Short' AND users.block != '1' " +
              qq +
              " AND RAND() < 0.1 LIMIT 20",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            followers_video.push(get_data);
          }
        } else if (type == "following") {
          let query123 = await sequelize.query(
            "SELECT GROUP_CONCAT(followed_fb_id SEPARATOR ',') AS followed_fb_id_list FROM follow_users WHERE fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (query123[0].followed_fb_id_list != "") {
            query = await sequelize.query(
              "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
                "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
                "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
                "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
                "INNER JOIN users ON videos.fb_id = users.fb_id " +
                "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
                "LEFT JOIN sound ON sound.id = videos.sound_id " +
                "WHERE videos.vtype='Short' AND users.block != '1' " +
                qq +
                " AND FIND_IN_SET(videos.fb_id, '" +
                query123[0].followed_fb_id_list +
                "') ORDER BY videos.id DESC LIMIT 20",
              {
                replacements: { fb_id: fb_id },
                type: sequelize.QueryTypes.SELECT,
              }
            );

            for (i = 0; i < query.length; i++) {
              let row = query[i];

              let metaData = await getVideoMetaData(row.id, fb_id);
              let metaData_count = metaData[0];

              VidID.push(row.id);

              let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
                section: row.section,
                created:
                  row.screated != ""
                    ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                    : "",
              };

              let get_data = {
                tag: "regular",
                id: row.id,
                fb_id: row.fb_id,
                user_info: {
                  fb_id: row.fb_id,
                  first_name: row.first_name,
                  last_name: row.last_name,
                  profile_pic: customerFunctions.checkProfileURL(
                    row.profile_pic
                  ),
                  username: "@" + row.username,
                  verified: row.verified,
                  bio: row.bio,
                  gender: row.gender,
                  category: row.ucategory,
                  marked: row.umarked,
                  acceptdiamonds: row.acceptdiamonds,
                },
                count: {
                  like_count: parseInt(
                    metaData_count.like_dislike_count + row.fake_like
                  ),
                  video_comment_count: parseInt(metaData_count.comment_count),
                  view: parseInt(row.view),
                },
                followStatus: fStatus,
                liked: parseInt(metaData_count.user_like_dislike_count),
                video: customerFunctions.checkVideoUrl(row.video),
                thum: customerFunctions.checkVideoUrl(row.thum),
                gif: customerFunctions.checkVideoUrl(row.gif),
                category: row.vcategory,
                description: row.description,
                type: row.type,
                marked: row.vmarked,
                sound: SoundObject,
                created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
              };
              followers_video.push(get_data);
            }
          }
        } else {
          // ****** Followers Video Start ****** //

          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.vtype='Short' AND users.block != '1' " +
              qq +
              " " +
              REPET_VID +
              " ORDER BY videos.id DESC LIMIT 20",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            all_id1 += row.id + ",";

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            followers_video.push(get_data);
          }

          // ****** Trending Video Start ****** //

          let all_id1_VID = "";
          let all_id1_replace = all_id1.replace(/,*$/, "");

          if (all_id1 != "") {
            all_id1_VID = " AND videos.id NOT IN (" + all_id1_replace + ") ";
          }

          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.for_you='1' AND videos.vtype='Short' AND users.block != '1' " +
              qq +
              " " +
              all_id1_VID +
              " " +
              REPET_VID +
              " ORDER BY videos.id DESC LIMIT 10",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];
            all_id2 += row.id + ",";

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "trending",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            trending_video.push(get_data);
          }

          // ****** Maximum Like Video Start ****** //

          let all_id2_VID = "";
          all_id2 = all_id1 + all_id2;
          let all_id2_replace = all_id2.replace(/,*$/, "");

          if (all_id2 != "") {
            all_id2_VID = " AND videos.id NOT IN (" + all_id2_replace + ") ";
          }

          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.vtype='Short' AND users.block != '1' " +
              qq +
              " " +
              all_id2_VID +
              " " +
              REPET_VID +
              " ORDER BY videos.fake_like DESC LIMIT 10",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            all_id3 += row.id + ",";

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            maximum_like_video.push(get_data);
          }

          // let all_id3_VID = "";

          // all_id3 = all_id1 + all_id2 + all_id3;

          // let all_id3_replace = all_id3.replace(/,*$/, "");

          // if (all_id3 != "") {
          //   all_id3_VID = " AND videos.id NOT IN (" + all_id3_replace + ") ";
          // }

          // // ****** Latest Video Start ****** //

          // query = await sequelize.query(
          //   "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
          //   "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, "+
          //   "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
          //   "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos "+
          //   "INNER JOIN users ON videos.fb_id = users.fb_id "+
          //   "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = " + fb_id + " " +
          //   "LEFT JOIN sound ON sound.id = videos.sound_id " +
          //   "WHERE videos.vtype='Short' AND users.block != '1' " +
          //   qq +
          //   " " +
          //   all_id3_VID +
          //   " ORDER BY videos.id DESC LIMIT 10",
          //   {
          //     type: sequelize.QueryTypes.SELECT,
          //   }
          // );

          // for (i = 0; i < query.length; i++) {
          //   let row = query[i];

          //   let metaData = await getVideoMetaData(row.id, fb_id);
          //   let metaData_count = metaData[0];

          //   VidID.push(row.id);

          //   let fStatus = parseInt(row.is_followed) == 0 ? false : true;

          //   let SoundObject = {
          //     id: row.sid,
          //     audio_path: {
          //       mp3: (row.screated != '') ?
          //             API_path +
          //             (await customerFunctions.checkFileExist(
          //               moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
          //               row.sid + ".mp3"
          //             )) : '',
          //       acc: (row.screated != '') ?
          //             API_path +
          //             (await customerFunctions.checkFileExist(
          //               moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
          //               row.sid + ".aac"
          //             )) : '',
          //     },
          //     sound_name: row.sound_name,
          //     description: row.sdescription,
          //     thum: row.sthum,
          //     section: row.section,
          //     created: (row.screated != '') ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss") : '',
          //   };

          //   let get_data = {
          //     tag: "regular",
          //     id: row.id,
          //     fb_id: row.fb_id,
          //     user_info: {
          //       fb_id: row.fb_id,
          //       first_name: row.first_name,
          //       last_name: row.last_name,
          //       profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
          //       username: "@" + row.username,
          //       verified: row.verified,
          //       bio: row.bio,
          //       gender: row.gender,
          //       category: row.ucategory,
          //       marked: row.umarked,
          //       acceptdiamonds: row.acceptdiamonds,
          //     },
          //     count: {
          //       like_count: parseInt(metaData_count.like_dislike_count + row.fake_like),
          //       video_comment_count: parseInt(metaData_count.comment_count),
          //       view: parseInt(row.view),
          //     },
          //     followStatus: fStatus,
          //     liked: parseInt(metaData_count.user_like_dislike_count),
          //     video: customerFunctions.checkVideoUrl(row.video),
          //     thum: customerFunctions.checkVideoUrl(row.thum),
          //     gif: customerFunctions.checkVideoUrl(row.gif),
          //     category: row.vcategory,
          //     description: row.description,
          //     type: row.type,
          //     marked: row.vmarked,
          //     sound: SoundObject,
          //     created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          //   };
          //   latest_like_video.push(get_data);
          // }
        }

        let merge_array = [
          ...trending_video,
          ...followers_video,
          ...maximum_like_video,
        ];

        let resEvent = await sequelize.query(
          "SELECT *, concat('" +
            API_path +
            "',image) as image,concat('" +
            API_path +
            "',profile_image) as profile_image  FROM `timeEvent` where `status`='ENABLED' LIMIT 1",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let EventArray = [];
        let liveId = 0;

        if (resEvent.length > 0) {
          let re = resEvent[0];
          let id = re.id;
          EventArray.push(re);

          let resEventJoinCheck = await sequelize.query(
            "SELECT count(eventId) as count FROM `timeEventJoin` where eventId='" +
              id +
              "' and fb_id='" +
              fb_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (resEventJoinCheck[0].count > 0) {
            EventArray.push({ isParticipate: true });
          } else {
            EventArray.push({ isParticipate: false });
          }
        }

        let output = {
          code: "200",
          userStatus: qs.length > 0 ? qs[0].category : "",
          clipUpload: qs.length > 0 ? qs[0].clipUpload : "",
          msg: merge_array,
          timeEvent: EventArray,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          userStatus: "-",
          msg: [{ response: "Json Parem are missing" }],
          timeEvent: [],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showMyAllVideos: async function (req, res, next) {
    try {
      let event_json = req;
      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.my_fb_id !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let my_fb_id = event_json.my_fb_id;

        let query1 = await sequelize.query(
          "select * from users where fb_id= :fb_id",
          {
            replacements: { fb_id: fb_id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (query1.length > 0) {
          let rd = query1;

          let page = 1;
          let limit = 100;
          let offset = (page - 1) * limit;
          let countRec = 0;

          if (typeof event_json.pageNo !== "undefined") {
            page = event_json.pageNo;
            limit = 30;
            offset = (page - 1) * limit;

            let queryCount = await sequelize.query(
              "select count(id) as count from videos where vtype='Short' and fb_id= :fb_id",
              {
                replacements: { fb_id: fb_id },
                type: sequelize.QueryTypes.SELECT,
              }
            );
            countRec = queryCount[0].count;
          }

          let query = await sequelize.query(
            "select * from videos where vtype='Short' and fb_id= :fb_id order by id DESC LIMIT :offset, :limit",
            {
              replacements: { fb_id: fb_id, offset: offset, limit: limit },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_video = [];

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let tag = "regular";
            if (row.for_you == "1") {
              tag = "trending";
            }

            let get_data = {
              tag: tag,
              id: row.id,
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            array_out_video.push(get_data);
          }

          let query123 = await sequelize.query(
            "select GROUP_CONCAT(id) AS id_list, SUM(fake_like) as flike from videos where vtype='Short' and fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let array_out_count_heart = query123[0].id_list;
          let countLikes_count_ = query123[0].flike;

          let hear_count1 = await sequelize.query(
            "SELECT count(1) as count from video_like_dislike where video_id IN(:array_out_count_heart)",
            {
              replacements: { array_out_count_heart: array_out_count_heart },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let hear_count = hear_count1[0].count;

          let total_fans1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where followed_fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let total_fans = total_fans1[0].count;

          let total_following1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let total_following = total_following1[0].count;

          let count_video_rows = array_out_video.length;
          if (count_video_rows == "0") {
            array_out_video = [];
          }

          let query2 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id= :my_fb_id AND followed_fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id, my_fb_id: my_fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let follow_count = query2[0].count;
          let follow = "";
          let follow_button_status = "";

          if (follow_count == "0") {
            follow = "0";
            follow_button_status = "Follow";
          } else if (follow_count != "0") {
            follow = "1";
            follow_button_status = "Unfollow";
          }

          let array_out = [
            {
              fb_id: fb_id,

              user_info: {
                fb_id: rd[0].fb_id,
                first_name: rd[0].first_name,
                last_name: rd[0].last_name,
                profile_pic: customerFunctions.checkProfileURL(
                  rd[0].profile_pic
                ),
                category: rd[0].category,
                created: moment(rd[0].created).format("YYYY-MM-DD HH:mm:ss"),
                username: "@" + rd[0].username,
                verified: rd[0].verified,
                bio: rd[0].bio,
                gender: rd[0].gender,
                marked: rd[0].marked,
                acceptdiamonds: rd[0].acceptdiamonds,
              },

              follow_Status: {
                follow: follow,
                follow_status_button: follow_button_status,
              },

              total_heart: parseInt(hear_count + countLikes_count_),
              total_fans: total_fans,
              total_following: total_following,
              user_videos: array_out_video,
              total_record_count: countRec,
              per_page_limit: limit,
            },
          ];

          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing6" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  updateVideoView: async function (req, res, next) {
    try {
      if (typeof req.id !== "undefined") {
        let event_json = req;

        let id = event_json.id;
        let device_id = event_json.device_id;
        let fb_id = event_json.fb_id;

        let update = "update videos SET view = view+1 WHERE id ='" + id + "'";
        await reqInsertTimeEventLiveData(update);

        let qrry_1 =
          "insert into view_view_block(`video_id`,  `device_id`, `fb_id`, `dated`)values(";
        qrry_1 += "'" + id + "',";
        qrry_1 += "" + pool.escape(device_id) + ",";
        qrry_1 += "" + pool.escape(fb_id) + ",";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);

        let resEvent = await sequelize.query(
          "SELECT *, concat('" +
            API_path +
            "',image) as image,concat('" +
            API_path +
            "',profile_image) as profile_image  FROM `timeEvent` where `status`='ENABLED' LIMIT 1",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let EventArray = [];

        if (resEvent.length > 0) {
          let re = resEvent[0];
          let id = re.id;
          EventArray.push(re);

          let resEventJoinCheck = await sequelize.query(
            "SELECT count(eventId) as count FROM `timeEventJoin` where eventId='" +
              id +
              "' and fb_id='" +
              fb_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (resEventJoinCheck[0].count > 0) {
            EventArray.push({ isParticipate: true });
          } else {
            EventArray.push({ isParticipate: false });
          }
        }

        let output = {
          code: "200",
          msg: [{ response: "success" }],
          TimeEvent: EventArray,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing7" }],
          TimeEvent: [],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showAllImage_1: async function (req, res, next) {
    try {
      let event_json = req;
      // let BLK_USR = "";
      // let BLK_USR1 = await getBlockUsers();

      // if (BLK_USR1 != "") {
      //   BLK_USR = " AND fb_id NOT IN (" + BLK_USR1 + ") ";
      // }
      let REPET_VID1 = "";
      let REPET_VID = "";
      if (typeof event_json.device_id !== "undefined") {
        if (event_json.device_id != "") {
          let devc_id = event_json.device_id;
          REPET_VID1 = await blockRepeatVideo(devc_id);
          if (REPET_VID1 != "") {
            REPET_VID = " AND videos.id NOT IN (" + REPET_VID1 + ") ";
          }
        }
      }

      let VidID = [];

      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let token = event_json.token;
        let device_id = event_json.device_id;
        let category = event_json.category;
        let type = event_json.type;
        let qq = "";
        if (category != "") {
          qq = " AND category='" + category + "' ";
        }

        if (fb_id == "") {
          fb_id = null;
        }

        let update =
          "update users set tokon=" +
          pool.escape(token) +
          " where fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(update);

        let QStatus = "select * from users where fb_id='" + fb_id + "' ";
        let qs = await sequelize.query(`${QStatus}`, {
          type: sequelize.QueryTypes.SELECT,
        });
        let array_for_you = [];
        let query = [];

        if (typeof event_json.video_id !== "undefined") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id WHERE videos.id='" +
              event_json.video_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "related") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = " +
              fb_id +
              " " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE (videos.vtype='Image') AND (videos.for_you='1' OR videos.for_you_mark='1') AND users.block != '1' " +
              qq +
              " " +
              REPET_VID +
              " AND RAND() < 0.1 LIMIT 5",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "following") {
          let query123 = await sequelize.query(
            "SELECT GROUP_CONCAT(followed_fb_id SEPARATOR ',') AS followed_fb_id_list FROM follow_users WHERE fb_id=" +
              fb_id,
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (query123[0].followed_fb_id_list != "") {
            query = await sequelize.query(
              "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
                "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
                "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
                "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
                "INNER JOIN users ON videos.fb_id = users.fb_id " +
                "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = " +
                fb_id +
                " " +
                "LEFT JOIN sound ON sound.id = videos.sound_id " +
                "WHERE (videos.vtype='Image') AND (videos.for_you='1' OR videos.for_you_mark='1') AND users.block != '1' " +
                qq +
                " " +
                REPET_VID +
                " AND FIND_IN_SET(videos.fb_id, '" +
                query123[0].followed_fb_id_list +
                "') AND RAND() < 0.1 LIMIT 5",
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
          }
        } else {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = " +
              fb_id +
              " " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE (videos.vtype='Image') AND (videos.for_you='1' OR videos.for_you_mark='1') AND users.block != '1' " +
              qq +
              " " +
              REPET_VID +
              " AND RAND() < 0.1 LIMIT 5",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        }

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let metaData = await getVideoMetaData(row.id, fb_id);
          let metaData_count = metaData[0];

          VidID.push(row.id);

          let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
            section: row.section,
            created:
              row.screated != ""
                ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                : "",
          };

          let get_data = {
            tag: "regular",
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              fb_id: row.fb_id,
              first_name: row.first_name,
              last_name: row.last_name,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              username: "@" + row.username,
              verified: row.verified,
              bio: row.bio,
              gender: row.gender,
              category: row.ucategory,
              marked: row.umarked,
              acceptdiamonds: row.acceptdiamonds,
            },
            count: {
              like_count: parseInt(
                metaData_count.like_dislike_count + row.fake_like
              ),
              video_comment_count: parseInt(metaData_count.comment_count),
              view: parseInt(row.view),
            },
            followStatus: fStatus,
            liked: parseInt(metaData_count.user_like_dislike_count),
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.vcategory,
            description: row.description,
            type: row.type,
            marked: row.vmarked,
            sound: SoundObject,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
          array_for_you.push(get_data);
        }

        let downBlock = "";

        if (VidID.length > 0) {
          downBlock = "and videos.id NOT IN (" + VidID.join(",") + ")";
        }

        if (typeof event_json.video_id !== "undefined") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id WHERE videos.id='" +
              event_json.video_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else if (type == "following") {
          let query123 = await sequelize.query(
            "SELECT GROUP_CONCAT(followed_fb_id SEPARATOR ',') AS followed_fb_id_list FROM follow_users WHERE fb_id=" +
              fb_id,
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (query123[0].followed_fb_id_list != "") {
            query = await sequelize.query(
              "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
                "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
                "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
                "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
                "INNER JOIN users ON videos.fb_id = users.fb_id " +
                "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = " +
                fb_id +
                " " +
                "LEFT JOIN sound ON sound.id = videos.sound_id " +
                "WHERE videos.vtype='Image' AND videos.id !='' AND users.block != '1' " +
                qq +
                " " +
                REPET_VID +
                " " +
                downBlock +
                " AND FIND_IN_SET(videos.fb_id, '" +
                query123[0].followed_fb_id_list +
                "') AND RAND() < 0.1 LIMIT 25",
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
          }
        } else if (type == "related") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = " +
              fb_id +
              " " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.vtype='Image' AND videos.id !='' AND users.block != '1' " +
              qq +
              " " +
              REPET_VID +
              " " +
              downBlock +
              " AND RAND() < 0.1 LIMIT 25",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        } else {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = " +
              fb_id +
              " " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.vtype='Image' AND videos.id !='' AND users.block != '1' " +
              qq +
              " " +
              REPET_VID +
              " " +
              downBlock +
              " AND RAND() < 0.1 LIMIT 25",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        }

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let metaData = await getVideoMetaData(row.id, fb_id);
          let metaData_count = metaData[0];

          VidID.push(row.id);

          let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
            section: row.section,
            created:
              row.screated != ""
                ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                : "",
          };

          let get_data = {
            tag: "regular",
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              fb_id: row.fb_id,
              first_name: row.first_name,
              last_name: row.last_name,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              username: "@" + row.username,
              verified: row.verified,
              bio: row.bio,
              gender: row.gender,
              category: row.ucategory,
              marked: row.umarked,
              acceptdiamonds: row.acceptdiamonds,
            },
            count: {
              like_count: parseInt(
                metaData_count.like_dislike_count + row.fake_like
              ),
              video_comment_count: parseInt(metaData_count.comment_count),
              view: parseInt(row.view),
            },
            followStatus: fStatus,
            liked: parseInt(metaData_count.user_like_dislike_count),
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.vcategory,
            description: row.description,
            type: row.type,
            marked: row.vmarked,
            sound: SoundObject,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
          array_out.push(get_data);
        }
        let merge_array = [];
        if (typeof event_json.video_id !== "undefined") {
          merge_array = [...array_for_you];
        } else {
          merge_array = [...array_for_you, ...array_out];
        }

        let arrr = [];
        let iss = 0;

        merge_array.forEach((ar) => {
          if (iss < 25) {
            arrr.push(ar);
          }
          iss++;
        });

        let resEvent = await sequelize.query(
          "SELECT *, concat('" +
            API_path +
            "',image) as image,concat('" +
            API_path +
            "',profile_image) as profile_image  FROM `timeEvent` where `status`='ENABLED' LIMIT 1",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let EventArray = [];
        let liveId = 0;

        if (resEvent.length > 0) {
          let re = resEvent[0];
          let id = re.id;
          EventArray.push(re);

          let resEventJoinCheck = await sequelize.query(
            "SELECT count(eventId) as count FROM `timeEventJoin` where eventId='" +
              id +
              "' and fb_id='" +
              fb_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (resEventJoinCheck[0].count > 0) {
            EventArray.push({ isParticipate: true });
          } else {
            EventArray.push({ isParticipate: false });
          }
        }

        let output = {
          code: "200",
          userStatus: qs.length > 0 ? qs[0].category : "",
          clipUpload: qs.length > 0 ? qs[0].clipUpload : "",
          msg: arrr,
          timeEvent: EventArray,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          userStatus: "-",
          msg: [{ response: "Json Parem are missing" }],
          timeEvent: [],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getMarkUserProfile: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;

      let query = await sequelize.query(
        "select * from users where marked='1'",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let qry1 = await sequelize.query(
          "SELECT count(fb_id) as count FROM `follow_users` where fb_id='" +
            fb_id +
            "' AND followed_fb_id='" +
            row.fb_id +
            "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        let follow_status1 = 0;

        if (qry1.count > 0) {
          follow_status1 = 1;
        }

        let get_data = {
          fb_id: row.fb_id,
          username: row.username,
          verified: row.verified,
          first_name: row.first_name,
          last_name: row.last_name,
          profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
          follow_status: follow_status1,
        };
        array_out.push(get_data);
      }
      let output = {
        code: "200",
        data: array_out,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  search: async function (req, res, next) {
    try {
      let event_json = req;
      let type = event_json.type;
      let keyword = event_json.keyword;
      let fb_id = event_json.fb_id;

      if (type == "video") {
        query = await sequelize.query(
          "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
            "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
            "COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
            "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
            "INNER JOIN users ON videos.fb_id = users.fb_id " +
            "LEFT JOIN sound ON sound.id = videos.sound_id " +
            "WHERE videos.description like '%" +
            keyword +
            "%' order by rand() limit 25",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let metaData = await getVideoMetaData(row.id, fb_id);
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
            section: row.section,
            created:
              row.screated != ""
                ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                : "",
          };

          let get_data = {
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              first_name: row.first_name,
              last_name: row.last_name,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              username: "@" + row.username,
              verified: row.verified,
            },
            count: {
              like_count: parseInt(
                metaData_count.like_dislike_count + row.fake_like
              ),
              video_comment_count: parseInt(metaData_count.comment_count),
              view: parseInt(row.view),
            },
            liked: parseInt(metaData_count.user_like_dislike_count),
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.vcategory,
            marked: row.vmarked,
            description: row.description,
            type: row.type,
            sound: SoundObject,
          };
          array_out.push(get_data);
        }

        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      }

      if (type == "users") {
        let query = await sequelize.query(
          "select * from users where (first_name like '%" +
            keyword +
            "%' or last_name like '%" +
            keyword +
            "%' or username like '%" +
            keyword +
            "%' ) AND block='0' order by verified DESC",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await sequelize.query(
            "select count(id) as count from videos where fb_id='" +
              row.fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let videoCount = query1[0].count;

          let get_data = {
            fb_id: row.fb_id,
            username: "@" + row.username,
            verified: row.verified,
            first_name: row.first_name,
            last_name: row.last_name,
            gender: row.gender,
            profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
            block: row.block,
            version: row.version,
            device: row.device,
            signup_type: row.signup_type,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            videos: videoCount,
          };

          array_out.push(get_data);
        }

        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      }

      if (type == "sound") {
        let query = await sequelize.query(
          "select * from sound where sound_name like '%" +
            keyword +
            "%' or description like '%" +
            keyword +
            "%'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await sequelize.query(
            "select count(id) as count from fav_sound WHERE fb_id='" +
              fb_id +
              "' and sound_id ='" +
              row.id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let CountFav = query1[0].count;

          let get_data = {
            id: row.id,
            audio_path: {
              mp3:
                API_path +
                (await customerFunctions.checkFileExist(
                  moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
                  row.id + ".mp3"
                )),
              acc:
                API_path +
                (await customerFunctions.checkFileExist(
                  moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
                  row.id + ".aac"
                )),
            },

            sound_name: row.sound_name,
            description: row.description,
            section: row.section,
            thum: API_path + "/" + row.thum,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            fav: CountFav,
          };

          array_out.push(get_data);
        }

        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showMyAllImage: async function (req, res, next) {
    try {
      let event_json = req;
      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.my_fb_id !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let my_fb_id = event_json.my_fb_id;

        let query1 = await sequelize.query(
          "select * from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (query1.length > 0) {
          let rd = query1;

          let page = 1;
          let limit = 400;
          let offset = (page - 1) * limit;
          let countRec = 0;

          if (typeof event_json.pageNo !== "undefined") {
            page = event_json.pageNo;
            limit = 30;
            offset = (page - 1) * limit;

            let queryCount = await sequelize.query(
              "select count(id) as count from videos where vtype='Image' and fb_id='" +
                fb_id +
                "'",
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
            countRec = queryCount[0].count;
          }

          let query = await sequelize.query(
            "select * from videos where vtype='Image' and fb_id='" +
              fb_id +
              "' order by id DESC LIMIT " +
              offset +
              ", " +
              limit +
              "",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_video = [];

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            // let query112 = await selectSound(row.sound_id);
            // let rd12 = query112;

            let countLikes = await countLike(row.id);
            let countLikes_count = countLikes[0];

            let countLikes_count_ = await getHeart(row.id);

            let countcomment = await commentCount(row.id);
            let countcomment_count = countcomment[0];

            let liked = await videoLikeDislike(row.id, my_fb_id);
            let liked_count = liked[0];

            // let FollowCountR = await sequelize.query(
            //   "select count(1) as count from follow_users where fb_id='" +
            //     fb_id +
            //     "' AND  followed_fb_id='" +
            //     row.fb_id +
            //     "'",
            //   {
            //     type: sequelize.QueryTypes.SELECT,
            //   }
            // );

            // let FollowCount = FollowCountR[0].count;

            let followStatus = await checkFollowStatus(fb_id, row.fb_id);
            let fStatus = followStatus[0].count == 0 ? false : true;
            let tag = "regular";
            if (row.for_you == "1") {
              tag = "trending";
            }

            let get_data = {
              tag: tag,
              id: row.id,
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.category,
              description: row.description,
              type: row.type,
              marked: row.marked,
              followStatus: fStatus,
              liked: liked_count.count,

              count: {
                like_count: parseInt(
                  countLikes_count.count + countLikes_count_
                ),
                video_comment_count: countcomment_count.count,
                view: parseInt(row.view),
              },
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };

            array_out_video.push(get_data);
          }

          let query123 = await sequelize.query(
            "select id from videos where vtype='Image' and fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let array_out_count_heart = "";

          query123.forEach((element) => {
            array_out_count_heart += element.id + ",";
          });
          array_out_count_heart = array_out_count_heart + "0";

          let hear_count1 = await sequelize.query(
            "SELECT count(1) as count from video_like_dislike where video_id IN(" +
              array_out_count_heart +
              ")",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let hear_count = hear_count1[0].count;

          let countLikes_count_ = await getHeart(array_out_count_heart);

          let total_fans1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where followed_fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let total_fans = total_fans1[0].count;

          let total_following1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let total_following = total_following1[0].count;

          let count_video_rows = array_out_video.length;
          if (count_video_rows == "0") {
            array_out_video = [];
          }

          let query2 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id='" +
              my_fb_id +
              "' and followed_fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let follow_count = query2[0].count;
          let follow = "";
          let follow_button_status = "";

          if (follow_count == "0") {
            follow = "0";
            follow_button_status = "Follow";
          } else if (follow_count != "0") {
            follow = "1";
            follow_button_status = "Unfollow";
          }

          let array_out = [
            {
              fb_id: fb_id,

              user_info: {
                fb_id: rd[0].fb_id,
                first_name: rd[0].first_name,
                last_name: rd[0].last_name,
                profile_pic: customerFunctions.checkProfileURL(
                  rd[0].profile_pic
                ),
                category: rd[0].category,
                created: moment(rd[0].created).format("YYYY-MM-DD HH:mm:ss"),
                username: "@" + rd[0].username,
                verified: rd[0].verified,
                bio: rd[0].bio,
                gender: rd[0].gender,
                marked: rd[0].marked,
                acceptdiamonds: rd[0].acceptdiamonds,
              },

              follow_Status: {
                follow: follow,
                follow_status_button: follow_button_status,
              },

              total_heart: hear_count,
              total_fans: total_fans,
              total_following: total_following,
              user_videos: array_out_video,
              total_record_count: countRec,
              per_page_limit: limit,
            },
          ];

          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing6" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showMyAllVideosClip: async function (req, res, next) {
    try {
      let event_json = req;
      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.my_fb_id !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let my_fb_id = event_json.my_fb_id;

        let query1 = await sequelize.query(
          "select * from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (query1.length > 0) {
          let rd = query1;

          let page = 1;
          let limit = 400;
          let offset = (page - 1) * limit;
          let countRec = 0;

          if (typeof event_json.pageNo !== "undefined") {
            page = event_json.pageNo;
            limit = 30;
            offset = (page - 1) * limit;

            let queryCount = await sequelize.query(
              "select count(id) as count from videos where vtype='Clip' and fb_id='" +
                fb_id +
                "'",
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );
            countRec = queryCount[0].count;
          }

          let query = await sequelize.query(
            "select * from videos where vtype='Clip' and fb_id='" +
              fb_id +
              "' order by id DESC LIMIT " +
              offset +
              ", " +
              limit +
              "",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_video = [];

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            // let query112 = await selectSound(row.sound_id);
            // let rd12 = query112;

            let countLikes = await countLike(row.id);
            let countLikes_count = countLikes[0];

            let countLikes_count_ = await getHeart(row.id);

            let countcomment = await commentCount(row.id);
            let countcomment_count = countcomment[0];

            let liked = await videoLikeDislike(row.id, my_fb_id);
            let liked_count = liked[0];

            // let FollowCountR = await sequelize.query(
            //   "select count(1) as count from follow_users where fb_id='" +
            //     fb_id +
            //     "' AND  followed_fb_id='" +
            //     row.fb_id +
            //     "'",
            //   {
            //     type: sequelize.QueryTypes.SELECT,
            //   }
            // );

            // let FollowCount = FollowCountR[0].count;

            let followStatus = await checkFollowStatus(fb_id, row.fb_id);
            let fStatus = followStatus[0].count == 0 ? false : true;
            let tag = "regular";
            if (row.for_you == "1") {
              tag = "trending";
            }

            let get_data = {
              tag: tag,
              id: row.id,
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.category,
              description: row.description,
              type: row.type,
              marked: row.marked,
              followStatus: fStatus,
              liked: liked_count.count,

              count: {
                like_count: parseInt(
                  countLikes_count.count + countLikes_count_
                ),
                video_comment_count: countcomment_count.count,
                view: parseInt(row.view),
              },
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };

            array_out_video.push(get_data);
          }

          let query123 = await sequelize.query(
            "select id from videos where vtype='Clip' and fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let array_out_count_heart = "";

          query123.forEach((element) => {
            array_out_count_heart += element.id + ",";
          });
          array_out_count_heart = array_out_count_heart + "0";

          let hear_count1 = await sequelize.query(
            "SELECT count(1) as count from video_like_dislike where video_id IN(" +
              array_out_count_heart +
              ")",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let hear_count = hear_count1[0].count;

          let countLikes_count_ = await getHeart(array_out_count_heart);

          let total_fans1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where followed_fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let total_fans = total_fans1[0].count;

          let total_following1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let total_following = total_following1[0].count;

          let count_video_rows = array_out_video.length;
          if (count_video_rows == "0") {
            array_out_video = [];
          }

          let query2 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id='" +
              my_fb_id +
              "' and followed_fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let follow_count = query2[0].count;
          let follow = "";
          let follow_button_status = "";

          if (follow_count == "0") {
            follow = "0";
            follow_button_status = "Follow";
          } else if (follow_count != "0") {
            follow = "1";
            follow_button_status = "Unfollow";
          }

          let array_out = [
            {
              fb_id: fb_id,

              user_info: {
                fb_id: rd[0].fb_id,
                first_name: rd[0].first_name,
                last_name: rd[0].last_name,
                profile_pic: customerFunctions.checkProfileURL(
                  rd[0].profile_pic
                ),
                category: rd[0].category,
                created: moment(rd[0].created).format("YYYY-MM-DD HH:mm:ss"),
                username: "@" + rd[0].username,
                verified: rd[0].verified,
                bio: rd[0].bio,
                gender: rd[0].gender,
                marked: rd[0].marked,
                acceptdiamonds: rd[0].acceptdiamonds,
              },

              follow_Status: {
                follow: follow,
                follow_status_button: follow_button_status,
              },

              total_heart: hear_count,
              total_fans: total_fans,
              total_following: total_following,
              user_videos: array_out_video,
              total_record_count: countRec,
              per_page_limit: limit,
            },
          ];

          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing6" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  get_followings_user_s_user: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.my_fb_id !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let myfb_id = req.my_fb_id;

        let query = await sequelize.query(
          "select * from follow_users where fb_id='" +
            fb_id +
            "' order by id DESC",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let rd1 = await sequelize.query(
            "select * from users where fb_id='" + row.followed_fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (rd1.length > 0) {
            let follow_count = await sequelize.query(
              "SELECT count(*) as count from follow_users where fb_id='" +
                myfb_id +
                "' and followed_fb_id='" +
                row.followed_fb_id +
                "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let follow = "";
            let follow_button_status = "";

            if (follow_count.count == "0") {
              follow = "0";
              follow_button_status = "Follow";
            } else if (follow_count.count != "0") {
              follow = "1";
              follow_button_status = "Unfollow";
            }

            let sub_array = {
              fb_id: rd1[0].fb_id,
              username: "@" + rd1[0].username,
              verified: rd1[0].verified,
              first_name: rd1[0].first_name,
              last_name: rd1[0].last_name,
              gender: rd1[0].gender,
              bio: rd1[0].bio,
              profile_pic: customerFunctions.checkProfileURL(
                rd1[0].profile_pic
              ),
              created: moment(rd1[0].created).format("YYYY-MM-DD HH:mm:ss"),
              marked: rd1[0].marked,
              follow_Status: {
                follow: follow,
                follow_status_button: follow_button_status,
              },
            };
            array_out.push(sub_array);
          }
        }
        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  my_liked_video: async function (req, res, next) {
    try {
      let event_json = req;

      let page = 1;
      let limit = 10;
      let offset = (page - 1) * limit;

      if (typeof event_json.pageNo !== "undefined") {
        page = event_json.pageNo;
        limit = 10;
        offset = (page - 1) * limit;
      }

      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.my_fb_id !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let my_fb_id = event_json.my_fb_id;

        let query123 = await sequelize.query(
          "select * from videos where fb_id='" + fb_id + "' and vtype='Short'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let array_out_count_heart = "";

        query123.forEach((element) => {
          array_out_count_heart += element.id + ",";
        });
        array_out_count_heart = array_out_count_heart + "0";

        let hear_count1 = await sequelize.query(
          "SELECT count(1) as count from video_like_dislike where video_id IN(" +
            array_out_count_heart +
            ")",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let hear_count = hear_count1[0].count;

        let total_fans1 = await sequelize.query(
          "SELECT count(1) as count from follow_users where followed_fb_id='" +
            fb_id +
            "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let total_fans = total_fans1[0].count;

        let total_following1 = await sequelize.query(
          "SELECT count(1) as count from follow_users where fb_id='" +
            fb_id +
            "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let total_following = total_following1[0].count;

        let query1 = await sequelize.query(
          "select * from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (query1.length > 0) {
          let rd = query1;

          let queryCount = await sequelize.query(
            "select count(v.id) as count from video_like_dislike d, videos v where d.fb_id='" +
              fb_id +
              "' and v.id=d.video_id and v.vtype='Short'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let countRec = queryCount[0].count;

          let query = await sequelize.query(
            "select d.*,v.id as vid from video_like_dislike d, videos v where d.fb_id='" +
              fb_id +
              "' and v.id=d.video_id and v.vtype='Short' order by d.id DESC LIMIT " +
              offset +
              ", " +
              limit +
              "",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_video = [];

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            let query11 = await sequelize.query(
              "select * from videos where id='" + row.video_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
              }
            );

            let rdd = query11[0];

            let rd12 = await selectSound(row.sound_id);

            let countLikes = await countLike(row.id);
            let countLikes_count = countLikes[0];

            let countLikes_count_ = await getHeart(row.video_id);

            let countcomment = await commentCount(row.id);
            let countcomment_count = countcomment[0];

            let liked = await videoLikeDislike(row.id, my_fb_id);
            let liked_count = liked[0];

            let query111 = await usersList(rdd.fb_id);
            let rd11 = query111[0];

            let SoundObject = {
              id: rd12.length > 0 ? rd12[0].id : "",
              audio_path: {
                mp3:
                  rd12.length > 0
                    ? API_path +
                      (await customerFunctions.checkFileExist(
                        moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss"),
                        rd12[0].id + ".mp3"
                      ))
                    : "",
                acc:
                  rd12.length > 0
                    ? API_path +
                      (await customerFunctions.checkFileExist(
                        moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss"),
                        rd12[0].id + ".aac"
                      ))
                    : "",
              },
              sound_name: rd12.length > 0 ? rd12[0].sound_name : "",
              description: rd12.length > 0 ? rd12[0].description : "",
              thum: rd12.length > 0 ? rd12[0].thum : "",
              section: rd12.length > 0 ? rd12[0].section : "",
              created:
                rd12.length > 0
                  ? moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let followStatus = await checkFollowStatus(fb_id, rdd.fb_id);
            let fStatus = followStatus[0].count == 0 ? false : true;
            let tag = "regular";
            if (rdd.for_you == "1") {
              tag = "trending";
            }

            let get_data = {
              tag: tag,
              id: rdd.id,
              video: customerFunctions.checkVideoUrl(rdd.video),
              thum: customerFunctions.checkVideoUrl(rdd.thum),
              gif: customerFunctions.checkVideoUrl(rdd.gif),
              description: rdd.description,
              marked: rdd.marked,
              followStatus: fStatus,
              liked: liked_count.count,

              user_info: {
                fb_id: rd11.fb_id,
                first_name: rd11.first_name,
                last_name: rd11.last_name,
                username: "@" + rd11.username,
                verified: rd11.verified,
                profile_pic: customerFunctions.checkProfileURL(
                  rd11.profile_pic
                ),
              },

              count: {
                like_count: parseInt(
                  countLikes_count.count + countLikes_count_
                ),
                video_comment_count: countcomment_count.count,
                view: rdd.view + rdd.fake_view,
              },
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };

            array_out_video.push(get_data);
          }

          let count_video_rows = array_out_video.length;
          if (count_video_rows == "0") {
            array_out_video = [];
          }

          let array_out = [
            {
              fb_id: fb_id,
              user_info: {
                fb_id: rd[0].fb_id,
                first_name: rd[0].first_name,
                last_name: rd[0].last_name,
                profile_pic: customerFunctions.checkProfileURL(
                  rd[0].profile_pic
                ),
                gender: rd[0].gender,
                category: rd[0].category,
                created: moment(rd[0].created).format("YYYY-MM-DD HH:mm:ss"),
                username: "@" + rd[0].username,
                verified: rd[0].verified,
              },

              total_heart: hear_count,
              total_fans: total_fans,
              total_following: total_following,
              user_videos: array_out_video,
              total_record_count: countRec,
              per_page_limit: limit,
            },
          ];

          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing6" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  get_user_data: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id;

        let query = await sequelize.query(
          "select * from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];
          let sub_array = {
            fb_id: row.fb_id,
            username: "@" + row.username,
            verified: row.verified,
            first_name: row.first_name,
            last_name: row.last_name,
            gender: row.gender,
            bio: row.bio,
            profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            marked: row.marked,
          };
          array_out.push(sub_array);
        }
        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getListOfBlock: async function (req, res, next) {
    try {
      let array_out = [];

      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id;

        let query = await sequelize.query(
          "SELECT *  from not_interest where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        for (i = 0; i < query.length; i++) {
          let q = query[i];

          let resUser = await sequelize.query(
            "SELECT * from users where fb_id='" + q.block_fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < resUser.length; i++) {
            let row = resUser[i];

            let sub_array = {
              fb_id: row.fb_id,
              username: "@" + row.username,
              bio: row.bio,
              first_name: row.first_name,
              last_name: row.last_name,
              gender: row.gender,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              block: row.block,
              version: row.version,
              device: row.device,
              signup_type: row.signup_type,
              email: row.email,
              phone: row.phone,
              marked: row.marked,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            array_out.push(sub_array);
          }
        }
        let output = {
          code: "200",
          msg: array_out,
          text: "User not interested list",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Param are missing 1" }],
          text: "Json Param are missing 1",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getNotifications_1: async function (req, res, next) {
    let event_json = req;
    let fb_id = event_json.fb_id;
    let page = event_json.page;

    let record_per_page = event_json.record_per_page;
    let offset = (page - 1) * record_per_page;

    // let r01 = await sequelize.query(
    //   "SELECT created FROM users WHERE fb_id='" + fb_id + "'",
    //   {
    //     type: sequelize.QueryTypes.SELECT,
    //   }
    // );

    let query = await sequelize.query(
      "select * from notification where (effected_fb_id='" +
        fb_id +
        "' OR effected_fb_id='all') AND `type`!='_event'   order by id desc LIMIT " +
        offset +
        ", " +
        record_per_page,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    let array_out = [];
    let array_out1 = [];
    let rd = "";

    for (i = 0; i < query.length; i++) {
      let row = query[i];
      if (
        row.type == "_video" ||
        row.type == "_clip" ||
        row.type == "_image" ||
        row.type == "_audio" ||
        row.type == "_user" ||
        row.type == "_appupdate" ||
        row.type == "_none" ||
        row.type == "_link" ||
        row.type == "time_event"
      ) {
        let icon = "";
        let content_icon = "";

        if (row.type == "_video") {
          let value = row.value;

          if (row.image == "-") {
            rd = await sequelize.query(
              "select * from videos where id='" + value + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let rd11 = await sequelize.query(
              "select * from users where fb_id='" + rd?.fb_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            icon = customerFunctions.checkProfileURL(rd11?.profile_pic);
          } else {
            icon = customerFunctions.checkVideoUrl(row.image);
          }

          if (row.content_image == "-") {
            rd = await sequelize.query(
              "select * from videos where id='" + value + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );
            content_icon = customerFunctions.checkVideoUrl(rd?.thum);
          } else {
            content_icon = customerFunctions.checkVideoUrl(row.content_image);
          }

          let rd001 = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          let FBID_ = rd001?.fb_id;

          let rd002 = await sequelize.query(
            "select * from users where fb_id='" + FBID_ + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          array_out1 = {
            type: "panel",
            action_type_: row.type,
            fb_id: FBID_,
            fb_id_details: {
              first_name: rd002?.first_name,
              last_name: rd002?.last_name,
              profile_pic: customerFunctions.checkProfileURL(
                rd002?.profile_pic
              ),
              username: "@" + rd002?.username,
              verified: rd002?.verified,
            },
            value_data: {
              id: rd001?.id,
              video: customerFunctions.checkVideoUrl(rd001?.video),
              thum: customerFunctions.checkVideoUrl(rd001?.thum),
              gif: customerFunctions.checkVideoUrl(rd001?.gif),
            },
            effected_fb_id: row.effected_fb_id,
            title: row.title,
            message: row.message,
            link: row.link,
            icon: icon,
            content_icon: content_icon,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
        } else if ((row.type = "_clip")) {
          let value = row.value;

          if (row.image == "-") {
            rd = await sequelize.query(
              "select * from videos where id='" + value + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let rd11 = await sequelize.query(
              "select * from users where fb_id='" + rd?.fb_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            icon = customerFunctions.checkVideoUrl(rd11?.profile_pic);
          } else {
            icon = customerFunctions.checkProfileURL(row.image);
          }

          if (row.content_image == "-") {
            rd = await sequelize.query(
              "select * from videos where id='" + value + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );
            content_icon = customerFunctions.checkVideoUrl(rd?.thum);
          } else {
            content_icon = customerFunctions.checkVideoUrl(row.content_image);
          }

          let rd001 = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          let FBID_ = rd001?.fb_id;

          let rd002 = await sequelize.query(
            "select * from users where fb_id='" + FBID_ + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          array_out1 = {
            type: "panel",
            action_type_: row.type,
            fb_id: FBID_,
            fb_id_details: {
              first_name: rd002?.first_name,
              last_name: rd002?.last_name,
              profile_pic: customerFunctions.checkProfileURL(
                rd002?.profile_pic
              ),
              username: "@" + rd002?.username,
              verified: rd002?.verified,
            },
            value_data: {
              id: rd001?.id,
              video: customerFunctions.checkVideoUrl(rd001?.video),
              thum: customerFunctions.checkVideoUrl(rd001?.thum),
              gif: customerFunctions.checkVideoUrl(rd001?.gif),
            },
            effected_fb_id: row.effected_fb_id,
            title: row.title,
            message: row.message,
            link: row.link,
            icon: icon,
            content_icon: content_icon,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
        } else if ((row.type = "_audio")) {
          let value = row.value;

          if (row.image == "-") {
            rd = await sequelize.query(
              "select * from videos where id='" + value + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let rd11 = await sequelize.query(
              "select * from users where fb_id='" + rd?.fb_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            icon = customerFunctions.checkVideoUrl(rd11?.profile_pic);
          } else {
            icon = customerFunctions.checkProfileURL(row.image);
          }

          if (row.content_image == "-") {
            rd = await sequelize.query(
              "select * from videos where id='" + value + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );
            content_icon = customerFunctions.checkVideoUrl(rd?.thum);
          } else {
            content_icon = customerFunctions.checkVideoUrl(row.content_image);
          }

          let rd001 = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          let FBID_ = rd001?.fb_id;

          let rd002 = await sequelize.query(
            "select * from users where fb_id='" + FBID_ + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          array_out1 = {
            type: "panel",
            action_type_: row.type,
            fb_id: FBID_,
            fb_id_details: {
              first_name: rd002?.first_name,
              last_name: rd002?.last_name,
              profile_pic: customerFunctions.checkProfileURL(
                rd002?.profile_pic
              ),
              username: "@" + rd002?.username,
              verified: rd002?.verified,
            },
            value_data: {
              id: rd001?.id,
              video: customerFunctions.checkVideoUrl(rd001?.video),
              thum: customerFunctions.checkVideoUrl(rd001?.thum),
              gif: customerFunctions.checkVideoUrl(rd001?.gif),
            },
            effected_fb_id: row.effected_fb_id,
            title: row.title,
            message: row.message,
            link: row.link,
            icon: icon,
            content_icon: content_icon,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
        } else if ((row.type = "_user")) {
          let value = row.value;

          if (row.image == "-") {
            rd11 = await sequelize.query(
              "select * from users where fb_id='" + value + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );
            icon = customerFunctions.checkVideoUrl(rd11?.profile_pic);
          } else {
            icon = customerFunctions.checkProfileURL(row.image);
          }

          if (row.content_image == "-") {
            content_icon = "-";
          } else {
            content_icon = customerFunctions.checkVideoUrl(row.content_image);
          }

          let rd002 = await sequelize.query(
            "select * from users where fb_id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          let FBID_ = value;

          array_out1 = {
            type: "panel",
            action_type_: row.type,
            fb_id: FBID_,
            fb_id_details: {
              first_name: rd002?.first_name,
              last_name: rd002?.last_name,
              profile_pic: customerFunctions.checkProfileURL(
                rd002?.profile_pic
              ),
              username: "@" + rd002?.username,
              verified: rd002?.verified,
            },
            effected_fb_id: row.effected_fb_id,
            title: row.title,
            message: row.message,
            link: row.link,
            icon: icon,
            content_icon: content_icon,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
        } else {
          if (row.image == "-") {
            icon = "-";
          } else {
            icon = customerFunctions.checkVideoUrl(row.image);
          }
          if (row.content_image == "-") {
            content_icon = "-";
          } else {
            content_icon = customerFunctions.checkVideoUrl(row.content_image);
          }

          array_out1 = {
            type: "panel",
            action_type_: row.type,
            fb_id: row.my_fb_id,
            effected_fb_id: row.effected_fb_id,
            title: row.title,
            message: row.message,
            link: row.link,
            icon: icon,
            content_icon: content_icon,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
        }
      } else {
        let rd = await sequelize.query(
          "select * from users where fb_id='" + row.my_fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let rd1 = await sequelize.query(
          "select * from videos where id='" + row.value + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        array_out1 = {
          type: row.type,
          action_type_: row.type,
          fb_id: row.my_fb_id,
          fb_id_details: {
            first_name: rd ? rd.first_name : "",
            last_name: rd ? rd.last_name : "",
            profile_pic: rd
              ? customerFunctions.checkProfileURL(rd.profile_pic)
              : "",
            username: rd ? "@" + rd.username : "",
            verified: rd ? rd.verified : "",
          },
          effected_fb_id: row.effected_fb_id,
          value: row.value,
          value_data: {
            id: rd1 ? rd1.id : "",
            video: customerFunctions.checkVideoUrl(rd1 ? rd1.video : ""),
            thum: customerFunctions.checkVideoUrl(rd1 ? rd1.thum : ""),
            gif: customerFunctions.checkVideoUrl(rd1 ? rd1.gif : ""),
          },
          created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
        };
      }

      array_out.push(array_out1);
    }

    let output = {
      code: "200",
      msg: array_out,
    };
    res.status(200).json(output);
  },

  getNotifications: async function (req, res, next) {
    let event_json = req;
    let fb_id = event_json.fb_id;

    let query = await sequelize.query(
      "select * from notification where effected_fb_id='" +
        fb_id +
        "' order by id desc ",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    let array_out = [];
    let array_out1 = [];
    for (i = 0; i < query.length; i++) {
      let row = query[i];
      let rd = await sequelize.query(
        "select * from users where fb_id='" + row.my_fb_id + "'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let rd1 = await sequelize.query(
        "select * from videos where id='" + row.value + "'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      array_out1 = {
        fb_id: row.my_fb_id,
        fb_id_details: {
          first_name: rd ? rd.first_name : "",
          last_name: rd ? rd.last_name : "",
          profile_pic: customerFunctions.checkProfileURL(
            rd ? rd.profile_pic : ""
          ),
          username: rd ? "@" + rd.username : "",
          verified: rd ? rd.verified : "",
        },
        effected_fb_id: row.effected_fb_id,
        value: row.value,
        type: row.type,
        value_data: {
          id: rd1 ? rd1.id : "null",
          video: customerFunctions.checkVideoUrl(rd1 ? rd1.video : ""),
          thum: customerFunctions.checkVideoUrl(rd1 ? rd1.thum : ""),
          gif: customerFunctions.checkVideoUrl(rd1 ? rd1.gif : ""),
        },
        created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
      };

      array_out.push(array_out1);
    }

    let output = {
      code: "200",
      msg: array_out,
    };
    res.status(200).json(output);
  },

  getBanner1: async function (req, res, next) {
    try {
      let query = await sequelize.query(
        "select * from banner order by orders ASC",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let ar = [];
      let i = 0;

      for (i = 0; i < query.length; i++) {
        let r = query[i];
        ar.push({
          image: customerFunctions.checkVideoUrl(r.image),
          link: r.link,
        });
      }
      let output = {
        code: "200",
        msg: ar,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  userCategory: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;
      let query = await sequelize.query(
        "SELECT category from  `users` WHERE `fb_id` = '" + fb_id + "'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );
      let output = {
        code: "200",
        message: "Success",
        category: query ? query.category : "",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getUserCategory: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id;
        let r = await sequelize.query(
          "select * from creators where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        if (r.length > 0) {
          let output = {
            code: "200",
            data: r,
            url: API_path,
            message: "User category found",
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            message: "No user category found",
          };
          res.status(200).json(output);
        }
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  edit_profile: async function (req, res, next) {
    try {
      let event_json = req;

      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.first_name !== "undefined" &&
        typeof event_json.last_name !== "undefined" &&
        typeof event_json.gender !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let first_name = event_json.first_name;
        let last_name = event_json.last_name;
        let gender = event_json.gender;
        let bio = event_json.bio;
        let username = event_json.username;
        username = username.replace("@", "");

        let rd = await sequelize.query(
          "select * from users WHERE username=" + pool.escape(username) + "",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let rdfb = rd ? rd.fb_id : "";

        if (rdfb == "" || rdfb == fb_id) {
          let update =
            "update users SET first_name =" +
            pool.escape(first_name) +
            " , last_name =" +
            pool.escape(last_name) +
            ", gender =" +
            pool.escape(gender) +
            " , bio =" +
            pool.escape(bio) +
            " , username =" +
            pool.escape(username) +
            "  WHERE fb_id =" +
            pool.escape(fb_id) +
            "";
          await reqInsertTimeEventLiveData(update);

          let log_in_rs = await sequelize.query(
            "select *, count(fb_id) as count from users WHERE fb_id ='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          let array_out = [];
          if (log_in_rs.count > 0) {
            array_out = [
              {
                first_name: log_in_rs.first_name,
                username: "@" + log_in_rs.username,
                verified: log_in_rs.verified,
                last_name: log_in_rs.last_name,
                gender: log_in_rs.gender,
                category: log_in_rs.category,
                bio: log_in_rs.bio,
                marked: log_in_rs.marked,
              },
            ];
          }
          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: [{ response: "username already exist" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing17" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  likeDislikeVideo: async function (req, res, next) {
    try {
      let event_json = req;

      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.video_id !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let video_id = event_json.video_id;
        let action = event_json.action;

        if (action == "0") {
          let deletes =
            "delete from video_like_dislike where video_id ='" + video_id + "'";
          await reqInsertTimeEventLiveData(deletes);
          let output = {
            code: "200",
            msg: [{ response: "Unlike success" }],
          };
          res.status(200).json(output);
        } else {
          let countR = await sequelize.query(
            "select count(1) as count from video_like_dislike where video_id='" +
              video_id +
              "' AND fb_id='" +
              fb_id +
              "' AND action='" +
              action +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          if (countR.count == "0") {
            let qrry_1 =
              "insert into video_like_dislike(video_id,fb_id,action,created)values(";
            qrry_1 += "'" + video_id + "',";
            qrry_1 += "" + pool.escape(fb_id) + ",";
            qrry_1 += "'" + action + "',";
            qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_1 += ")";
            await reqInsertTimeEventLiveData(qrry_1);

            let rd1 = await sequelize.query(
              "select * from videos where id='" + video_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let effected_fb_id = rd1.fb_id;
            let likeString = "";
            let likeStr = "";

            if (rd1.vtype == "Short") {
              likeString = "video_like";
              likeStr = "video";
            } else if (rd1.vtype == "Clip") {
              likeString = "clip_like";
              likeStr = "clip";
            } else if (rd1.vtype == "Image") {
              likeString = "image_like";
              likeStr = "image";
            }

            let qrry_2 =
              "insert into notification(my_fb_id,effected_fb_id,type,value,created)values(";
            qrry_2 += "" + pool.escape(fb_id) + ",";
            qrry_2 += "" + pool.escape(effected_fb_id) + ",";
            qrry_2 += "'" + likeString + "',";
            qrry_2 += "'" + video_id + "',";
            qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_2 += ")";
            await reqInsertTimeEventLiveData(qrry_2);

            let rd = await sequelize.query(
              "select * from videos where id='" + video_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let userRd = await sequelize.query(
              "select * from users where fb_id='" + rd.fb_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let rd11 = await sequelize.query(
              "select * from users where fb_id='" + fb_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let title =
              rd11.first_name +
              " Liked Your " +
              likeStr.charAt(0).toUpperCase() +
              likeStr.substring(1);
            let message = "You have received 1 more like on your " + likeStr;

            let notification = {
              to: userRd.tokon,
              data: {
                title: title,
                body: message,
                badge: "1",
                sound: "default",
                image: "",
                type: likeString,
                vid: video_id,
                icon: customerFunctions.checkVideoUrl(rd11.profile_pic),
                content_icon: customerFunctions.checkVideoUrl(rd.thum),
              },
            };

            if (fb_id != effected_fb_id) {
              await customerFunctions.sendPushNotificationToMobileDevice(
                notification
              );
            }
            let output = {
              code: "200",
              msg: [{ response: "actions success" }],
            };
            res.status(200).json(output);
          } else {
            let output = {
              code: "201",
              msg: [{ response: "You are already Liked Video" }],
            };
            // console.log(output);

            res.status(200).json(output);
          }
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json parem missing8" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  postComment: async function (req, res, next) {
    try {
      let event_json = req;

      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.video_id !== "undefined"
      ) {
        let fb_id = striptags(event_json.fb_id);
        let video_id = striptags(event_json.video_id);
        let comment = striptags(event_json.comment);
        let rd = await sequelize.query(
          "select * from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let qrry_1 =
          "insert into video_comment(video_id,fb_id,comments,created)values(";
        qrry_1 += "'" + video_id + "',";
        qrry_1 += "" + pool.escape(fb_id) + ",";
        qrry_1 += "" + pool.escape(comment) + ",";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        let qrry_1_id = await reqInsertTimeEventLiveData(qrry_1);
        let last_id = qrry_1_id.insertId;

        let array_out = [
          {
            fb_id: fb_id,
            video_id: video_id,
            comments: comment,
            id: last_id,

            user_info: {
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              username: "@" + rd.username,
              verified: rd.verified,
            },
          },
        ];

        let rd1 = await sequelize.query(
          "select * from videos where id='" + video_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let effected_fb_id = rd1.fb_id;
        let likeString = "";
        let likeStr = "";

        if (rd1.vtype == "Short") {
          likeString = "comment_video";
          likeStr = "video";
        } else if (rd1.vtype == "Clip") {
          likeString = "comment_clip";
          likeStr = "clip";
        } else if (rd1.vtype == "Image") {
          likeString = "comment_image";
          likeStr = "image";
        }

        let qrry_2 =
          "insert into notification(my_fb_id,effected_fb_id,type,value,created)values(";
        qrry_2 += "" + pool.escape(fb_id) + ",";
        qrry_2 += "" + pool.escape(effected_fb_id) + ",";
        qrry_2 += "'" + likeString + "',";
        qrry_2 += "'" + video_id + "',";
        qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_2 += ")";
        await reqInsertTimeEventLiveData(qrry_2);

        let rds = await sequelize.query(
          "select * from videos where id='" + video_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let userRd = await sequelize.query(
          "select * from users where fb_id='" + rds.fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let rd11 = await sequelize.query(
          "select * from users where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let title = rd11.first_name + " Post comment on your " + likeStr;
        let message = comment;

        let notification = {
          to: userRd.tokon,
          notification: {
            image: "",
            title: title,
            body: message,
            mutable_content: false,
            sound: "default",
            badge: 1,
          },
          data: {
            title: title,
            body: message,
            vid: video_id,
            type: likeString,
            icon: customerFunctions.checkVideoUrl(rd11.profile_pic),
            content_icon: customerFunctions.checkVideoUrl(rds.thum),
          },
        };

        await customerFunctions.sendPushNotificationToMobileDevice(
          notification
        );

        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json parem missing9" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showVideoComments: async function (req, res, next) {
    try {
      if (typeof req.video_id !== "undefined") {
        let video_id = req.video_id;

        let query = await sequelize.query(
          "SELECT vc.*,v.fb_id as video_owner_id FROM video_comment vc, videos v where v.id=vc.video_id and vc.video_id='" +
            video_id +
            "' order by vc.id DESC",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let rd = await sequelize.query(
            "select * from users where fb_id='" + row.fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          let array_out_new = {
            video_id: row.video_id,
            video_owner_id: row.video_owner_id,
            id: row.id,
            fb_id: row.fb_id,
            comments: row.comments,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),

            user_info: {
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              username: "@" + rd.username,
              verified: rd.verified,
            },
          };
          array_out.push(array_out_new);
        }

        let output = {
          code: "200",
          msg: array_out,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing10" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  deleteComment: async function (req, res, next) {
    try {
      if (
        typeof req.comment_id !== "undefined" &&
        typeof req.fb_id !== "undefined" &&
        typeof req.video_id !== "undefined"
      ) {
        let comment_id = req.comment_id;
        let fb_id = req.fb_id;
        let video_id = req.video_id;

        let deletes =
          "DELETE FROM video_comment where  id='" +
          comment_id +
          "' AND video_id='" +
          video_id +
          "' and fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(deletes);

        let output = {
          code: "200",
          data: [],
          message: "Comment deleted",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          data: [],
          message: "json param missing 3",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  reportVideo: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.fb_report_id !== "undefined" &&
        typeof req.video_id !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let fb_report_id = req.fb_report_id;
        let video_id = req.video_id;
        let message = req.message;
        let action = "PENDING";

        let qrry_1 =
          "insert into video_report(fb_id,fb_report_id,video_id,message,action,added_at)values(";
        qrry_1 += "" + pool.escape(fb_id) + ",";
        qrry_1 += "" + pool.escape(fb_report_id) + ",";
        qrry_1 += "'" + video_id + "',";
        qrry_1 += "" + pool.escape(message) + ",";
        qrry_1 += "'" + action + "',";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);

        let output = {
          code: "200",
          msg: [{ response: "Video Reported Success" }],
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json param missing 3" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  block_user: async function (req, res, next) {
    try {
      if (
        typeof req.block_fb_id !== "undefined" &&
        typeof req.fb_id !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let block_fb_id = req.block_fb_id;

        let qrry_1 = "insert into not_interest(`fb_id`, `block_fb_id`)values(";
        qrry_1 += "" + pool.escape(fb_id) + ",";
        qrry_1 += "" + pool.escape(block_fb_id) + "";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);

        let output = {
          code: "200",
          msg: [{ response: "User added to block" }],
          text: "User added to block",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Param are missing 2" }],
          text: "Json Param are missing 2",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  removeFromBlock: async function (req, res, next) {
    try {
      if (
        typeof req.block_fb_id !== "undefined" &&
        typeof req.fb_id !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let block_fb_id = req.block_fb_id;

        let deletes =
          "delete  from not_interest where  block_fb_id=" +
          pool.escape(block_fb_id) +
          " AND fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(deletes);

        let output = {
          code: "200",
          msg: [{ response: "User removed from block" }],
          text: "User removed from block",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Param are missing 2" }],
          text: "Json Param are missing 2",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  follow_users: async function (req, res, next) {
    try {
      let event_json = req;

      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.followed_fb_id !== "undefined" &&
        typeof event_json.status !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let followed_fb_id = event_json.followed_fb_id;
        let status = event_json.status;

        if (status == "0") {
          let deletes =
            "Delete from follow_users where fb_id =" +
            pool.escape(fb_id) +
            " and followed_fb_id=" +
            pool.escape(followed_fb_id) +
            "";
          await reqInsertTimeEventLiveData(deletes);
          let output = {
            code: "200",
            msg: [{ response: "unfollow" }],
          };
          res.status(200).json(output);
        } else {
          let cnt = await sequelize.query(
            "select count(fb_id) as count from follow_users where fb_id ='" +
              fb_id +
              "' and followed_fb_id='" +
              followed_fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          if (cnt.count == 0) {
            let qrry_1 =
              "insert into follow_users(fb_id,followed_fb_id)values(";
            qrry_1 += "" + pool.escape(fb_id) + ",";
            qrry_1 += "" + pool.escape(followed_fb_id) + "";
            qrry_1 += ")";
            await reqInsertTimeEventLiveData(qrry_1);

            let qrry_2 =
              "insert into notification(my_fb_id,effected_fb_id,type,value,created)values(";
            qrry_2 += "" + pool.escape(fb_id) + ",";
            qrry_2 += "" + pool.escape(followed_fb_id) + ",";
            qrry_2 += "'following_you',";
            qrry_2 += "'',";
            qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_2 += ")";
            await reqInsertTimeEventLiveData(qrry_2);

            let rd1 = await sequelize.query(
              "select * from users where fb_id='" + followed_fb_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let rd11 = await sequelize.query(
              "select * from users where fb_id='" + fb_id + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let title = rd11.first_name + " started following you";
            let message = "You have received 1 more follwing to your profile";

            let notification = {
              to: rd1.tokon,
              data: {
                title: title,
                body: message,
                fb_id: fb_id,
                icon: customerFunctions.checkVideoUrl(rd11.profile_pic),
              },
            };

            let ss = await customerFunctions.sendPushNotificationToMobileDevice(
              notification
            );
            let output = {
              code: "200",
              msg: [{ response: "follow successful" }],
              notification_data: notification,
              fire_data: ss,
            };
            res.status(200).json(output);
          } else {
            let output = {
              code: "200",
              msg: [{ response: "follow successful" }],
            };
            res.status(200).json(output);
          }
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing18" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  allSounds: async function (req, res, next) {
    try {
      let event_json = req;
      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let query = await sequelize.query("select * from sound_section", {
          type: sequelize.QueryTypes.SELECT,
        });

        let array_out2 = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await sequelize.query(
            "select * from sound where section ='" +
              row.id +
              "' order by created DESC",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let array_out1 = [];

          for (ii = 0; ii < query1.length; ii++) {
            let row1 = query1[ii];

            let CountFav = await sequelize.query(
              "select count(fb_id) as count from fav_sound WHERE fb_id='" +
                fb_id +
                "' and sound_id ='" +
                row1.id +
                "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );

            let get_data = {
              id: row1.id,
              audio_path: {
                mp3:
                  API_path +
                  (await customerFunctions.checkFileExist(
                    moment(row1.created).format("YYYY-MM-DD HH:mm:ss"),
                    row1.id + ".mp3"
                  )),
                acc:
                  API_path +
                  (await customerFunctions.checkFileExist(
                    moment(row1.created).format("YYYY-MM-DD HH:mm:ss"),
                    row1.id + ".aac"
                  )),
              },
              sound_name: row1.sound_name,
              description: row1.description,
              section: row1.section,
              thum: customerFunctions.checkVideoUrl(row1.thum),
              created: moment(row1.created).format("YYYY-MM-DD HH:mm:ss"),
              fav: CountFav.count,
            };
            array_out1.push(get_data);
          }

          if (array_out1.length != "0") {
            let get_data1 = {
              section_name: row.section_name,
              sections_sounds: array_out1,
            };
            array_out2.push(get_data1);
          }
        }
        let output = {
          code: "200",
          msg: array_out2,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing18" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  my_FavSound: async function (req, res, next) {
    try {
      let event_json = req;

      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let query = await sequelize.query(
          "select * from fav_sound where fb_id ='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out1 = [];

        for (i = 0; i < query.length; i++) {
          let row1 = query[i];

          let rd = await sequelize.query(
            "select * from sound WHERE id ='" + row1.sound_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          let get_data = {
            id: rd.id,
            audio_path: {
              mp3:
                API_path +
                (await customerFunctions.checkFileExist(
                  moment(row1.created).format("YYYY-MM-DD HH:mm:ss"),
                  row1.id + ".mp3"
                )),
              acc:
                API_path +
                (await customerFunctions.checkFileExist(
                  moment(row1.created).format("YYYY-MM-DD HH:mm:ss"),
                  row1.id + ".aac"
                )),
            },
            sound_name: rd.sound_name,
            description: rd.description,
            section: rd.section,
            thum: customerFunctions.checkVideoUrl(rd.thum),
            created: moment(rd.created).format("YYYY-MM-DD HH:mm:ss"),
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
          msg: [{ response: "Json Parem are missing13" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  uploadImage_: async function (req, res, next) {
    try {
      if (typeof req.body.fb_id !== "undefined") {
        let fb_id = req.body.fb_id;

        let rd014 = await sequelize.query(
          "SELECT block FROM `users` where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        if (rd014.block == "0") {
          let description = req.body.description;
          let category = req.body.category;
          let v_location = req.body.v_location;
          let sound_id = req.body.sound_id;
          sound_id = sound_id ? sound_id : 0;
          category = category.charAt(0).toUpperCase() + category.substring(1);

          let video_url = "";
          let gif_url = "";

          let dirName = moment().format("MMMMYYYY");
          let newPath = "UpLoad/UpLoad/" + dirName;

          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, {
              recursive: true,
            });
          }

          if (!fs.existsSync(newPath + "/thum")) {
            fs.mkdirSync(newPath + "/thum", {
              recursive: true,
            });
          }

          if (typeof req.files.uploaded_file !== "undefined") {
            let portfolio = req.files.uploaded_file;
            // const { buffer, originalname } = req.file;
            // console.log(buffer);
            let uploadPortfolio =
              newPath + "/thum/" + Date.now() + uuidv4() + portfolio.name;
            portfolio.mv(uploadPortfolio, async function (err) {
              if (err) {
                let output = {
                  code: "201",
                  msg: [{ response: "error in uploading files" }],
                };
                res.status(200).json(output);
              } else {
                let createThumFolder = newPath + "/thum";
                if (process.env.media_storage == "ftp") {
                  await CreateDirectoryToFTP(createThumFolder);
                  await uploadFileToFTP(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }

                if (process.env.media_storage == "s3") {
                  await uploadToS3(uploadPortfolio, uploadPortfolio);
                  fs.unlinkSync(uploadPortfolio);
                }

                let qrry_1 =
                  "insert into videos(description,category, video,sound_id,v_location,fb_id,gif,thum,type,vtype,created)values(";
                qrry_1 += "" + pool.escape(description) + ",";
                qrry_1 += "" + pool.escape(category) + ",";
                qrry_1 += "'" + video_url + "',";
                qrry_1 += "'" + sound_id + "',";
                qrry_1 += "" + pool.escape(v_location) + ",";
                qrry_1 += "" + pool.escape(fb_id) + ",";
                qrry_1 += "" + pool.escape(gif_url) + ",";
                qrry_1 += "" + pool.escape(uploadPortfolio) + ",";
                qrry_1 += "'IMAGE',";
                qrry_1 += "'Image',";
                qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
                qrry_1 += ")";
                await reqInsertTimeEventLiveData(qrry_1);

                let output = {
                  code: "200",
                  msg: [{ response: "file uploaded" }],
                };
                res.status(200).json(output);
              }
            });
          } else {
            let output = {
              code: "201",
              msg: [{ response: "error in uploading files" }],
            };
            res.status(200).json(output);
          }
        } else {
          let output = {
            code: "201",
            msg: [{ response: "You are Blocked, So you can not upload Video" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "json parem missing 3" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  fav_sound: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.sound_id !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let sound_id = req.sound_id;
        let fav = req.fav;

        if (fav == "1") {
          let qrry_1 = "insert into fav_sound(fb_id,sound_id,created)values(";
          qrry_1 += "" + pool.escape(fb_id) + ",";
          qrry_1 += "'" + sound_id + "',";
          qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);
          let output = {
            code: "200",
            msg: [{ response: "successful" }],
          };
          res.status(200).json(output);
        } else {
          let deletes =
            "Delete from fav_sound where fb_id =" +
            pool.escape(fb_id) +
            " and sound_id='" +
            sound_id +
            "'";
          await reqInsertTimeEventLiveData(deletes);

          let output = {
            code: "200",
            msg: [{ response: "successful" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing12" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showPackagesList: async function (req, res, next) {
    try {
      let qrry_1 = await sequelize.query("SELECT * FROM diamond_packages", {
        type: sequelize.QueryTypes.SELECT,
      });
      let ar = [];
      for (i = 0; i < qrry_1.length; i++) {
        let row = qrry_1[i];
        let get_data = {
          package_name: row.package_name,
          diamond: row.diamond,
          amount: row.amount,
        };
        ar.push(get_data);
      }
      let output = {
        code: "200",
        data: ar,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  SubscriptionPlans: async function (req, res, next) {
    try {
      let qrry_1 = await sequelize.query("SELECT * FROM subscription_plans", {
        type: sequelize.QueryTypes.SELECT,
      });
      let ar = [];
      for (i = 0; i < qrry_1.length; i++) {
        let row = qrry_1[i];
        let get_data = {
          plan_name: row.plan_name,
          description: row.description,
          price: row.price,
          days: row.days,
        };
        ar.push(get_data);
      }
      let output = {
        code: "200",
        data: ar,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  downloadFile: async function (req, res, next) {
    // var fileList = [VIDEO_PATH, WATERMARK_PATH]; // files to merge
    // let proc = ffmpeg(VIDEO_PATH)
    //   .addInput(WATERMARK_PATH)
    //   .output(DestinationURL1)
    //   .complexFilter([
    //     {
    //       filter: "drawtext",
    //       options: {
    //         text: "@bimal",
    //         fontsize: 23,
    //         fontcolor: "white",
    //         y: 60,
    //         x: 20,
    //       },
    //       inputs: "1",
    //     },
    //     {
    //       filter: "overlay",
    //       options: { x: 0, y: 0 },
    //       inputs: 0,
    //       outputs: "1",
    //     },
    //   ])
    //   .on("start", function (commandLine) {
    //     console.log("Spawned ffmpeg with command: " + commandLine);
    //   })
    //   .on("end", function () {

    //     // var fileList = [VIDEO_PATH, second]; // files to merge
    //     // var listFileName = "list.txt";
    //     // fileNames = "";
    //     // // ffmpeg -f concat -i mylist.txt -c copy output
    //     // fileList.forEach(function (fileName, index) {
    //     //   fileNames = fileNames + "file " + "" + fileName + "\n";
    //     // });
    //     // fs.writeFileSync(listFileName, fileNames);
    //     // var merge = ffmpeg();
    //     // merge
    //     //   .input(listFileName)
    //     //   .inputOptions(["-f concat"])
    //     //   .saveToFile(DestinationURL);

    //     // ffmpeg(DestinationURL1)
    //     //   .addInput(second)
    //     //   .output(DestinationURL)
    //     //   .complexFilter([
    //     //     {
    //     //       filter: "concat",
    //     //       options: {
    //     //         n: "2",
    //     //         v: "0",
    //     //         a: "1",
    //     //       },
    //     //       input: "[v:1][a:0]",
    //     //     },
    //     //   ])
    //     //   .run();
    //   })
    //   .on("error", function (err) {
    //     console.log("Error occurred during merging: " + err.message);
    //   })
    //   .run();

    // ffmpeg()
    //   .input(VIDEO_PATH)
    //   .input(WATERMARK_PATH)
    //   .videoCodec("libx264")
    //   .audioCodec("libmp3lame")
    //   .complexFilter([
    //     {
    //       filter: "drawtext",
    //       options: {
    //         text: "@bimal",
    //         fontsize: 23,
    //         fontcolor: "white",
    //         y: 60,
    //         x: 20,
    //       },
    //       inputs: "1",
    //     },
    //     {
    //       filter: "overlay",
    //       options: { x: 0, y: 0 },
    //       inputs: 0,
    //       outputs: "1",
    //     },
    //   ])
    //   .outputOptions(["-map 0:a"])
    //   .on("error", function (err, stdout, stderr) {
    //     console.log("An error occurred: " + err.message, err, stderr);
    //   })
    //   .on("end", function (err, stdout, stderr) {
    //     ffmpeg()
    //       .input(DestinationURL1)
    //       .output(DestinationURLTS)
    //       .audioCodec("libmp3lame")
    //       .videoCodec("libx264")
    //       .on("error", function (err, stdout, stderr) {
    //         console.log("An error occurred: " + err.message, err, stderr);
    //       })
    //       .on("progress", function (progress) {
    //         console.log("Processing: " + progress.percent + "% done");
    //       })
    //       .on("end", function (err, stdout, stderr) {
    //         var fileList = [VIDEO_PATH, second]; // files to merge
    //         var listFileName = "list.txt";
    //         fileNames = "";
    //         // ffmpeg -f concat -i mylist.txt -c copy output
    //         fileList.forEach(function (fileName, index) {
    //           fileNames = fileNames + "file " + "" + fileName + "\n";
    //         });
    //         fs.writeFileSync(listFileName, fileNames);
    //         var merge = ffmpeg();
    //         merge
    //           .input(listFileName)
    //           .audioCodec("libmp3lame")
    //           .inputOptions(["-f concat"])
    //           .saveToFile(DestinationURL);
    //       })
    //       .run();
    //   })
    //   .saveToFile(DestinationURL1)
    //   .run();

    try {
      if (typeof req.video_id !== "undefined") {
        let video_id = req.video_id;
        let rd = await sequelize.query(
          "select * from videos WHERE id ='" + video_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        let rd1 = await sequelize.query(
          "select * from users WHERE fb_id ='" + rd.fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        let videoURL = rd.video;
        let username = rd1 ? rd1.username : "hithot";
        // let userpic = rd1.profile_pic;
        if (customerFunctions.startsWiths(videoURL, "upload")) {
          videoURL = "UpLoad/" + videoURL;
        } else if (customerFunctions.startsWiths(videoURL, "UpLoad/Vidz")) {
          videoURL = "UpLoad/" + videoURL;
        }
        // if (customerFunctions.startsWiths(videoURL, "upload/images")) {
        //   userpic = "UpLoad/" + userpic;
        // }

        let RemoteFile = videoURL;

        if (process.env.media_storage == "s3") {
          let newUrl1 = videoURL.substring(videoURL.lastIndexOf("/") + 1);
          let localFile = videoURL;
          RemoteFile = "UpLoad/TMP/" + newUrl1;
          await getFromS3(RemoteFile, localFile);
        }

        if (process.env.media_storage == "ftp") {
          let newUrl = videoURL.substring(videoURL.lastIndexOf("/") + 1);
          let localFile = videoURL;
          RemoteFile = "UpLoad/TMP/" + newUrl;
          await downloadFileFromFTP(RemoteFile, localFile);
        }

        if (process.env.media_storage == "local") {
          let DestinationURL1 =
            "UpLoad/TMP/HHTemp_" + Date.now() + uuidv4() + ".mp4";

          let DestinationURLTS =
            "UpLoad/TMP/HHTemp_" + Date.now() + uuidv4() + ".ts";

          let DestinationURL =
            "UpLoad/TMP/hh_" + Date.now() + uuidv4() + ".mp4";

          const WATERMARK_PATH = `watermark/WTRMRK.png`;
          const second = "watermark/hhnewendscreen.ts";

          var merge = ffmpeg();
          merge
            .input(RemoteFile)
            .input(WATERMARK_PATH)
            .videoCodec("libx264")
            .complexFilter([
              {
                filter: "drawtext",
                options: {
                  text: "@" + username,
                  fontsize: 23,
                  fontcolor: "white",
                  y: 60,
                  x: 20,
                },
                inputs: "1",
              },
              {
                filter: "overlay",
                options: { x: 0, y: 0 },
                inputs: 0,
                outputs: "1",
              },
            ])
            .on("error", function (err) {
              // console.log(err);
            })
            .on("end", function () {
              var merge = ffmpeg(DestinationURL1);
              merge
                .outputOptions([
                  "-c copy",
                  "-bsf:v h264_mp4toannexb",
                  "-f mpegts",
                ])
                .on("end", async function () {
                  var fileList = [DestinationURLTS, second]; // files to merge
                  var listFileName = "list.txt";
                  let fileNames = "";
                  // ffmpeg -f concat -i mylist.txt -c copy output
                  fileList.forEach(function (fileName, index) {
                    fileNames = fileNames + "file " + "" + fileName + "\n";
                  });
                  fs.writeFileSync(listFileName, fileNames);
                  var merge = ffmpeg(listFileName);
                  merge
                    .inputOptions(["-f concat"])
                    .on("end", async function () {
                      fs.unlinkSync(RemoteFile);
                      fs.unlinkSync(DestinationURLTS);
                      fs.unlinkSync(DestinationURL1);
                      let output = {
                        code: "200",
                        msg: [
                          {
                            download_url:
                              process.env.MAIN_path + DestinationURL,
                          },
                        ],
                      };
                      res.status(200).json(output);
                    })
                    .saveToFile(DestinationURL);
                })
                .saveToFile(DestinationURLTS);
            })
            .saveToFile(DestinationURL1);
        }

        if (process.env.media_storage == "s3") {
          let DestinationURL1 =
            "UpLoad/TMP/HHTemp_" + Date.now() + uuidv4() + ".mp4";

          let DestinationURLTS =
            "UpLoad/TMP/HHTemp_" + Date.now() + uuidv4() + ".ts";

          let DestinationURL =
            "UpLoad/TMP/hh_" + Date.now() + uuidv4() + ".mp4";

          const WATERMARK_PATH = `watermark/WTRMRK.png`;
          const second = "watermark/hhnewendscreen.ts";

          var merge = ffmpeg();
          merge
            .input(RemoteFile)
            .input(WATERMARK_PATH)
            .videoCodec("libx264")
            .complexFilter([
              {
                filter: "drawtext",
                options: {
                  text: "@" + username,
                  fontsize: 23,
                  fontcolor: "white",
                  y: 60,
                  x: 20,
                },
                inputs: "1",
              },
              {
                filter: "overlay",
                options: { x: 0, y: 0 },
                inputs: 0,
                outputs: "1",
              },
            ])
            .on("error", function (err) {
              // console.log(err);
            })
            .on("end", function () {
              var merge = ffmpeg(DestinationURL1);
              merge
                .outputOptions([
                  "-c copy",
                  "-bsf:v h264_mp4toannexb",
                  "-f mpegts",
                ])
                .on("end", async function () {
                  var fileList = [DestinationURLTS, second]; // files to merge
                  var listFileName = "list.txt";
                  let fileNames = "";
                  // ffmpeg -f concat -i mylist.txt -c copy output
                  fileList.forEach(function (fileName, index) {
                    fileNames = fileNames + "file " + "" + fileName + "\n";
                  });
                  fs.writeFileSync(listFileName, fileNames);
                  var merge = ffmpeg(listFileName);
                  merge
                    .inputOptions(["-f concat"])
                    .on("end", async function () {
                      fs.unlinkSync(RemoteFile);
                      fs.unlinkSync(DestinationURLTS);
                      fs.unlinkSync(DestinationURL1);
                      let output = {
                        code: "200",
                        msg: [
                          {
                            download_url:
                              process.env.MAIN_path + DestinationURL,
                          },
                        ],
                      };
                      res.status(200).json(output);
                    })
                    .saveToFile(DestinationURL);
                })
                .saveToFile(DestinationURLTS);
            })
            .saveToFile(DestinationURL1);
        }

        // if (process.env.media_storage == "s3") {
        //   let DestinationURL1 =
        //     "UpLoad/TMP/HHTemp_" + Date.now() + uuidv4() + ".mp4";

        //   let DestinationURLTS =
        //     "UpLoad/TMP/HHTemp_" + Date.now() + uuidv4() + ".ts";

        //   let DestinationURL =
        //     "UpLoad/TMP/hh_" + Date.now() + uuidv4() + ".mp4";

        //   const WATERMARK_PATH = `watermark/WTRMRK.png`;
        //   const second = "watermark/hhnewendscreen.ts";
        //   var merge = ffmpeg(RemoteFile);
        //   merge
        //     .outputOptions(["-c copy", "-bsf:v h264_mp4toannexb", "-f mpegts"])
        //     .on("end", async function () {
        //       var fileList = [DestinationURLTS, second]; // files to merge
        //       var listFileName = "list.txt";
        //       let fileNames = "";
        //       // ffmpeg -f concat -i mylist.txt -c copy output
        //       fileList.forEach(function (fileName, index) {
        //         fileNames = fileNames + "file " + "" + fileName + "\n";
        //       });
        //       fs.writeFileSync(listFileName, fileNames);
        //       var merge = ffmpeg(listFileName);
        //       merge
        //         .inputOptions(["-f concat"])
        //         .on("end", async function () {
        //           fs.unlinkSync(RemoteFile);
        //           fs.unlinkSync(DestinationURLTS);
        //           let output = {
        //             code: "200",
        //             msg: [
        //               {
        //                 download_url: process.env.MAIN_path + DestinationURL,
        //               },
        //             ],
        //           };
        //           res.status(200).json(output);
        //         })
        //         .saveToFile(DestinationURL);
        //     })
        //     .saveToFile(DestinationURLTS);
        // }

        // else if (process.env.media_storage == "s3") {
        //   let output = {
        //     code: "200",
        //     msg: [
        //       {
        //         download_url: API_path + RemoteFile,
        //       },
        //     ],
        //   };
        //   res.status(200).json(output);
        // }
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getYourReferral: async function (req, res, next) {
    try {
      if (typeof req.code !== "undefined") {
        let code = req.code;
        let log_in_rs = await sequelize.query(
          "select * from users WHERE referral ='" + code + "'",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let array_out = [];
        if (log_in_rs.length > 0) {
          for (i = 0; i < log_in_rs.length; i++) {
            let rd = log_in_rs[i];
            let get_data = {
              fb_id: rd.fb_id,
              username: "@" + rd.username,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              first_name: rd.first_name,
              last_name: rd.last_name,
              signup_type: rd.signup_type,
            };
            array_out.push(get_data);
          }
          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: [{ response: "No data found on your referral" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json code param are missing 1" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  diamondExchangeToINR: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.diamond !== "undefined" &&
        typeof req.amount !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let diamond = req.diamond;
        let amount = req.amount;
        let dated = moment().format("Y-MM-DD");

        let r1 = await sequelize.query("select * from setting", {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        });

        let thres = r1.diamondThreshold;

        if (thres <= diamond) {
          let txn_id = uuidv4();
          let desc = diamond + " diamond exchange";
          let qrry_1 =
            "insert into wallet(`fb_id`, `description`, `credit`, `debit`, `txn_id`,`status`,`dated`,`created`)values(";
          qrry_1 += "" + pool.escape(fb_id) + ",";
          qrry_1 += "" + pool.escape(desc) + ",";
          qrry_1 += "'" + amount + "',";
          qrry_1 += "'0',";
          qrry_1 += "'" + txn_id + "',";
          qrry_1 += "'APPROVE',";
          qrry_1 += "'" + dated + "',";
          qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);

          let ref = "Diamond Exchange";
          let str009 =
            "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`video_id`,`category`, `description`, `diamond`, `convertedDiamond`, `dated`,`created`)values(";
          str009 += "" + pool.escape(fb_id) + ",";
          str009 += "'-',";
          str009 += "'-',";
          str009 += "'-',";
          str009 += "'ConvertToINR',";
          str009 += "'" + ref + "',";
          str009 += "'0',";
          str009 += "" + pool.escape(diamond) + ",";
          str009 += "'" + dated + "',";
          str009 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          str009 += ")";
          await reqInsertTimeEventLiveData(str009);

          let output = {
            code: "200",
            msg: "Diamond Exchange to INR Successfully",
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: $thres + " Minimum threshold for exchange diamond",
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Param missing" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getAwardWinner: async function (req, res, next) {
    try {
      let query = await sequelize.query(
        "select * from award_winner where type='Active'",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      array_out = [];
      if (query.length > 0) {
        array_out = query;
      }

      let output = {
        code: "200",
        data: array_out,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  SearchByHashTag: async function (req, res, next) {
    try {
      let event_json = req;
      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let tag = event_json.tag;
        let page = 1;
        let limit = 300;
        let offset = (page - 1) * limit;

        if (typeof event_json.pageNo !== "undefined") {
          page = event_json.pageNo;
          limit = 30;
          offset = (page - 1) * limit;
        }

        let countRec = await sequelize.query(
          "select count(id) as count from videos where vtype='Short' AND description like '%" +
            tag +
            "%'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let token = event_json.token;

        let update =
          "update users set tokon=" +
          pool.escape(token) +
          " where fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(update);

        let query = await sequelize.query(
          "select * from videos where vtype='Short' AND description like '%" +
            tag +
            "%' order by id desc LIMIT " +
            offset +
            ", " +
            limit +
            "",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await usersList(row.fb_id);
          let rd = query1[0];

          let query112 = await selectSound(row.sound_id);
          let rd12 = query112;

          let countLikes = await countLike(row.id);
          let countLikes_count = countLikes[0];

          let countLikes_count_ = await getHeart(row.id);

          let countcomment = await commentCount(row.id);
          let countcomment_count = countcomment[0];

          let liked = await videoLikeDislike(row.id, fb_id);
          let liked_count = liked[0];
          let tag = "regular";
          if (row.for_you == "1") {
            tag = "trending";
          }

          let SoundObject = {
            id: rd12.length > 0 ? rd12[0].id : "",
            audio_path: {
              mp3:
                rd12.length > 0
                  ? API_path +
                    (await customerFunctions.checkFileExist(
                      moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss"),
                      rd12[0].id + ".mp3"
                    ))
                  : "",
              acc:
                rd12.length > 0
                  ? API_path +
                    (await customerFunctions.checkFileExist(
                      moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss"),
                      rd12[0].id + ".aac"
                    ))
                  : "",
            },
            sound_name: rd12.length > 0 ? rd12[0].sound_name : "",
            description: rd12.length > 0 ? rd12[0].description : "",
            thum: rd12.length > 0 ? rd12[0].thum : "",
            section: rd12.length > 0 ? rd12[0].section : "",
            created:
              rd12.length > 0
                ? moment(rd12[0].created).format("YYYY-MM-DD HH:mm:ss")
                : "",
          };

          let get_data = {
            tag: tag,
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              first_name: rd ? rd.first_name : "",
              last_name: rd ? rd.last_name : "",
              profile_pic: rd
                ? customerFunctions.checkProfileURL(rd.profile_pic)
                : "",
              username: rd ? "@" + rd.username : "",
              verified: rd ? rd.verified : "",
            },
            count: {
              like_count: parseInt(countLikes_count.count + countLikes_count_),
              video_comment_count: countcomment_count.count,
              view: parseInt(row.view),
            },
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            marked: row.marked,
            description: row.description,
            type: row.type,
            sound: SoundObject,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
          array_out.push(get_data);
        }

        let output = {
          code: "200",
          msg: array_out,
          total_record_count: countRec,
          per_page_limit: limit,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing5" }],
          total_record_count: "0",
          per_page_limit: "0",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  SearchByHashTagImage: async function (req, res, next) {
    try {
      let event_json = req;
      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let tag = event_json.tag;
        let page = 1;
        let limit = 300;
        let offset = (page - 1) * limit;

        if (typeof event_json.pageNo !== "undefined") {
          page = event_json.pageNo;
          limit = 30;
          offset = (page - 1) * limit;
        }

        let countRec = await sequelize.query(
          "select count(id) as count from videos where vtype='Image' AND description like '%" +
            tag +
            "%'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let token = event_json.token;

        let update =
          "update users set tokon=" +
          pool.escape(token) +
          " where fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(update);

        let query = await sequelize.query(
          "select * from videos where vtype='Image' AND description like '%" +
            tag +
            "%' order by id desc LIMIT " +
            offset +
            ", " +
            limit +
            "",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await usersList(row.fb_id);
          let rd = query1[0];

          let countLikes = await countLike(row.id);
          let countLikes_count = countLikes[0];

          let countLikes_count_ = await getHeart(row.id);

          let countcomment = await commentCount(row.id);
          let countcomment_count = countcomment[0];

          let liked = await videoLikeDislike(row.id, fb_id);
          let liked_count = liked[0];
          let tag = "regular";
          if (row.for_you == "1") {
            tag = "trending";
          }

          let get_data = {
            tag: tag,
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              username: "@" + rd.username,
              verified: rd.verified,
            },
            count: {
              like_count: parseInt(countLikes_count.count + countLikes_count_),
              video_comment_count: countcomment_count.count,
              view: parseInt(row.view),
            },
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            marked: row.marked,
            description: row.description,
            type: row.type,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
          array_out.push(get_data);
        }

        let output = {
          code: "200",
          msg: array_out,
          total_record_count: countRec,
          per_page_limit: limit,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing5" }],
          total_record_count: "0",
          per_page_limit: "0",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  SearchByHashTagClip: async function (req, res, next) {
    try {
      let event_json = req;

      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let tag = event_json.tag;
        let page = 1;
        let limit = 300;
        let offset = (page - 1) * limit;

        if (typeof event_json.pageNo !== "undefined") {
          page = event_json.pageNo;
          limit = 30;
          offset = (page - 1) * limit;
        }

        let countRec = await sequelize.query(
          "select count(id) as count from videos where vtype='Clip' AND description like '%" +
            tag +
            "%'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let token = event_json.token;

        let update =
          "update users set tokon=" +
          pool.escape(token) +
          " where fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(update);

        let query = await sequelize.query(
          "select * from videos where vtype='Clip' AND description like '%" +
            tag +
            "%' order by id desc LIMIT " +
            offset +
            ", " +
            limit +
            "",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let array_out = [];

        for (i = 0; i < query.length; i++) {
          let row = query[i];

          let query1 = await usersList(row.fb_id);
          let rd = query1[0];

          let countLikes = await countLike(row.id);
          let countLikes_count = countLikes[0];

          let countLikes_count_ = await getHeart(row.id);

          let countcomment = await commentCount(row.id);
          let countcomment_count = countcomment[0];

          let liked = await videoLikeDislike(row.id, fb_id);
          let liked_count = liked[0];

          let tag = "regular";
          if (row.for_you == "1") {
            tag = "trending";
          }

          let get_data = {
            tag: tag,
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              first_name: rd.first_name,
              last_name: rd.last_name,
              profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
              username: "@" + rd.username,
              verified: rd.verified,
            },
            count: {
              like_count: parseInt(countLikes_count.count + countLikes_count_),
              video_comment_count: countcomment_count.count,
              view: parseInt(row.view),
            },
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            marked: row.marked,
            description: row.description,
            type: row.type,
            created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
          };
          array_out.push(get_data);
        }

        let output = {
          code: "200",
          msg: array_out,
          total_record_count: countRec,
          per_page_limit: limit,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing5" }],
          total_record_count: "0",
          per_page_limit: "0",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  sendPushNotification: async function (req, res, next) {
    try {
      let event_json = req;

      let rd = await sequelize.query(
        "select * from users where fb_id='" + event_json.receiverid + "'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );
      let tokon = rd.tokon;
      let title = event_json.title;
      let message = event_json.message;
      let icon = event_json.icon;
      let senderid = event_json.senderid;
      let receiverid = event_json.receiverid;
      let action_type = event_json.action_type;

      let notification = {
        to: tokon,
        notification: {
          title: title,
          body: message,
          badge: "1",
          sound: "default",
          icon: "",
          image: "",
          type: "",
        },
        data: {
          title: title,
          body: message,
          badge: "1",
          sound: "default",
          icon: icon,
          senderid: senderid,
          receiverid: receiverid,
          action_type: action_type,
        },
      };
      await customerFunctions.sendPushNotificationToMobileDevice(notification);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  varifiedbankByAdmin: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;
      let id = req.id;
      let verified = req.verified;
      let update =
        "UPDATE bank_detail SET verified ='" +
        verified +
        "' WHERE id ='" +
        id +
        "' AND fb_id =" +
        pool.escape(fb_id) +
        "";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "KYC Updated Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  varifiedWithdrawRequest: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;
      let id = req.id;
      let verified = req.verified;
      let updated = moment().format("YYYY-MM-DD HH:mm:ss");
      let update =
        "UPDATE wallet SET status ='" +
        verified +
        "',updated ='" +
        updated +
        "' WHERE id ='" +
        id +
        "' AND fb_id =" +
        pool.escape(fb_id) +
        "";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "success",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  SendDiamonds: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.receive_fb_id !== "undefined" &&
        typeof req.diamond !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let receive_fb_id = req.receive_fb_id;
        let diamond = req.diamond;
        let desc = fb_id + " send user";
        let diamond1 = "0";
        let balanceDiamond = "0";

        let resDiamCount = await sequelize.query(
          "SELECT count(id) as count FROM `diamond` where fb_id='" +
            fb_id +
            "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        if (resDiamCount.count > 0) {
          let rdm = await sequelize.query(
            "SELECT sum(diamond) as diamond, sum(convertedDiamond) as convertedDiamond FROM `diamond` where fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          diamond1 = rdm.diamond.toString();
          balanceDiamond = rdm.diamond - rdm.convertedDiamond;
          balanceDiamond = balanceDiamond.toString();
        }

        if (diamond <= balanceDiamond) {
          let dated = moment().format("Y-MM-DD");

          let qrry_1 =
            "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`video_id`,`category`, `description`, `diamond`, `convertedDiamond`,`receive_fb_id`, `dated`,`created`)values(";
          qrry_1 += "" + pool.escape(fb_id) + ",";
          qrry_1 += "'-',";
          qrry_1 += "" + pool.escape(receive_fb_id) + ",";
          qrry_1 += "'0',";
          qrry_1 += "'SendByUser',";
          qrry_1 += "" + pool.escape(desc) + ",";
          qrry_1 += "'0',";
          qrry_1 += "'" + diamond + "',";
          qrry_1 += "" + pool.escape(receive_fb_id) + ",";
          qrry_1 += "'" + dated + "',";
          qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_1 += ")";

          await reqInsertTimeEventLiveData(qrry_1);

          let output = {
            code: "200",
            msg: "Diamond send Successfully",
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: "You don't have enough Diamonds",
          };
          res.status(200).json(output);
        }
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

  Subscription: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.subscription !== "undefined" &&
        typeof req.amount !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let subscription = req.subscription;
        let amount = req.amount;
        let paymentstatus = req.paymentstatus;
        let desc = fb_id + " subscription purchased";
        let transaction_id = req.transaction_id;
        let start_date = req.start_date;
        let end_date = req.end_date;

        let qrry_1 =
          "insert into subscription(`subscription`, `amount`, `fb_id`,`category`, `description`, `transaction_id`, `paymentstatus`,`start_date`,`end_date`,`created`)values(";
        qrry_1 += "'" + subscription + "',";
        qrry_1 += "'" + amount + "',";
        qrry_1 += "'" + fb_id + "',";
        qrry_1 += "'SubscriptionPurchased',";
        qrry_1 += "'" + desc + "',";
        qrry_1 += "'" + transaction_id + "',";
        qrry_1 += "'" + paymentstatus + "',";
        qrry_1 += "'" + start_date + "',";
        qrry_1 += "'" + end_date + "',";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);
        let output = {
          code: "200",
          msg: "Subscription Purchased Successfully",
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

  PurchaseSubscription: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.subscription !== "undefined" &&
        typeof req.amount !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let subscription = req.subscription;
        let paymentstatus = req.payment_status;
        let amount = req.amount;
        let start_date = req.start_date;
        let end_date = req.end_date;
        let desc = req.desc;

        let transaction_id = Math.floor(Math.random() * 9000000000) + 1;

        let dated = moment().format("Y-MM-DD");

        let qrry_1 =
          "insert into payment(`fb_id`, `description`, `amount`, `transaction_id`,`status`, `dated`,`created`,`updated`)values(";
        qrry_1 += "'" + fb_id + "',";
        qrry_1 += "'" + desc + "',";
        qrry_1 += "'" + amount + "',";
        qrry_1 += "'" + transaction_id + "',";
        qrry_1 += "'0',";
        qrry_1 += "'" + dated + "',";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "',";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);

        let qrry_2 =
          "insert into subscription(`subscription`, `amount`, `fb_id`,`category`, `description`, `transaction_id`, `paymentstatus`,`start_date`,`end_date`,`created`)values(";
        qrry_2 += "'" + subscription + "',";
        qrry_2 += "'" + amount + "',";
        qrry_2 += "'" + fb_id + "',";
        qrry_2 += "'SubscriptionPurchased',";
        qrry_2 += "'" + desc + "',";
        qrry_2 += "'" + transaction_id + "',";
        qrry_2 += "'" + paymentstatus + "',";
        qrry_2 += "'" + start_date + "',";
        qrry_2 += "'" + end_date + "',";
        qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_2 += ")";
        await reqInsertTimeEventLiveData(qrry_2);
        let output = {
          code: "200",
          transaction_id: transaction_id,
          msg: "Subscription Purchased Successfully",
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

  PurchaseDiamonds: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.amount !== "undefined" &&
        typeof req.diamond !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let diamond = req.diamond;
        let amount = req.amount;
        let desc = req.description;
        let payment_status = req.payment_status;
        let dated = moment().format("Y-MM-DD");
        let transaction_id = Math.floor(Math.random() * 9000000000) + 1;

        let qrry_1 =
          "insert into payment(`fb_id`, `description`, `amount`, `transaction_id`,`status`, `dated`, `created`, `updated`)values(";
        qrry_1 += "'" + fb_id + "',";
        qrry_1 += "'" + desc + "',";
        qrry_1 += "'" + amount + "',";
        qrry_1 += "'" + transaction_id + "',";
        qrry_1 += "'0',";
        qrry_1 += "'" + dated + "',";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "',";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);

        let qrry_2 =
          "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`video_id`,`category`, `description`, `diamond`,`amount`, `convertedDiamond`,`transaction_id`, `dated`, `created`,`paymentstatus`)values(";
        qrry_2 += "'" + fb_id + "',";
        qrry_2 += "'-',";
        qrry_2 += "'-',";
        qrry_2 += "'0',";
        qrry_2 += "'PurchasedManual',";
        qrry_2 += "'" + desc + "',";
        qrry_2 += "'" + diamond + "',";
        qrry_2 += "'" + amount + "',";
        qrry_2 += "'0',";
        qrry_2 += "'" + transaction_id + "',";
        qrry_2 += "'" + dated + "',";
        qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "',";
        qrry_2 += "'" + payment_status + "'";
        qrry_2 += ")";
        await reqInsertTimeEventLiveData(qrry_2);
        let output = {
          code: "200",
          transaction_id: transaction_id,
          msg: "Diamond Purchased Successfully",
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

  addUserAsMarkacceptdiamond: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;

      let update =
        "update  users set acceptdiamonds='1' where fb_id ='" + fb_id + "'";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "updated",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addUserAsMark: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;

      let update = "update  users set marked='1' where fb_id ='" + fb_id + "'";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "updated",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  removefrommarkedacceptdiamondsuser: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;

      let update =
        "update  users set acceptdiamonds='0' where fb_id ='" + fb_id + "'";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "Removed from Marked",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  upipaymentstatusupdate: async function (req, res, next) {
    try {
      let merchTxnId = req.merchTxnId;
      let status = req.status;

      let qrry_1 =
        "update  payment set status = '" +
        status +
        "' where transaction_id ='" +
        merchTxnId +
        "'";
      await reqInsertTimeEventLiveData(qrry_1);

      let qrry_3 =
        "update  subscription set paymentstatus = '" +
        status +
        "' where transaction_id ='" +
        merchTxnId +
        "'";
      await reqInsertTimeEventLiveData(qrry_3);

      let qrry_4 =
        "update  diamond set paymentstatus = '" +
        status +
        "' where transaction_id ='" +
        merchTxnId +
        "'";
      await reqInsertTimeEventLiveData(qrry_4);

      let output = {
        code: "200",
        response: "",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addDiamondsToUserWallet: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.amount !== "undefined" &&
        typeof req.diamond !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let diamond = req.diamond;
        let amount = req.amount;
        let desc = req.description;
        let payment_status = req.payment_status;
        let dated = moment().format("Y-MM-DD");
        let transaction_id = req.transaction_id;

        let qrry_2 =
          "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`video_id`,`category`, `description`, `diamond`,`amount`, `convertedDiamond`,`transaction_id`, `dated`,`created`,`paymentstatus`)values(";
        qrry_2 += "'" + fb_id + "',";
        qrry_2 += "'-',";
        qrry_2 += "'-',";
        qrry_2 += "'0',";
        qrry_2 += "'PurchasedManual',";
        qrry_2 += "'" + desc + "',";
        qrry_2 += "'" + diamond + "',";
        qrry_2 += "'" + amount + "',";
        qrry_2 += "'0',";
        qrry_2 += "'" + transaction_id + "',";
        qrry_2 += "'" + dated + "',";
        qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "',";
        qrry_2 += "'" + payment_status + "'";
        qrry_2 += ")";
        await reqInsertTimeEventLiveData(qrry_2);
        let output = {
          code: "200",
          transaction_id: transaction_id,
          msg: "Diamond Purchased Successfully",
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

  removefromsubscribmarked: async function (req, res, next) {
    try {
      let fb_id = req.fb_id;

      let update =
        "UPDATE users set subscriber='0' where fb_id='" + fb_id + "'";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "Removed from Marked",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getVerifiedNew: async function (req, res, next) {
    try {
      let fb_id = req.body.fb_id;
      let attachment = req.body.attachment ? req.body.attachment : "";
      let attachment1 = req.body.attachment1 ? req.body.attachment1 : "";
      let facebook = req.body.facebook;
      let youtube = req.body.youtube;
      let instagram = req.body.instagram;

      let dirName = moment().format("MMMMYYYY");
      let newPath = "UpLoad/UpLoad/" + dirName;

      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, {
          recursive: true,
        });
      }

      if (!fs.existsSync(newPath + "/images")) {
        fs.mkdirSync(newPath + "/images", {
          recursive: true,
        });
      }

      let attachmentURL = "";

      if (attachment != "") {
        let fileName = Date.now() + "_" + uuidv4();
        attachmentURL = newPath + "/images/" + fileName + ".png";
        fs.writeFileSync(attachmentURL, attachment, "base64");
        if (process.env.media_storage == "ftp") {
          let createImageFolder = newPath + "/images";
          await CreateDirectoryToFTP(createImageFolder);
          await uploadFileToFTP(attachmentURL, attachmentURL);
          fs.unlinkSync(attachmentURL);
        }

        if (process.env.media_storage == "s3") {
          await uploadToS3(attachmentURL, attachmentURL);
          fs.unlinkSync(attachmentURL);
        }
      }

      let attachment1URL = "";

      if (attachment1 != "") {
        let fileName = Date.now() + "_" + uuidv4();
        attachment1URL = newPath + "/images/" + fileName + ".png";
        fs.writeFileSync(attachment1URL, attachment1, "base64");
        if (process.env.media_storage == "ftp") {
          let createImageFolder = newPath + "/images";
          await CreateDirectoryToFTP(createImageFolder);
          await uploadFileToFTP(attachment1URL, attachment1URL);
          fs.unlinkSync(attachment1URL);
        }
        if (process.env.media_storage == "s3") {
          await uploadToS3(attachment1URL, attachment1URL);
          fs.unlinkSync(attachment1URL);
        }
      }

      let qrry_2 =
        "insert into verification_request(fb_id,attachment,attachment1, facebook, youtube, instagram,created)values(";
      qrry_2 += "'" + fb_id + "',";
      qrry_2 += "" + pool.escape(attachmentURL) + ",";
      qrry_2 += "" + pool.escape(attachment1URL) + ",";
      qrry_2 += "" + pool.escape(facebook) + ",";
      qrry_2 += "" + pool.escape(youtube) + ",";
      qrry_2 += "" + pool.escape(instagram) + ",";
      qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
      qrry_2 += ")";
      await reqInsertTimeEventLiveData(qrry_2);

      let output = {
        code: "200",
        msg: [{ response: "successful" }],
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  follow_multiple_user: async function (req, res, next) {
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.followed_fb_id !== "undefined" &&
        typeof req.status !== "undefined"
      ) {
        let fb_id = req.fb_id;
        let followed_fb_ids = req.followed_fb_id;
        let status = req.status;

        if (followed_fb_ids.length > 0) {
          let output = {};

          for (i = 0; i < followed_fb_ids.length; i++) {
            let followed_fb_id = followed_fb_ids[i];

            if (status == "0") {
              let deletes =
                "Delete from follow_users where fb_id ='" +
                fb_id +
                "' and followed_fb_id='" +
                followed_fb_id +
                "'";
              await reqInsertTimeEventLiveData(deletes);

              output = {
                code: "200",
                msg: [{ response: "unfollow" }],
              };
            } else {
              let cnt = await sequelize.query(
                "select count(fb_id) as count from follow_users where fb_id ='" +
                  fb_id +
                  "' and followed_fb_id='" +
                  followed_fb_id +
                  "'",
                {
                  type: sequelize.QueryTypes.SELECT,
                  plain: true,
                }
              );

              if (cnt.count == 0) {
                let qrry_1 =
                  "insert into follow_users(fb_id, followed_fb_id)values(";
                qrry_1 += "'" + fb_id + "',";
                qrry_1 += "'" + followed_fb_id + "'";
                qrry_1 += ")";
                await reqInsertTimeEventLiveData(qrry_1);

                let qrry_2 =
                  "insert into notification(my_fb_id,effected_fb_id,type,value,created)values(";
                qrry_2 += "'" + fb_id + "',";
                qrry_2 += "'" + followed_fb_id + "',";
                qrry_2 += "'following_you',";
                qrry_2 += "'',";
                qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
                qrry_2 += ")";
                await reqInsertTimeEventLiveData(qrry_2);

                let rd1 = await sequelize.query(
                  "select * from users where fb_id='" + followed_fb_id + "'",
                  {
                    type: sequelize.QueryTypes.SELECT,
                    plain: true,
                  }
                );

                let rd11 = await sequelize.query(
                  "select * from users where fb_id='" + fb_id + "'",
                  {
                    type: sequelize.QueryTypes.SELECT,
                    plain: true,
                  }
                );

                let title = rd11.first_name + " started following you";
                let message =
                  "You have received 1 more follwing to your profile";

                let notification = {
                  to: rd1.tokon,
                  data: {
                    title: title,
                    body: message,
                    fb_id: fb_id,
                    icon: customerFunctions.checkVideoUrl(rd11.profile_pic),
                  },
                };

                let ss =
                  await customerFunctions.sendPushNotificationToMobileDevice(
                    notification
                  );

                output = {
                  code: "200",
                  msg: [{ response: "follow successful" }],
                  notification_data: notification,
                  fire_data: ss,
                };
              } else {
                output = {
                  code: "200",
                  msg: [{ response: "success" }],
                };
              }
            }
          }
          res.status(200).json(output);
        } else {
          let output = {
            code: "200",
            msg: [{ response: "success" }],
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing18" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  uploadAudio: async function (req, res, next) {
    try {
      if (typeof req.body.fb_id !== "undefined") {
        let fb_id = req.body.fb_id;
        let description = req.body.description;
        let category = req.body.category;
        let sound_id = req.body.sound_id;
        let v_location = req.body.v_location;
        category = category.toLowerCase();

        let dirName = moment().format("MMMMYYYY");
        let newPath = "UpLoad/UpLoad/" + dirName;
        let newTmp = "UpLoad/TMP";

        if (!fs.existsSync(newTmp)) {
          fs.mkdirSync(newTmp, {
            recursive: true,
          });
        }

        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath, {
            recursive: true,
          });
        }

        if (!fs.existsSync(newPath + "/thum")) {
          fs.mkdirSync(newPath + "/thum", {
            recursive: true,
          });
        }

        if (!fs.existsSync(newPath + "/audio")) {
          fs.mkdirSync(newPath + "/audio", {
            recursive: true,
          });
        }

        let fileName = Date.now() + "_" + uuidv4();
        let thum_url = newPath + "/thum/" + fileName + ".jpg";

        if (typeof req.files.audio_file !== "undefined") {
          let portfolio = req.files.audio_file;
          let tempName = Date.now() + uuidv4() + portfolio.name;
          let orignalVideoPath = "UpLoad/TMP/" + tempName;
          let uploadPortfolio = "UpLoad/TMP/" + tempName;
          portfolio.mv(uploadPortfolio, async function (err) {
            if (err) {
              // console.log(err);
            } else {
              if (typeof req.files.image_file !== "undefined") {
                let image_file = req.files.image_file;
                let tempName = Date.now() + uuidv4() + image_file.name;
                let uploadImage = "UpLoad/TMP/" + tempName;
                image_file.mv(uploadImage, async function (err) {
                  if (err) {
                    // console.log(err);
                  } else {
                    if (process.env.media_storage == "ftp") {
                      let createImageFolder = newPath + "/thum";
                      await CreateDirectoryToFTP(createImageFolder);
                      await uploadFileToFTP(uploadImage, thum_url);
                      fs.unlinkSync(uploadImage);
                    }

                    if (process.env.media_storage == "s3") {
                      await uploadToS3(uploadImage, thum_url);
                      fs.unlinkSync(uploadImage);
                    }

                    if (process.env.media_storage == "local") {
                      fs.copyFile(uploadImage, thum_url, (error) => {
                        if (error) {
                        } else {
                          // console.log(
                          //   "Image File has been moved to another folder."
                          // );
                          fs.unlinkSync(uploadImage);
                        }
                      });
                    }
                  }
                });
              }

              if (sound_id == "") {
                let rd101 = await usersList(fb_id);

                let soundName = "Orignal Sound - " + rd101[0]["first_name"];

                let qrry_1 =
                  "insert into sound(sound_name,description,section,uploaded_by,thum)values(";
                qrry_1 += "" + pool.escape(soundName) + ",";
                qrry_1 += "" + pool.escape(description) + ",";
                qrry_1 += "'',";
                qrry_1 += "'" + fb_id + "',";
                qrry_1 += "" + pool.escape(thum_url) + "";
                qrry_1 += ")";
                let last_id = await reqInsertTimeEventLiveData(qrry_1);
                let insert_id = last_id.insertId;

                sound_id = insert_id;

                // *********generate mp3 file start**********//

                let copy = newPath + "/audio/" + insert_id + ".mp3";
                if (process.env.media_storage == "ftp") {
                  let createAudioFolder = newPath + "/audio";
                  await CreateDirectoryToFTP(createAudioFolder);
                  await uploadFileToFTP(orignalVideoPath, copy);
                }

                if (process.env.media_storage == "s3") {
                  await uploadToS3(orignalVideoPath, copy);
                }

                if (process.env.media_storage == "local") {
                  fs.copyFile(orignalVideoPath, copy, (error) => {
                    if (error) {
                    } else {
                      // console.log("Mp3 File has been moved to another folder.");
                    }
                  });
                }

                // *********generate mp3 file end**********//

                // *********generate aac file start**********//
                let generateAacFromMp3 = "UpLoad/TMP/" + fileName + ".aac";
                ffmpeg(orignalVideoPath)
                  .output(generateAacFromMp3)
                  .on("error", function (err) {
                    // console.log(err);
                  })
                  .on("end", async function (err) {
                    let copy = newPath + "/audio/" + insert_id + ".aac";

                    if (process.env.media_storage == "ftp") {
                      let createAudioFolder = newPath + "/audio";
                      await CreateDirectoryToFTP(createAudioFolder);
                      await uploadFileToFTP(generateAacFromMp3, copy);
                      fs.unlinkSync(generateAacFromMp3);
                      fs.unlinkSync(orignalVideoPath);
                    }

                    if (process.env.media_storage == "s3") {
                      await uploadToS3(generateAacFromMp3, copy);
                      fs.unlinkSync(generateAacFromMp3);
                      fs.unlinkSync(orignalVideoPath);
                    }

                    if (process.env.media_storage == "local") {
                      fs.copyFile(generateAacFromMp3, copy, (error) => {
                        if (error) {
                          // console.log(error);
                        } else {
                          // console.log(
                          //   "aac File has been moved to another folder."
                          // );
                          fs.unlinkSync(orignalVideoPath);
                          fs.unlinkSync(generateAacFromMp3);
                        }
                      });
                    }
                  })
                  .run();

                let output = {
                  code: "200",
                  msg: [{ response: "file uploaded" }],
                };
                res.status(200).json(output);
                // *********generate aac file start**********//
              }
            }
          });
        }
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  checkatomtechpaymentstatus: async function (req, res, next) {
    try {
      let merchTxnId = req.merchTxnId;
      let amount = req.amount;
      let merchTxnDate = req.merchTxnDate;

      let txn_curn = "INR";
      let api = "TXNVERIFICATION";

      let str = merchId + merchPass + merchTxnId + amount + txn_curn + api;

      let signature = crypto
        .createHmac("sha512", req_salt)
        .update(str)
        .digest("hex");

      const jsondata =
        '{ "payInstrument" : { "headDetails" : { "api" : "TXNVERIFICATION", "source" : "source" }, "merchDetails" : { "merchId" : ' +
        merchId +
        ', "password" : "' +
        merchPass +
        '", "merchTxnId" : "' +
        merchTxnId +
        '", "merchTxnDate" : "' +
        merchTxnDate +
        '" }, "payDetails" : { "amount" : ' +
        amount +
        ', "txnCurrency" : "' +
        txn_curn +
        '", "signature" :  "' +
        signature +
        '" }}}';
      const JSONString = jsondata;
      let encDataR = encrypt(JSONString);
      var req = unirest("POST", Authurl); // change url in case of production
      req.headers({
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
      });

      req.form({
        encData: encDataR,
        merchId: merchId,
      });

      req.end(async function (ress) {
        if (ress.error) throw new Error(ress.error);
        let datas = ress.body;
        var arr = datas.split("&").map(function (val, index) {
          return val;
        });
        var arrTwo = arr[0].split("=").map(function (val, index) {
          return val;
        });

        var decrypted_data = decrypt(arrTwo[1]);

        let jsonData = JSON.parse(decrypted_data);

        let resstatus =
          jsonData["payInstrument"][0]["responseDetails"]["statusCode"];
        let status = 0;

        if (resstatus == "OTS0000") {
          status = 1;
        } else {
          status = 2;
        }

        let qrry_1 =
          "update  payment set status = '" +
          status +
          "' where transaction_id ='" +
          merchTxnId +
          "'";
        await reqInsertTimeEventLiveData(qrry_1);

        let qrry_2 =
          "update  payment set response = '" +
          decrypted_data +
          "' where transaction_id ='" +
          merchTxnId +
          "'";
        await reqInsertTimeEventLiveData(qrry_2);

        let qrry_3 =
          "update  subscription set paymentstatus = '" +
          status +
          "' where transaction_id ='" +
          merchTxnId +
          "'";
        await reqInsertTimeEventLiveData(qrry_3);

        let qrry_4 =
          "update  diamond set paymentstatus = '" +
          status +
          "' where transaction_id ='" +
          merchTxnId +
          "'";
        await reqInsertTimeEventLiveData(qrry_4);

        let output = {
          code: "200",
          response: jsonData,
        };
        res.status(200).json(output);
      });
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  cropAAC: async function (req, res, next) {
    try {
      if (
        typeof req.aacFile !== "undefined" &&
        typeof req.fromSecond !== "undefined" &&
        typeof req.totalSecond !== "undefined"
      ) {
        let aacFile = req.aacFile;
        let fromSecond = req.fromSecond;
        let totalSecond = req.totalSecond;
        let tempName = Date.now() + uuidv4();

        let orignalAACPath = "UpLoad/TMP/" + tempName + ".aac";
        let orignalAACPath1 = "UpLoad/" + tempName + ".aac";

        await getFromS3(orignalAACPath1, aacFile);

        ffmpeg(orignalAACPath1)
          .addOptions(["-ss " + fromSecond, "-t " + totalSecond, "-c copy"])
          .output(orignalAACPath)
          .on("error", function (err, stdout, stderr) {
            // console.log(err);
            let output = {
              code: "201",
              msg: "File does not exist",
              aacFile: "",
            };
            res.status(200).json(output);
          })
          .on("end", async function () {
            if (process.env.media_storage == "s3") {
              await uploadToS3(orignalAACPath, orignalAACPath);
              fs.unlinkSync(orignalAACPath);
              fs.unlinkSync(orignalAACPath1);
            }
            if (process.env.media_storage == "ftp") {
              await CreateDirectoryToFTP(orignalAACPath);
              await uploadFileToFTP(orignalAACPath, orignalAACPath);
            }
            let output = {
              code: "200",
              msg: "Success",
              aacFile: API_path + orignalAACPath,
            };
            // console.log(output);
            res.status(200).json(output);
          })
          .run();
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getHashtagList: async function (req, res, next) {
    try {
      let keyword = req.keyword;

      let query = await sequelize.query(
        "select description from videos where description like '%" +
          keyword +
          "%' order by rand()",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let str = query[i].description;
        str.split(" ").map(function (ta, index) {
          if (ta.indexOf("#" + keyword) === 0) {
            ta.split("#").map(function (ta1, index1) {
              if (ta1.indexOf(keyword) === 0) {
                array_out.push("#" + ta1);
              }
            });
          }
        });
      }
      let uniqueItems = [...new Set(array_out)];
      let output = {
        code: "200",
        data: uniqueItems,
        message: "Data found",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  uploads3Video: async function (req, res, next) {
    try {
      await uploadToS3();
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  maintanancMode: async function (req, res, next) {
    try {
      let output = {
        code: "201",
        msg: [{ response: "Server Under Maintenance" }],
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getAllState: async function (req, res, next) {
    try {
      let query = await sequelize.query(
        "select LOWER(name) as name,id from states",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];
        let states = await sequelize.query(
          "select count(location) as count from users where LOWER(location) like '%" +
            row.name +
            "%'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        let get_data = {
          id: row.id,
          name: row.name,
          count: states.count,
        };
        array_out.push(get_data);
      }
      let output = {
        code: "200",
        data: array_out,
        message: "Data found",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getCitiesbyState: async function (req, res, next) {
    try {
      let keyword = req.state_id;

      let query = await sequelize.query(
        "select LOWER(city) as city from cities where state_id='" +
          keyword +
          "'",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let cities = await sequelize.query(
          "select count(location) as count from users where location like '%" +
            row.city +
            "%'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );
        let get_data = {
          name: row.city,
          count: cities.count,
        };
        array_out.push(get_data);
      }
      let output = {
        code: "200",
        data: array_out,
        message: "Data found",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  allowDownload: async function (req, res, next) {
    try {
      let id = req.id;
      let vals = req.vals;

      let update =
        "update videos SET allowDownload ='" +
        vals +
        "' WHERE id ='" +
        id +
        "'";
      await reqInsertTimeEventLiveData(update);

      let output = {
        code: "200",
        msg:
          vals == 1
            ? "Clip set as Allow Download"
            : "Clip set as Deny Download",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  allsubscriber: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let search = req.data.search ? pool.escape(req.data.search) : "";
      let type = req.data.type;
      let qq = "";

      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  u.username like "%" ' + search + ' "%"';
        }
      }
      if (type == "phone") {
        if (search != "") {
          qq = ' AND  u.phone like "%" ' + search + ' "%"';
        }
      }
      if (type == "name") {
        if (search != "") {
          qq =
            ' AND  CONCAT(u.first_name, " ", u.last_name) like "%" ' +
            search +
            ' "%"';
        }
      }
      if (type == "transaction") {
        if (search != "") {
          qq = ' AND  s.transaction_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "subscription") {
        if (search != "") {
          qq = ' AND  s.subscription like "%" ' + search + ' "%"';
        }
      }
      if (type == "addedon") {
        if (search != "") {
          qq = ' AND  s.created like "%" ' + search + ' "%"';
        }
      }

      const countRec = await sequelize.query(
        "SELECT count(s.fb_id) as count FROM subscription s, users u where u.fb_id=s.fb_id and s.paymentstatus=1 " +
          qq +
          "",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let parameters =
        "SELECT s.id,u.username, u.email, u.phone, u.first_name, u.last_name, s.fb_id,s.subscription,s.amount,s.transaction_id, s.start_date,s.end_date,s.created,s.paymentstatus FROM subscription s, users u where u.fb_id=s.fb_id and s.paymentstatus=1 " +
        qq +
        " order by s.id DESC LIMIT " +
        offset +
        ", " +
        limit +
        "";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      let output = {
        code: "200",
        msg: "Success",
        data: query,
        total_record: Math.ceil(countRec.count / limit),
        no_of_records_per_page: limit,
        total_number: countRec.count,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  allfailedsubscriber: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let search = req.data.search ? pool.escape(req.data.search) : "";
      let type = req.data.type;
      let qq = "";

      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  u.username like "%" ' + search + ' "%"';
        }
      }
      if (type == "name") {
        if (search != "") {
          qq =
            ' AND  CONCAT(u.first_name, " ", u.last_name) like "%" ' +
            search +
            ' "%"';
        }
      }
      if (type == "transaction") {
        if (search != "") {
          qq = ' AND  s.transaction_id like "%" ' + search + ' "%"';
        }
      }
      if (type == "subscription") {
        if (search != "") {
          qq = ' AND  s.subscription like "%" ' + search + ' "%"';
        }
      }
      if (type == "addedon") {
        if (search != "") {
          qq = ' AND  s.created like "%" ' + search + ' "%"';
        }
      }

      const countRec = await sequelize.query(
        "SELECT count(s.fb_id) as count FROM subscription s, users u where u.fb_id=s.fb_id and s.paymentstatus!=1 " +
          qq +
          "",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let parameters =
        "SELECT u.username, u.email, u.phone, u.first_name, u.last_name, s.fb_id,s.subscription,s.amount,s.transaction_id, s.start_date,s.end_date,s.created,s.paymentstatus FROM subscription s, users u where u.fb_id=s.fb_id and s.paymentstatus!=1 " +
        qq +
        " GROUP by s.fb_id order by s.id DESC LIMIT " +
        offset +
        ", " +
        limit +
        "";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      let output = {
        code: "200",
        msg: "Success",
        data: query,
        total_record: Math.ceil(countRec.count / limit),
        no_of_records_per_page: limit,
        total_number: countRec.count,
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

  addupisubscriber: async function (req, res, next) {
    try {
      let dated = moment().format("YYYY-MM-DD HH:mm:ss");
      let fb_id = req.fbid;
      let amount = req.subscription;
      let start_date = moment(req.startdate).format("Y-MM-DD");
      let category = "Purchased upi";
      let description = "upi";
      let subscription = "";
      let end_date = "";

      if (amount == "19") {
        subscription = "BRONZE";
        end_date = moment(start_date).add(10, "days").format("Y-MM-DD");
      }

      if (amount == "39") {
        subscription = "SILVER";
        end_date = moment(start_date).add(20, "days").format("Y-MM-DD");
      }

      if (amount == "59") {
        subscription = "GOLD";
        end_date = moment(start_date).add(30, "days").format("Y-MM-DD");
      }

      if (amount == "99") {
        subscription = "PLATINUM";
        end_date = moment(start_date).add(60, "days").format("Y-MM-DD");
      }

      let transaction_id = "UPI";
      let created = dated;
      let paymentstatus = "1";

      let qrry_1 =
        "insert into subscription(`fb_id`, `category`, `description`,`subscription`,`amount`,`transaction_id`,`start_date`,`end_date`,`created`,`paymentstatus`)values(";
      qrry_1 += "'" + fb_id + "',";
      qrry_1 += "'" + category + "',";
      qrry_1 += "'" + description + "',";
      qrry_1 += "'" + subscription + "',";
      qrry_1 += "'" + amount + "',";
      qrry_1 += "'" + transaction_id + "',";
      qrry_1 += "'" + start_date + "',";
      qrry_1 += "'" + end_date + "',";
      qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "',";
      qrry_1 += "'" + paymentstatus + "'";
      qrry_1 += ")";
      await reqInsertTimeEventLiveData(qrry_1);

      let output = {
        code: "200",
        msg: "Your data submitted successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addVidAmount: async function (req, res, next) {
    try {
      let id = req.id;
      let fb_id = req.fb_id;
      let vals = req.vals;
      let ref = "Earn from Video";

      let r005 = await sequelize.query(
        "select * from diamond where video_id='" + id + "'",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (r005.length > 0) {
        let wid = r005[0].id;
        if (vals == "0") {
          let deletes = "delete from diamond  where id='" + wid + "'";
          await reqInsertTimeEventLiveData(deletes);
        } else {
          let update =
            "update diamond SET diamond ='" +
            vals +
            "' WHERE fb_id ='" +
            fb_id +
            "'";
          await reqInsertTimeEventLiveData(update);
        }
      } else {
        if (vals != "0") {
          let dated = moment().format("Y-MM-DD");
          let qrry_2 =
            "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`video_id`,`category`, `description`, `diamond`, `convertedDiamond`, `dated`, `created`)values(";
          qrry_2 += "'" + fb_id + "',";
          qrry_2 += "'-',";
          qrry_2 += "'-',";
          qrry_2 += "'" + id + "',";
          qrry_2 += "'Video',";
          qrry_2 += "" + pool.escape(ref) + ",";
          qrry_2 += "" + pool.escape(vals) + ",";
          qrry_2 += "'0',";
          qrry_2 += "'" + dated + "',";
          qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_2 += ")";
          await reqInsertTimeEventLiveData(qrry_2);
        }
      }
      let output = {
        code: "200",
        msg: "Diamond Updated",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  setOrderVideosExplore: async function (req, res, next) {
    try {
      let vals = req.vals;
      let id = req.id;
      let update =
        "UPDATE video_explore SET orderBy ='" +
        vals +
        "' WHERE id ='" +
        id +
        "'";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "Success, Order set",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  setOrderVideosExploreHashtag: async function (req, res, next) {
    try {
      let orders = req.orders;
      let id = req.id;
      let update =
        "UPDATE explore_hashtag SET orders ='" +
        orders +
        "' WHERE id ='" +
        id +
        "'";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "Success, Order set",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  diamondHistory: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let fb_id = req.data.fb_id;
      let search = req.data.search ? pool.escape(req.data.search) : "";
      let qq = "";

      if (search != "") {
        qq =
          ' AND  description like "%" ' +
          search +
          ' "%" OR category like "%" ' +
          search +
          ' "%" OR diamond like "%" ' +
          search +
          ' "%" OR convertedDiamond like "%" ' +
          search +
          ' "%"';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let ru = await sequelize.query(
        "SELECT fb_id,username, first_name,last_name  FROM users where fb_id='" +
          fb_id +
          "'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let query = await getUserdDiamond(qq, fb_id, offset, limit);
      let queryCount = await getUserdDiamondCount(qq, fb_id);

      let countRec =
        queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;

      let output = {
        code: "200",
        msg: "Success",
        data: query,
        total_record: countRec,
        total_number: queryCount.length > 0 ? queryCount[0].count : 0,
        no_of_records_per_page: limit,
        username: ru.username,
        first_name: ru.first_name,
        last_name: ru.last_name,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  admin_show_allMarkedsubscribUser: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let search = req.data.search ? pool.escape(req.data.search) : "";
      let qq = "";

      if (search != "") {
        qq =
          ' AND  fb_id like "%" ' +
          search +
          ' "%" OR username like "%" ' +
          search +
          ' "%" OR first_name like "%" ' +
          search +
          ' "%" OR last_name like "%" ' +
          search +
          ' "%" OR email like "%" ' +
          search +
          ' "%"';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;
      // let query = await getAllUser(qq, offset, limit);

      let parameters =
        "select (select count(p.followed_fb_id) from follow_users p where a.fb_id = p.followed_fb_id) follow_count, (select count(v.fb_id) from videos v where a.fb_id = v.fb_id) vid_count, fb_id,username,first_name,last_name,profile_pic,device,location,created from users a where subscriber='1' " +
        qq +
        " order by created DESC LIMIT " +
        offset +
        ", " +
        limit +
        "";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      const countRec = await sequelize.query(
        "select count(*) as count from users where subscriber='1' " + qq + "",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let array_out = [];
      for (i = 0; i < query.length; i++) {
        let row = query[i];

        let get_data = {
          id: row.id,
          fb_id: row.fb_id,
          video_count: row.vid_count,
          follow_count: row.follow_count,
          username: "@" + row.username,
          first_name: row.first_name,
          last_name: row.last_name,
          profile_pic: row.profile_pic,
          location: row.location,
          device: row.device,
          created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
        };
        array_out.push(get_data);
      }
      let output = {
        code: "200",
        msg: array_out,
        total_record: Math.ceil(countRec[0].count / limit),
        no_of_records_per_page: limit,
        total_number: countRec[0].count,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getPanelHashtagList: async function (req, res, next) {
    try {
      let keyword = "";

      let query = await sequelize.query(
        "select description from videos order by id desc limit 5",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let array_out = [];

      for (i = 0; i < query.length; i++) {
        let str = query[i].description;

        str.split(" ").map(function (ta, index) {
          if (ta.indexOf("#" + keyword) === 0) {
            ta.split("#").map(function (ta1, index1) {
              if (ta1 != "") {
                array_out.push(ta1.toLowerCase());
              }
            });
          }
        });
      }
      let uniqueItems = [...new Set(array_out)];
      let output = {
        code: "200",
        data: uniqueItems,
        message: "Data found",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getAddedPanelHashtagList: async function (req, res, next) {
    try {
      let page = req.data.page - 1;
      let search = req.data.search ? pool.escape(req.data.search) : "";
      let qq = "";

      if (search != "") {
        qq = ' where  hashtag like "%" ' + search + ' "%"';
      }

      let limit = req.data.rowsPerPage;
      let offset = page * limit;

      let parameters =
        "select * from explore_hashtag " +
        qq +
        " order by orders ASC LIMIT " +
        offset +
        ", " +
        limit +
        "";
      const query = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      let parameters1 =
        "select count(*) as count from explore_hashtag " + qq + "";
      const countRec = await sequelize.query(`${parameters1}`, {
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      });

      let output = {
        code: "200",
        msg: query,
        total_record: Math.ceil(countRec.count / limit),
        no_of_records_per_page: limit,
        total_number: countRec.count,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  removeAddedPanelHashtagList: async function (req, res, next) {
    try {
      let id = req.id;
      let deletes = "delete from explore_hashtag where id='" + id + "'";
      await reqInsertTimeEventLiveData(deletes);
      let output = {
        code: "200",
        msg: "Hashtag removed",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  addhashtag2explore: async function (req, res, next) {
    try {
      let hash = req.hash;
      for (i = 0; i < hash.length; i++) {
        let row = hash[i];
        let countRec = await sequelize.query(
          "SELECT count(*) as count FROM explore_hashtag where hashtag=" +
            pool.escape(row) +
            "",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        if (countRec.count == 0) {
          let qrry_1 = "insert into explore_hashtag(hashtag)values(";
          qrry_1 += "" + pool.escape(row) + "";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);
        }
      }

      let output = {
        code: "200",
        msg: "Explore Hashtag Added",
      };
      res.status(200).json(output);
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
  removefromsubscribmarked: async function (req, res, next) {
    try {
      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id;
        let update =
          "UPDATE users set subscriber='0' where fb_id='" + fb_id + "'";
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

  getKycDashboard: async function (req, res, next) {
    try {
      let pendingCount = await sequelize.query(
        "SELECT count(*) as count FROM bank_detail w, users u where u.fb_id=w.fb_id and w.verified='No'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let approvedCount = await sequelize.query(
        "SELECT count(*) as count FROM bank_detail w, users u where u.fb_id=w.fb_id and w.verified='Yes'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let rejectCount = await sequelize.query(
        "SELECT count(*) as count FROM bank_detail w, users u where u.fb_id=w.fb_id and w.verified='Reject'",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let output = {
        code: "200",
        pending: pendingCount.count,
        approved: approvedCount.count,
        reject: rejectCount.count,
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

  // getAllCreatorMonthsByYear: async function (req, res, next) {
  //   try {
  //     const records = [
  //       "01",
  //       "02",
  //       "03",
  //       "04",
  //       "05",
  //       "06",
  //       "07",
  //       "08",
  //       "09",
  //       "10",
  //       "11",
  //       "12",
  //     ];

  //     let array_out = [];
  //     let total = 0;
  //     for (const row of records) {
  //       let parameters1 =
  //         "select count(*) as counted_leads  from creators where MONTH(created) = '" +
  //         row +
  //         "' AND YEAR(created) = YEAR(NOW())";
  //       const useers = await sequelize.query(`${parameters1}`, {
  //         type: sequelize.QueryTypes.SELECT,
  //         plain: true,
  //       });
  //       total = total + useers.counted_leads;

  //       let sub_array = {
  //         x: moment(moment().format("YYYY") + "-" + row).format("MMM YY"),
  //         y: useers.counted_leads,
  //       };
  //       array_out.push(sub_array);
  //     }
  //     const nf = new Intl.NumberFormat();
  //     let output = {
  //       code: "200",
  //       total: nf.format(total),
  //       msg: array_out,
  //     };

  //     res.status(200).json(output);
  //   } catch (e) {
  //     res
  //       .status(500)
  //       .json({ code: "500", message: "Internal Server Error" + e });
  //   }
  // },

  getAllCreatorDaysByMonth: async function (req, res, next) {
    try {
      let totalUser = "select count(fb_id) as count  from creators";
      const totalUserCount = await sequelize.query(`${totalUser}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      let parameters =
        "SELECT created as cc FROM ( SELECT MAKEDATE(YEAR(NOW()),1) + INTERVAL (MONTH(NOW())-1) MONTH + INTERVAL created DAY created FROM ( SELECT t*10+u created FROM (SELECT 0 t UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) A, (SELECT 0 u UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) B ORDER BY created ) creators ) creators WHERE MONTH(created) = MONTH(NOW()) AND YEAR(created) = YEAR(NOW()) order by created ASC";
      const records = await sequelize.query(`${parameters}`, {
        type: sequelize.QueryTypes.SELECT,
      });

      let array_out = [];
      let total = 0;
      for (const row of records) {
        let parameters1 =
          "select count(DATE(created)) as counted_leads  from creators where DATE(created)='" +
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

  getWithdrawlUserDashboard: async function (req, res, next) {
    try {
      let TotalCount = await sequelize.query(
        "SELECT count(*) as count FROM wallet where status='APPROVE'",
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

  getAllReferralDaysByMonth: async function (req, res, next) {
    try {
      // Fetch the count of users and count per day in a single query
      const query = `
            SELECT 
                DATE_FORMAT(u.created, '%Y-%m-%d') AS day,
                COUNT(*) AS daily_count
            FROM users u
            WHERE u.referral != '-' AND
                MONTH(u.created) = MONTH(CURDATE()) AND 
                YEAR(u.created) = YEAR(CURDATE())
            GROUP BY day
            ORDER BY day;
        `;

      const results = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      const total = results.reduce((acc, curr) => acc + curr.daily_count, 0);
      const nf = new Intl.NumberFormat();

      // Map results to desired output format
      let array_out = results.map((item) => ({
        x: moment(item.day).format("MMM Do YY"),
        y: item.daily_count,
      }));

      let output = {
        code: "200",
        totalUser: nf.format(total), // Total users who have a referral code and are created in the current month
        total: nf.format(total),
        msg: array_out,
      };

      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e.toString() });
    }
  },

  getAllReferralMonthsByYear: async function (req, res, next) {
    try {
      // Fetch unique referral codes, filtering out '-' directly in SQL
      const referralCodes = await sequelize.query(
        "SELECT ARRAY_AGG(DISTINCT code) AS codes FROM users WHERE code != '-'",
        { type: sequelize.QueryTypes.SELECT }
      );

      // Check if any valid referral codes exist
      if (!referralCodes[0].codes || referralCodes[0].codes.length === 0) {
        res.status(200).json({ code: "200", total: 0, msg: [] });
        return;
      }

      // Prepare a single SQL query to fetch all monthly counts
      const userCountsByMonth = await sequelize.query(
        `SELECT 
                DATE_FORMAT(created, '%m') AS month, 
                COUNT(*) AS counted_leads 
            FROM users 
            WHERE 
                YEAR(created) = YEAR(CURDATE()) AND
                referral IN (:codes)
            GROUP BY month
            ORDER BY month`,
        {
          replacements: { codes: referralCodes[0].codes },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const nf = new Intl.NumberFormat();
      let array_out = userCountsByMonth.map((record) => ({
        x: moment(
          `${new Date().getFullYear()}-${record.month}`,
          "YYYY-MM"
        ).format("MMM YY"),
        y: record.counted_leads,
      }));
      let total = userCountsByMonth.reduce(
        (sum, record) => sum + parseInt(record.counted_leads, 10),
        0
      );

      // Send the response
      res.status(200).json({
        code: "200",
        total: nf.format(total),
        msg: array_out,
      });
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

  sendNotificationFromPanel: async function (req, res, next) {
    try {
      let type = req.body.type;
      let fb_id = req.body.unm;
      let title = req.body.title;
      let message = req.body.message;
      let post_file = typeof req.files.img != "undefined" ? req.files.img : "-";
      let post_img1 =
        typeof req.files.img1 != "undefined" ? req.files.img1 : "-";
      let work_action = req.body.work_action;
      let radio_value = req.body.radio_value;
      let link = req.body.link;

      let value = "0";
      let icon = "";
      let content_icon = "";
      let rd = {};
      let rd11 = {};

      let newPath = "UpLoad/upload/notification/";

      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, {
          recursive: true,
        });
      }

      let file = "-";
      let img1 = "-";

      if (typeof req.files.img !== "undefined") {
        let portfolio = req.files.img;
        file = newPath + Date.now() + "_" + uuidv4() + post_file.name;
        portfolio.mv(file, async function (err, res) {
          if (err) {
          } else {
            if (process.env.media_storage == "ftp") {
              await CreateDirectoryToFTP(newPath);
              await uploadFileToFTP(file, file);
              fs.unlinkSync(file);
            }
            if (process.env.media_storage == "s3") {
              await uploadToS3(file, file);
              fs.unlinkSync(file);
            }
          }
        });
      }

      if (typeof req.files.img1 !== "undefined") {
        let portfolio1 = req.files.img1;
        img1 = newPath + Date.now() + "_" + uuidv4() + post_img1.name;
        portfolio1.mv(img1, async function (err, res) {
          if (err) {
          } else {
            if (process.env.media_storage == "ftp") {
              await CreateDirectoryToFTP(newPath);
              await uploadFileToFTP(img1, img1);
              fs.unlinkSync(img1);
            }
            if (process.env.media_storage == "s3") {
              await uploadToS3(img1, img1);
              fs.unlinkSync(img1);
            }
          }
        });
      }

      if (work_action == "_video") {
        value = radio_value;
        if (file == "-") {
          rd = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          rd11 = await sequelize.query(
            "select * from users where fb_id='" + rd.fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }

        if (img1 == "-") {
          rd11 = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          content_icon = customerFunctions.checkVideoUrl(rd.thum);
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else if (work_action == "_clip") {
        value = radio_value;
        if (file == "-") {
          rd = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          rd11 = await sequelize.query(
            "select * from users where fb_id='" + rd.fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }

        if (img1 == "-") {
          rd11 = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          content_icon = customerFunctions.checkVideoUrl(rd.thum);
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else if (work_action == "_audio") {
        value = radio_value;
        if (file == "-") {
          rd = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          rd11 = await sequelize.query(
            "select * from users where fb_id='" + rd.fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }

        if (img1 == "-") {
          rd11 = await sequelize.query(
            "select * from videos where id='" + audio + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          content_icon = customerFunctions.checkVideoUrl(rd.thum);
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else if (work_action == "_user") {
        value = radio_value;
        if (file == "-") {
          rd11 = await sequelize.query(
            "select * from users where fb_id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }
      } else if (work_action == "_link") {
        if (file == "-") {
          icon = "-";
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }
        if (img1 == "-") {
          content_icon = "-";
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else {
        if (file == "-") {
          icon = "-";
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }
        if (img1 == "-") {
          content_icon = "-";
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      }
      let tokons = [];
      if (type == "all") {
        let query = await sequelize.query(
          "select distinct tokon from users where tokon !='' order by created DESC",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        for (let i = 0; i < query.length; i++) {
          tokons.push(query[i].tokon);
        }

        let qrry_1 =
          "insert into notification(my_fb_id,effected_fb_id,type,value, title, message, image, content_image, link,created)values(";
        qrry_1 += "'0',";
        qrry_1 += "'all',";
        qrry_1 += "" + pool.escape(work_action) + ",";
        qrry_1 += "" + pool.escape(value) + ",";
        qrry_1 += "" + pool.escape(title) + ",";
        qrry_1 += "" + pool.escape(message) + ",";
        qrry_1 += "" + pool.escape(file) + ",";
        qrry_1 += "" + pool.escape(img1) + ",";
        qrry_1 += "" + pool.escape(link) + ",";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);

        let newTokons = [];
        let newTokons_ = [];
        let TC = 1;

        tokons.forEach((to) => {
          if (TC <= 900) {
            newTokons.push(to);
          } else {
            newTokons_.push(newTokons);
            newTokons = [];
            TC = 1;
          }
          TC++;
        });

        newTokons_.map(async (ntok) => {
          let notification = {
            registration_ids: ntok,
            data: {
              title: title,
              body: message,
              action_type_: work_action,
              id: value,
              icon: icon,
              link: link,
              content_icon: content_icon,
            },
            notification: {
              title: title,
              body: message,
              action_type_: work_action,
              id: value,
              icon: icon,
              link: link,
              content_icon: content_icon,
            },
          };
          await customerFunctions.sendPushNotificationToMobileDevice(
            notification
          );
        });
        let output = {
          code: "200",
          msg: "Notification sent",
        };
        res.status(200).json(output);
      } else if (type == "selected") {
        let get_all_user = await sequelize.query(
          "select fb_id, tokon from users where fb_id IN (" +
            fb_id +
            ") order by created DESC",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let tokons = [];

        for (i = 0; i < get_all_user.length; i++) {
          let row1 = get_all_user[i];
          tokons.push(row1.tokon);
          let qrry_1 =
            "insert into notification(my_fb_id,effected_fb_id,type,value, title, message, image, content_image, link,created)values(";
          qrry_1 += "'0',";
          qrry_1 += "" + pool.escape(row1.fb_id) + ",";
          qrry_1 += "" + pool.escape(work_action) + ",";
          qrry_1 += "" + pool.escape(value) + ",";
          qrry_1 += "" + pool.escape(title) + ",";
          qrry_1 += "" + pool.escape(message) + ",";
          qrry_1 += "" + pool.escape(file) + ",";
          qrry_1 += "" + pool.escape(img1) + ",";
          qrry_1 += "" + pool.escape(link) + ",";
          qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);
        }

        let notification = {
          registration_ids: tokons,
          data: {
            title: title,
            body: message,
            action_type_: work_action,
            id: value,
            icon: icon,
            link: link,
            content_icon: content_icon,
          },
          notification: {
            title: title,
            body: message,
            action_type_: work_action,
            id: value,
            icon: icon,
            link: link,
            content_icon: content_icon,
          },
        };

        await customerFunctions.sendPushNotificationToMobileDevice(
          notification
        );

        let output1 = {
          code: "200",
          msg: "Notification sent",
        };

        res.status(200).json(output1);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  sendNotificationFromPanelToAgencyUser: async function (req, res, next) {
    try {
      let type = req.body.type;
      let agency_id = req.body.unm;
      let title = req.body.title;
      let message = req.body.message;
      let post_file = typeof req.files.img != "undefined" ? req.files.img : "-";
      let post_img1 =
        typeof req.files.img1 != "undefined" ? req.files.img1 : "-";
      let work_action = req.body.work_action;
      let radio_value = req.body.radio_value;
      let link = req.body.link;

      let value = "0";
      let icon = "";
      let content_icon = "";
      let rd = {};
      let rd11 = {};

      let newPath = "UpLoad/upload/notification/";

      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, {
          recursive: true,
        });
      }

      let file = "-";
      let img1 = "-";

      if (typeof req.files.img !== "undefined") {
        let portfolio = req.files.img;
        file = newPath + Date.now() + "_" + uuidv4() + post_file.name;
        portfolio.mv(file, async function (err, res) {
          if (err) {
          } else {
            if (process.env.media_storage == "ftp") {
              await CreateDirectoryToFTP(newPath);
              await uploadFileToFTP(file, file);
              fs.unlinkSync(file);
            }
            if (process.env.media_storage == "s3") {
              await uploadToS3(file, file);
              fs.unlinkSync(file);
            }
          }
        });
      }

      if (typeof req.files.img1 !== "undefined") {
        let portfolio1 = req.files.img1;
        img1 = newPath + Date.now() + "_" + uuidv4() + post_img1.name;
        portfolio1.mv(img1, async function (err, res) {
          if (err) {
          } else {
            if (process.env.media_storage == "ftp") {
              await CreateDirectoryToFTP(newPath);
              await uploadFileToFTP(img1, img1);
              fs.unlinkSync(img1);
            }
            if (process.env.media_storage == "s3") {
              await uploadToS3(img1, img1);
              fs.unlinkSync(img1);
            }
          }
        });
      }

      if (work_action == "_video") {
        value = radio_value;
        if (file == "-") {
          rd = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          rd11 = await sequelize.query(
            "select * from users where fb_id='" + rd.fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }

        if (img1 == "-") {
          rd11 = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          content_icon = customerFunctions.checkVideoUrl(rd.thum);
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else if (work_action == "_clip") {
        value = radio_value;
        if (file == "-") {
          rd = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          rd11 = await sequelize.query(
            "select * from users where fb_id='" + rd.fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }

        if (img1 == "-") {
          rd11 = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          content_icon = customerFunctions.checkVideoUrl(rd.thum);
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else if (work_action == "_audio") {
        value = radio_value;
        if (file == "-") {
          rd = await sequelize.query(
            "select * from videos where id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          rd11 = await sequelize.query(
            "select * from users where fb_id='" + rd.fb_id + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }

        if (img1 == "-") {
          rd11 = await sequelize.query(
            "select * from videos where id='" + audio + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          content_icon = customerFunctions.checkVideoUrl(rd.thum);
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else if (work_action == "_user") {
        value = radio_value;
        if (file == "-") {
          rd11 = await sequelize.query(
            "select * from users where fb_id='" + value + "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
          icon = customerFunctions.checkProfileURL(rd11.profile_pic);
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }
      } else if (work_action == "_link") {
        if (file == "-") {
          icon = "-";
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }
        if (img1 == "-") {
          content_icon = "-";
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      } else {
        if (file == "-") {
          icon = "-";
        } else {
          icon = customerFunctions.checkVideoUrl(file);
        }
        if (img1 == "-") {
          content_icon = "-";
        } else {
          content_icon = customerFunctions.checkVideoUrl(img1);
        }
      }

      if (type == "all") {
        let query = await sequelize.query(
          "select distinct tokon from users where tokon !='' AND agency_id!=0 order by created DESC",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        for (let i = 0; i < query.length; i++) {
          tokons.push(query[i].tokon);
        }

        let qrry_1 =
          "insert into notification(my_fb_id,effected_fb_id,type,value, title, message, image, content_image, link,created)values(";
        qrry_1 += "'0',";
        qrry_1 += "'all',";
        qrry_1 += "" + pool.escape(work_action) + ",";
        qrry_1 += "" + pool.escape(value) + ",";
        qrry_1 += "" + pool.escape(title) + ",";
        qrry_1 += "" + pool.escape(message) + ",";
        qrry_1 += "" + pool.escape(file) + ",";
        qrry_1 += "" + pool.escape(img1) + ",";
        qrry_1 += "" + pool.escape(link) + ",";
        qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
        qrry_1 += ")";
        await reqInsertTimeEventLiveData(qrry_1);

        let newTokons = [];
        let newTokons_ = [];
        let TC = 1;

        tokons.forEach((to) => {
          if (TC <= 900) {
            newTokons.push(to);
          } else {
            newTokons_.push(newTokons);
            newTokons = [];
            TC = 1;
          }
          TC++;
        });

        newTokons_.map(async (ntok) => {
          let notification = {
            registration_ids: tokenss,
            data: {
              title: title,
              body: message,
              action_type_: work_action,
              id: value,
              icon: icon,
              link: link,
              content_icon: content_icon,
            },
            notification: {
              title: title,
              body: message,
              action_type_: work_action,
              id: value,
              icon: icon,
              link: link,
              content_icon: content_icon,
            },
          };
          await customerFunctions.sendPushNotificationToMobileDevice(
            notification
          );
        });

        let output = {
          code: "200",
          msg: "Notification sent",
        };
        res.status(200).json(output);
      } else if (type == "selected") {
        let get_all_user = await sequelize.query(
          "select fb_id, tokon from users where tokon !='' AND agency_id IN (" +
            agency_id +
            ") order by created DESC",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let tokons = [];

        for (i = 0; i < get_all_user.length; i++) {
          let row1 = get_all_user[i];
          tokons.push(row1.tokon);
          let qrry_1 =
            "insert into notification(my_fb_id,effected_fb_id,type,value, title, message, image, content_image, link,created)values(";
          qrry_1 += "'0',";
          qrry_1 += "" + pool.escape(row1.fb_id) + ",";
          qrry_1 += "" + pool.escape(work_action) + ",";
          qrry_1 += "" + pool.escape(value) + ",";
          qrry_1 += "" + pool.escape(title) + ",";
          qrry_1 += "" + pool.escape(message) + ",";
          qrry_1 += "" + pool.escape(file) + ",";
          qrry_1 += "" + pool.escape(img1) + ",";
          qrry_1 += "" + pool.escape(link) + ",";
          qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);
        }

        let notification = {
          registration_ids: tokons,
          data: {
            title: title,
            body: message,
            action_type_: work_action,
            id: value,
            icon: icon,
            link: link,
            content_icon: content_icon,
          },
          notification: {
            title: title,
            body: message,
            action_type_: work_action,
            id: value,
            icon: icon,
            link: link,
            content_icon: content_icon,
          },
        };

        await customerFunctions.sendPushNotificationToMobileDevice(
          notification
        );

        let output1 = {
          code: "200",
          msg: "Notification sent",
        };

        res.status(200).json(output1);
      }
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

  getadminAwardWinner: async function (req, res, next) {
    try {
      let page = req.page - 1;
      let limit = req.rowsPerPage;
      let offset = page * limit;

      let counts = await sequelize.query(
        "select count(*) as count from award_winner",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let query = await sequelize.query(
        "select * from award_winner LIMIT " + offset + ", " + limit + "",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let output = {
        code: "200",
        data: query,
        total_record: Math.ceil(counts.count / limit),
        no_of_records_per_page: limit,
        total_number: counts.count,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addadminAwardWinner: async function (req, res, next) {
    try {
      let contest = req.contest;
      let dated = moment(req.dated).format("LL");
      let prize = req.prize;
      let hashtag = req.hashtag;
      let rules = req.rules;
      let type = req.type;

      let qrry_1 =
        "insert into award_winner(`content`, `dated`, `prize`, `hashtag`, `rules`, `type`)values(";
      qrry_1 += "" + pool.escape(contest) + ",";
      qrry_1 += "'" + dated + "',";
      qrry_1 += "" + pool.escape(prize) + ",";
      qrry_1 += "" + pool.escape(hashtag) + ",";
      qrry_1 += "" + pool.escape(rules) + ",";
      qrry_1 += "" + pool.escape(type) + "";
      qrry_1 += ")";

      await reqInsertTimeEventLiveData(qrry_1);

      let output = {
        code: "200",
        msg: "Added Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  updateadminAwardWinner_1: async function (req, res, next) {
    try {
      let aid = req.aid;
      let contest = req.contest;
      let dated = moment(req.dated).format("LL");
      let prize = req.prize;
      let hashtag = req.hashtag;
      let rules = req.rules;
      let type = req.type;

      let update =
        "update award_winner SET content =" +
        pool.escape(contest) +
        ",hashtag =" +
        pool.escape(hashtag) +
        ",rules =" +
        pool.escape(rules) +
        ",type =" +
        pool.escape(type) +
        ",dated =" +
        pool.escape(dated) +
        ",prize =" +
        pool.escape(prize) +
        " WHERE aid ='" +
        aid +
        "'";
      await reqInsertTimeEventLiveData(update);

      let output = {
        code: "200",
        msg: "Updated Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  deleteadminAwardWinner: async function (req, res, next) {
    try {
      let aid = req.aid;
      let deletes = "delete from award_winner  where aid='" + aid + "'";
      await reqInsertTimeEventLiveData(deletes);
      let output = {
        code: "200",
        msg: "Deleted Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  changeStatusadminAwardWinner: async function (req, res, next) {
    try {
      let aid = req.aid;
      let type = req.type;
      let update =
        "update award_winner set type = '" + type + "' where aid='" + aid + "'";
      await reqInsertTimeEventLiveData(update);
      let output = {
        code: "200",
        msg: "Updated Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  addadminTimeEvent: async function (req, res, next) {
    try {
      let description = req.body.time_event;
      let start_date = moment(req.body.start_on).format("YYYY-MM-DD HH:mm:ss");
      let rules = req.body.rules;
      let end_date = moment(req.body.end_date).format("YYYY-MM-DD HH:mm:ss");
      let prize = req.body.prize;
      let name = req.body.eventName;
      let status = "DISABLED";
      let post_file = typeof req.files.img != "undefined" ? req.files.img : "-";
      let post_img1 =
        typeof req.files.img1 != "undefined" ? req.files.img1 : "-";

      let newPath = "UpLoad/upload/timeEvent/";

      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, {
          recursive: true,
        });
      }

      let file = "";
      let img1 = "";

      if (typeof req.files.img !== "undefined") {
        let portfolio = req.files.img;
        file = newPath + Date.now() + "_" + uuidv4() + post_file.name;
        portfolio.mv(file, async function (err, res) {
          if (err) {
          } else {
            if (process.env.media_storage == "ftp") {
              await CreateDirectoryToFTP(newPath);
              await uploadFileToFTP(file, file);
              fs.unlinkSync(file);
            }
            if (process.env.media_storage == "s3") {
              await uploadToS3(file, file);
              fs.unlinkSync(file);
            }
          }
        });
      }

      if (typeof req.files.img1 !== "undefined") {
        let portfolio1 = req.files.img1;
        img1 = newPath + Date.now() + "_" + uuidv4() + post_img1.name;
        portfolio1.mv(img1, async function (err, res) {
          if (err) {
          } else {
            if (process.env.media_storage == "ftp") {
              await CreateDirectoryToFTP(newPath);
              await uploadFileToFTP(img1, img1);
              fs.unlinkSync(img1);
            }
            if (process.env.media_storage == "s3") {
              await uploadToS3(img1, img1);
              fs.unlinkSync(img1);
            }
          }
        });
      }

      let qrry_1 =
        "insert into timeEvent(`name`, `rules`, `description`, `start_date`, `end_date`, `prize`, `image`, `profile_image`,`status`,`created_at`)values(";
      qrry_1 += "" + pool.escape(name) + ",";
      qrry_1 += "" + pool.escape(rules) + ",";
      qrry_1 += "" + pool.escape(description) + ",";
      qrry_1 += "" + pool.escape(start_date) + ",";
      qrry_1 += "" + pool.escape(end_date) + ",";
      qrry_1 += "" + pool.escape(prize) + ",";
      qrry_1 += "" + pool.escape(file) + ",";
      qrry_1 += "" + pool.escape(img1) + ",";
      qrry_1 += "" + pool.escape(status) + ",";
      qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
      qrry_1 += ")";
      await reqInsertTimeEventLiveData(qrry_1);

      let output = {
        code: "200",
        msg: "Added Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  getadminTimeEvent: async function (req, res, next) {
    try {
      let page = req.page - 1;
      let limit = req.rowsPerPage;
      let offset = page * limit;

      let counts = await sequelize.query(
        "select count(*) as count from timeEvent",
        {
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );

      let query = await sequelize.query(
        "select * from timeEvent order by id desc LIMIT " +
          offset +
          ", " +
          limit +
          "",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let output = {
        code: "200",
        data: query,
        total_record: Math.ceil(counts.count / limit),
        no_of_records_per_page: limit,
        total_number: counts.count,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  deleteadminTimeEvent: async function (req, res, next) {
    try {
      let id = req.id;
      let deletes = "delete from timeEvent  where id='" + id + "'";
      await reqInsertTimeEventLiveData(deletes);
      let output = {
        code: "200",
        msg: "Deleted Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  allTimeEvent: async function (req, res, next) {
    try {
      let eventId = req.eventId;

      let r1 = await sequelize.query(
        "SELECT * FROM `timeEvent` where id ='" +
          eventId +
          "' order by id DESC",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let mainAr = [];
      for (i = 0; i < r1.length; i++) {
        let row = r1[i];
        let id = row.id;
        let subAr = [];

        let r2 = await sequelize.query(
          "SELECT fb_id, sum((TO_SECONDS(archived_date ) - TO_SECONDS(join_date))) as spendTime FROM `timeEventLiveData` where eventId='" +
            id +
            "' and state='ARCHIVED' GROUP by fb_id order by spendTime Desc",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        for (ii = 0; ii < r2.length; ii++) {
          let row1 = r2[ii];

          let fb_id = row1.fb_id;
          let spendTime = row1.spendTime;

          let r3 = await sequelize.query(
            "SELECT username, first_name, last_name, profile_pic FROM `users` where fb_id='" +
              fb_id +
              "'",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );

          let get_data = {
            fb_id: fb_id,
            spendTime: spendTime,
            username: "@" + r3.username,
            name: r3.first_name + " " + r3.last_name,
            profile_pic: customerFunctions.checkProfileURL(r3.profile_pic),
            duration: await customerFunctions.hoursandmins(spendTime),
          };
          subAr.push(get_data);
        }
        let get_data1 = {
          eventId: eventId,
          name: row.name,
          start_date: moment(row.start_date).format("YYYY-MM-DD HH:mm:ss"),
          end_date: moment(row.end_date).format("YYYY-MM-DD HH:mm:ss"),
          history: subAr,
        };
        mainAr.push(get_data1);
      }
      let output = {
        code: "200",
        data: mainAr,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  admin_addSection: async function (req, res, next) {
    try {
      let name = req.name;
      let qrry_1 = "insert into sound_section(section_name,created)values(";
      qrry_1 += "" + pool.escape(name) + ",";
      qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
      qrry_1 += ")";
      await reqInsertTimeEventLiveData(qrry_1);

      let output = {
        code: "200",
        msg: "Added Successfully",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  admin_editSection: async function (req, res, next) {
    try {
      let name = req.name;
      let id = req.id;
      let update =
        "update sound_section SET section_name ='" +
        name +
        "' WHERE id ='" +
        id +
        "'";
      await reqInsertTimeEventLiveData(update);

      let output = {
        code: "200",
        msg: "Updated Successfully",
      };
      res.status(200).json(output);
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
  removeSound: async function (req, res, next) {
    try {
      let id = req.id;
      let deletes = "DELETE FROM sound where id ='" + id + "'";
      await reqInsertTimeEventLiveData(deletes);
      let output = {
        code: "200",
        msg: "Sound Removed Successfully.",
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

  getAllSoundGallery: async function (req, res, next) {
    try {
      var arrayOfFiles = fs.readdirSync("uploadSound/uploads/");
      var myfiles = [];
      //Yes, the following is not super-smart, but you might want to process the files. This is how:
      arrayOfFiles.forEach(function (file) {
        let name = file.split(".");

        myfiles.push({
          key: "uploadSound/uploads/" + file,
          name: name[0].substr(0, 30),
        });
      });
      let output = {
        code: "200",
        msg: myfiles,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  checkTime: async function (req, res, next) {
    try {
      var date_time = moment().format("YYYY-MM-DD HH:mm:ss");

      let qrry_2 =
        "insert into notification(my_fb_id,effected_fb_id,type,value,uploaded_by,created)values(";
      qrry_2 += "" + pool.escape("Orignal Sound - Saim") + ",";
      qrry_2 += "" + pool.escape("") + ",";
      qrry_2 += "" + pool.escape("") + ",";
      qrry_2 += "" + pool.escape("") + ",";
      qrry_2 += "" + pool.escape("11") + ",";
      qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
      qrry_2 += ")";

      await reqInsertTimeEventLiveData(qrry_2);
      let output = {
        code: "200",
        msg: date_time,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  downloadFileTest: async function (req, res, next) {
    try {
      let notification = {
        registration_ids: [
          "fpgXowrrQjCjLsOMt1LmOx:APA91bHUxbOHl-AuxGi2M9ET-fE8CwwMl7q3WUEzJVj5gK4elEgb5zahv3BtvfuJ-l8Bx-SUJD8Y_93MJCvsbL_5DLJoLQDeWWAOcz8z5-yIhY69sngOygUAcqgiwMHlW3o7hg4ZtLXV",
        ],
        data: {
          title: "test",
          body: "test",
          action_type_: "_link",
          link: "https://www.google.com/",
        },
        notification: {
          title: "test",
          body: "test",
          action_type_: "_link",
          link: "https://www.google.com/",
        },
      };
      await customerFunctions.sendPushNotificationToMobileDevice(notification);
      let output = {
        code: "200",
        msg: "send",
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  uploadSound: async function (req, res, next) {
    try {
      if (!fs.existsSync("uploadSound/uploads")) {
        fs.mkdirSync("uploadSound/uploads", {
          recursive: true,
        });
      }

      if (typeof req.files.image !== "undefined") {
        let portfolio = req.files.image;
        let portfolio1 = req.files.image.name.split(".");
        let uploadPortfolio =
          "uploadSound/uploads/" +
          portfolio1[0] +
          "-" +
          Math.floor(1000 + Math.random() * 9000) +
          "." +
          portfolio1[1];

        portfolio.mv(uploadPortfolio, async function (err) {
          if (err) {
            let output = {
              code: "201",
              msg: "Something went wrong. please try again.",
            };
            res.status(200).json(output);
          } else {
            let output = {
              code: "200",
              msg: "Sound Added successfully",
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

  updateRefCode: async function (req, res, next) {
    try {
      let users = await sequelize.query(
        "SELECT * from users where code='-' limit 1000",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      for (i = 0; i < users.length; i++) {
        let q = users[i];
        let id = q.id;
        let code = Math.floor(Math.random() * 9000000000) + 1;
        let update =
          "update users SET code ='" + code + "' WHERE id ='" + id + "'";
        await reqInsertTimeEventLiveData(update);
        if (i == 999) {
          let output = {
            code: "200",
            msg: "success",
          };
          res.status(200).json(output);
        }
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  changePassword: async function (req, res, next) {
    try {
      let old_password = req.body.old_password;
      let new_password = req.body.password;
      const refreshToken = req.headers.authorization.split(" ")[1];
      var decoded = jwt_decode(refreshToken);

      let id = decoded.id;
      let users = await sequelize.query(
        "select * from admin where pass='" +
          md5(old_password) +
          "' AND id='" +
          id +
          "'",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (users.length > 0) {
        let update =
          "update admin SET pass ='" +
          md5(new_password) +
          "' WHERE id ='" +
          id +
          "'";
        await reqInsertTimeEventLiveData(update);
        let output = {
          code: "200",
          status: "success",
          message: "Password Successfully Updated.",
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "200",
          status: "error",
          message: "Old Password doesn't match.",
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  reportAction: async function (req, res, next) {
    try {
      if (typeof req.vr_id !== "undefined") {
        let vr_id = req.vr_id;
        let status = req.status;
        let vid_id = req.vid_id;
        let sound_id = req.sound_id;

        let rd = await singleVideo(vid_id);
        if (status == "APPROVE") {
          let update =
            "update video_report SET action ='" +
            status +
            "' WHERE vr_id ='" +
            vr_id +
            "'";
          await reqInsertTimeEventLiveData(update);
          let deletes = "delete from videos where id ='" + vid_id + "'";
          await reqInsertTimeEventLiveData(deletes);
          if (sound_id != "") {
            let deletes1 = "delete from sound where id ='" + sound_id + "'";
            await reqInsertTimeEventLiveData(deletes1);
          }

          let videoPath = rd.length > 0 ? rd[0].video : "";
          let thumPath = rd.length > 0 ? rd[0].thum : "";
          let gifPath = rd.length > 0 ? rd[0].gif : "";

          rd.length > 0 ? await deleteFileFroms3(videoPath) : "";
          rd.length > 0 ? await deleteFileFroms3(thumPath) : "";
          rd.length > 0 ? await deleteFileFroms3(gifPath) : "";
        } else {
          let update =
            "update video_report SET action ='" +
            status +
            "' WHERE vr_id ='" +
            vr_id +
            "'";
          await reqInsertTimeEventLiveData(update);
        }
        let output = {
          code: "200",
          msg: "Report Updated Successfully",
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

  reportActionUser: async function (req, res, next) {
    try {
      if (typeof req.vr_id !== "undefined") {
        let vr_id = req.vr_id;
        let status = req.status;
        let fb_id = req.fb_id;

        if (status == "APPROVE") {
          let update =
            "update video_report SET action ='" +
            status +
            "' WHERE vr_id ='" +
            vr_id +
            "'";
          await reqInsertTimeEventLiveData(update);
          let update1 =
            "update users SET block ='1' WHERE fb_id ='" + fb_id + "'";
          await reqInsertTimeEventLiveData(update1);
        } else {
          let update =
            "update video_report SET action ='" +
            status +
            "' WHERE vr_id ='" +
            vr_id +
            "'";
          await reqInsertTimeEventLiveData(update);
        }
        let output = {
          code: "200",
          msg: "Report User Updated Successfully",
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

  showUserProfile: async function (req, res, next) {
    try {
      let event_json = req;
      if (
        typeof event_json.fb_id !== "undefined" &&
        typeof event_json.my_fb_id !== "undefined"
      ) {
        let fb_id = event_json.fb_id;
        let my_fb_id = event_json.my_fb_id;

        let query = await sequelize.query(
          "select * from users where fb_id= :fb_id",
          {
            replacements: { fb_id: fb_id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (query.length > 0) {
          let query123 = await sequelize.query(
            "select GROUP_CONCAT(id) AS id_list, SUM(fake_like) as flike from videos where vtype='Short' and fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let array_out_count_heart = query123[0].id_list;

          let countLikes_count_ = query123[0].flike;

          let hear_count1 = await sequelize.query(
            "SELECT count(1) as count from video_like_dislike where video_id IN(:array_out_count_heart)",
            {
              replacements: { array_out_count_heart: array_out_count_heart },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let hear_count = hear_count1[0].count;

          let total_fans1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where followed_fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );
          let total_fans = total_fans1[0].count;

          let total_following1 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let total_following = total_following1[0].count;

          let query2 = await sequelize.query(
            "SELECT count(1) as count from follow_users where fb_id= :my_fb_id AND followed_fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id, my_fb_id: my_fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let follow_count = query2[0].count;
          let follow = "";
          let follow_button_status = "";

          if (follow_count == "0") {
            follow = "0";
            follow_button_status = "Follow";
          } else if (follow_count != "0") {
            follow = "1";
            follow_button_status = "Unfollow";
          }

          let array_out = [
            {
              fb_id: fb_id,

              user_info: {
                fb_id: query[0].fb_id,
                first_name: query[0].first_name,
                last_name: query[0].last_name,
                profile_pic: customerFunctions.checkProfileURL(
                  query[0].profile_pic
                ),
                category: query[0].category,
                created: moment(query[0].created).format("YYYY-MM-DD HH:mm:ss"),
                username: "@" + query[0].username,
                verified: query[0].verified,
                bio: query[0].bio,
                gender: query[0].gender,
                marked: query[0].marked,
                acceptdiamonds: query[0].acceptdiamonds,
              },

              follow_Status: {
                follow: follow,
                follow_status_button: follow_button_status,
              },

              total_heart: parseInt(hear_count + countLikes_count_),
              total_fans: total_fans,
              total_following: total_following,
            },
          ];

          let output = {
            code: "200",
            msg: array_out,
          };
          res.status(200).json(output);
        }
      } else {
        let output = {
          code: "201",
          msg: [{ response: "Json Parem are missing6" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  showHomeFeed: async function (req, res, next) {
    try {
      let event_json = req;
      let followers_video = [];
      let trending_video = [];
      let maximum_like_video = [];
      let latest_like_video = [];
      // let BLK_USR = "";
      // let BLK_USR1 = await getBlockUsers();

      // if (BLK_USR1 != "") {
      //   BLK_USR = " AND videos.fb_id NOT IN (" + BLK_USR1 + ") ";
      // }
      let REPET_VID1 = "";
      let REPET_VID = "";
      if (typeof event_json.device_id !== "undefined") {
        if (event_json.device_id != "") {
          let devc_id = event_json.device_id;
          REPET_VID1 = await blockRepeatVideo(devc_id);
          if (REPET_VID1 != "") {
            REPET_VID = " AND videos.id NOT IN (" + REPET_VID1 + ") ";
          }
        }
      }

      let VidID = [];
      let all_id1 = "";
      let all_id2 = "";
      let all_id3 = "";

      if (typeof event_json.fb_id !== "undefined") {
        let fb_id = event_json.fb_id;
        let token = event_json.token;
        let device_id = event_json.device_id;
        let category = event_json.category;
        let type = event_json.type;
        let qq = "";
        if (category != "") {
          qq = " AND videos.category='" + category + "' ";
        }

        if (fb_id == "") {
          fb_id = null;
        }

        /* -------------------------------------------------- NTU ---------------------------------------------------------------------- */

        let update =
          "update users set tokon=" +
          pool.escape(token) +
          " where fb_id=" +
          pool.escape(fb_id) +
          "";
        await reqInsertTimeEventLiveData(update);

        /* ----------------------------------------------------------------------------------------------------------------------------- */

        let QStatus = "select * from users where fb_id='" + fb_id + "' ";
        let qs = await sequelize.query(`${QStatus}`, {
          type: sequelize.QueryTypes.SELECT,
        });

        let query = [];

        if (typeof event_json.video_id !== "undefined") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.id='" +
              event_json.video_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          for (i = 0; i < query.length; i++) {
            let row = query[i];

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            followers_video.push(get_data);
          }
        } else if (type == "related") {
          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE users.block != '1' " +
              qq +
              " AND RAND() < 0.1 LIMIT 20",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            followers_video.push(get_data);
          }
        } else if (type == "following") {
          let query123 = await sequelize.query(
            "SELECT GROUP_CONCAT(followed_fb_id SEPARATOR ',') AS followed_fb_id_list FROM follow_users WHERE fb_id= :fb_id",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (query123[0].followed_fb_id_list != "") {
            query = await sequelize.query(
              "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
                "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
                "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
                "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
                "INNER JOIN users ON videos.fb_id = users.fb_id " +
                "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
                "LEFT JOIN sound ON sound.id = videos.sound_id " +
                "WHERE users.block != '1' " +
                qq +
                " AND FIND_IN_SET(videos.fb_id, '" +
                query123[0].followed_fb_id_list +
                "') ORDER BY videos.id DESC LIMIT 20",
              {
                replacements: { fb_id: fb_id },
                type: sequelize.QueryTypes.SELECT,
              }
            );

            for (i = 0; i < query.length; i++) {
              let row = query[i];

              let metaData = await getVideoMetaData(row.id, fb_id);
              let metaData_count = metaData[0];

              VidID.push(row.id);

              let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
                section: row.section,
                created:
                  row.screated != ""
                    ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                    : "",
              };

              let get_data = {
                tag: "regular",
                id: row.id,
                fb_id: row.fb_id,
                user_info: {
                  fb_id: row.fb_id,
                  first_name: row.first_name,
                  last_name: row.last_name,
                  profile_pic: customerFunctions.checkProfileURL(
                    row.profile_pic
                  ),
                  username: "@" + row.username,
                  verified: row.verified,
                  bio: row.bio,
                  gender: row.gender,
                  category: row.ucategory,
                  marked: row.umarked,
                  acceptdiamonds: row.acceptdiamonds,
                },
                count: {
                  like_count: parseInt(
                    metaData_count.like_dislike_count + row.fake_like
                  ),
                  video_comment_count: parseInt(metaData_count.comment_count),
                  view: parseInt(row.view),
                },
                followStatus: fStatus,
                liked: parseInt(metaData_count.user_like_dislike_count),
                video: customerFunctions.checkVideoUrl(row.video),
                thum: customerFunctions.checkVideoUrl(row.thum),
                gif: customerFunctions.checkVideoUrl(row.gif),
                category: row.vcategory,
                description: row.description,
                type: row.type,
                marked: row.vmarked,
                sound: SoundObject,
                created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
              };
              followers_video.push(get_data);
            }
          }
        } else {
          // ****** Followers Video Start ****** //

          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE users.block != '1' " +
              qq +
              " " +
              REPET_VID +
              " ORDER BY videos.id DESC LIMIT 20",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            all_id1 += row.id + ",";

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            followers_video.push(get_data);
          }

          // ****** Trending Video Start ****** //

          let all_id1_VID = "";
          let all_id1_replace = all_id1.replace(/,*$/, "");

          if (all_id1 != "") {
            all_id1_VID = " AND videos.id NOT IN (" + all_id1_replace + ") ";
          }

          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE videos.for_you='1' AND users.block != '1' " +
              qq +
              " " +
              all_id1_VID +
              " " +
              REPET_VID +
              " ORDER BY videos.id DESC LIMIT 10",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];
            all_id2 += row.id + ",";

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "trending",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            trending_video.push(get_data);
          }

          // ****** Maximum Like Video Start ****** //

          let all_id2_VID = "";
          all_id2 = all_id1 + all_id2;
          let all_id2_replace = all_id2.replace(/,*$/, "");

          if (all_id2 != "") {
            all_id2_VID = " AND videos.id NOT IN (" + all_id2_replace + ") ";
          }

          query = await sequelize.query(
            "SELECT videos.id, videos.fb_id, videos.sound_id, videos.view, videos.fake_like, videos.description, videos.type, videos.marked as vmarked, videos.video, videos.thum, videos.gif, videos.category as vcategory, videos.created, " +
              "users.first_name, users.last_name, users.block, users.profile_pic, users.username, users.verified, users.bio, users.gender, users.category as ucategory, users.marked as umarked, users.acceptdiamonds, " +
              "CASE WHEN fu.followed_fb_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed, COALESCE(sound.id, '') AS sid, COALESCE(sound.sound_name, '') AS sound_name, COALESCE(sound.description, '') AS sdescription, COALESCE(sound.thum, '') AS sthum, " +
              "COALESCE(sound.section, '') AS section, COALESCE(sound.created, '') AS screated FROM videos " +
              "INNER JOIN users ON videos.fb_id = users.fb_id " +
              "LEFT JOIN follow_users fu ON videos.fb_id = fu.followed_fb_id AND fu.fb_id = :fb_id " +
              "LEFT JOIN sound ON sound.id = videos.sound_id " +
              "WHERE users.block != '1' " +
              qq +
              " " +
              all_id2_VID +
              " " +
              REPET_VID +
              " ORDER BY videos.fake_like DESC LIMIT 10",
            {
              replacements: { fb_id: fb_id },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          for (i = 0; i < query.length; i++) {
            let row = query[i];

            all_id3 += row.id + ",";

            let metaData = await getVideoMetaData(row.id, fb_id);
            let metaData_count = metaData[0];

            VidID.push(row.id);

            let fStatus = parseInt(row.is_followed) == 0 ? false : true;

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
              section: row.section,
              created:
                row.screated != ""
                  ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss")
                  : "",
            };

            let get_data = {
              tag: "regular",
              id: row.id,
              fb_id: row.fb_id,
              user_info: {
                fb_id: row.fb_id,
                first_name: row.first_name,
                last_name: row.last_name,
                profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                username: "@" + row.username,
                verified: row.verified,
                bio: row.bio,
                gender: row.gender,
                category: row.ucategory,
                marked: row.umarked,
                acceptdiamonds: row.acceptdiamonds,
              },
              count: {
                like_count: parseInt(
                  metaData_count.like_dislike_count + row.fake_like
                ),
                video_comment_count: parseInt(metaData_count.comment_count),
                view: parseInt(row.view),
              },
              followStatus: fStatus,
              liked: parseInt(metaData_count.user_like_dislike_count),
              video: customerFunctions.checkVideoUrl(row.video),
              thum: customerFunctions.checkVideoUrl(row.thum),
              gif: customerFunctions.checkVideoUrl(row.gif),
              category: row.vcategory,
              description: row.description,
              type: row.type,
              marked: row.vmarked,
              sound: SoundObject,
              created: moment(row.created).format("YYYY-MM-DD HH:mm:ss"),
            };
            maximum_like_video.push(get_data);
          }
        }

        let merge_array = [
          ...trending_video,
          ...followers_video,
          ...maximum_like_video,
        ];

        let resEvent = await sequelize.query(
          "SELECT *, concat('" +
            API_path +
            "',image) as image,concat('" +
            API_path +
            "',profile_image) as profile_image  FROM `timeEvent` where `status`='ENABLED' LIMIT 1",
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let EventArray = [];
        let liveId = 0;

        if (resEvent.length > 0) {
          let re = resEvent[0];
          let id = re.id;
          EventArray.push(re);

          let resEventJoinCheck = await sequelize.query(
            "SELECT count(eventId) as count FROM `timeEventJoin` where eventId='" +
              id +
              "' and fb_id='" +
              fb_id +
              "' LIMIT 1",
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );

          if (resEventJoinCheck[0].count > 0) {
            EventArray.push({ isParticipate: true });
          } else {
            EventArray.push({ isParticipate: false });
          }
        }

        let output = {
          code: "200",
          userStatus: qs.length > 0 ? qs[0].category : "",
          clipUpload: qs.length > 0 ? qs[0].clipUpload : "",
          msg: merge_array,
          timeEvent: EventArray,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          userStatus: "-",
          msg: [{ response: "Json Parem are missing" }],
          timeEvent: [],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  ////New creator API =============////////////////

  getAllCreatorDaysByMonths_new_Days: async function (req, res, next) {
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
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ];

      let array_out = [];
      let total = 0;
      for (const row of records) {
        let parameters1 =
          "select count(*) as counted_leads  from creators where MONTH(created) = '" +
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
};
module.exports = customerFunctions;
// getAllCreatorDaysByMonths_new_Days: async function (req, res, next) {
//   try {
//
//       const records = [
//           "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
//           "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
//           "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
//       ];
//       let array_out = [];
//       let total = 0;
//
//       for (const row of records) {
//           let date = moment().format("YYYY") + "-" + moment().format("MM") + "-" + row;
//           date = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : null;
//           if (date) {
//               let query = `
//                   SELECT COUNT(v.video) as counted_videos
//                   FROM videos v
//                   JOIN users u ON v.fb_id = u.fb_id
//                   WHERE DATE(v.created) = '${date}'
//                   AND u.category = 'creator'`;
//               const useers = await sequelize.query(query, {
//                   type: sequelize.QueryTypes.SELECT,
//                   plain: true,
//               });
//               let counted_videos = useers ? useers.counted_videos : 0;
//               total += counted_videos;

//               let sub_array = {
//                   x: moment(date).format("DD MMM YY"),
//                   y: counted_videos,
//               };
//               array_out.push(sub_array);
//           }
//       }
//       const nf = new Intl.NumberFormat();
//       let output = {
//           code: "200",
//           total: nf.format(total),
//           msg: array_out,
//       };

//       res.status(200).json(output);
//   } catch (e) {
//       res.status(500).json({ code: "500", message: "Internal Server Error " + e });
//   }
// }
