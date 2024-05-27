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

let API_path =
  process.env.media_storage == "s3"
    ? process.env.S3_path
    : process.env.API_path;

getHeart = (id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "SELECT SUM(fake_like) FROM videos WHERE id IN(" + id + ")",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
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
VideoListByFB = (fb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    //  pool.query("select * from videos where for_you_mark='1' and vtype='Clip' "+qq+" "+REPET_VID+" order by rand() limit 50",  (error, elements)=>{

    pool.query(
      "select * from videos where  fb_id='" + fb_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
        //return resolve(elements);
      }
    );
  });
};
UserFollowingList = (fb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from follow_users where fb_id='" + fb_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
video_like_dislikeDetail = (array_out_count_heart) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "SELECT count(*) as count from video_like_dislike where video_id IN(" +
        array_out_count_heart +
        ") ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
total_fansList = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(*) as count from follow_users where followed_fb_id='" +
        fb_id +
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

total_followingList = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(*) as count from follow_users where fb_id='" + fb_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
followingListUser = (my_fb_id, fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT count(*) as count from follow_users where fb_id='" +
        my_fb_id +
        "' and followed_fb_id='" +
        fb_id +
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

getSubscription = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `subscription` where fb_id='" +
        fb_id +
        "' and paymentstatus='1' AND now() >= start_date AND now() <= end_date",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

resWCountlist = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `wallet` where fb_id='" + fb_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
resWalletList = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT sum(credit) as credit,sum(debit) as debit FROM `wallet` where fb_id='" +
        fb_id +
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

resDiamCountlist = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `diamond` where fb_id='" + fb_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
resDiamondList = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT sum(diamond) as diamond, sum(convertedDiamond) as convertedDiamond FROM `diamond` where fb_id='" +
        fb_id +
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
referralUserList = (arstring) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users  WHERE referral in ('" + arstring + "')  ",
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
      "select * from users WHERE referral in ('" +
        arstring +
        "')  order by created desc limit " +
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
verification_requestList = (referral) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from verification_request where fb_id!='' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

verification_requestListLimit = (offset, no_of_records_per_page) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from verification_request where fb_id!='' order by created DESC LIMIT " +
        offset +
        "," +
        no_of_records_per_page +
        " ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
userDetailByFB = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users where fb_id='" + fb_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getReferralCode = (referral_code) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select code from users where code='" + referral_code + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};

getUserByFbID = (fb_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users where fb_id ='" + fb_id + "'",
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

  showUserInfo: async function (req, res, next) {
    // apiRouter.get('/', async (req, res, next)=>{
    try {
      if (
        typeof req.fb_id !== "undefined" &&
        typeof req.my_fb_id !== "undefined"
      ) {
        //console.log("test")
        let fb_id = req.fb_id;
        let my_fb_id = req.my_fb_id;
        //$query1=mysqli_query($conn,"select * from users where fb_id='".$fb_id."' ");
        let query1 = await userDetailByFB(fb_id);
        let rd = query1[0];
        // console.log("rd test",rd)
        let array_out = [];
        if (query1.length > 0) {
          let page = 1;
          let limit = 400;
          let offset = (page - 1) * limit;
          let countRec = 0;
          page = req.pageNo;
          limit = 30;
          offset = (page - 1) * limit;

          countRec = await VideoListByFB(fb_id);

          let array_out_count_heart = "";

          for (i = 0; i < countRec.length; i++) {
            let row = countRec[i];
            array_out_count_heart += row.id + ",";
          }

          let hear_count = 0;
          array_out_count_heart = array_out_count_heart.replace(/,*$/, "");

          if (array_out_count_heart != "") {
            hear_count = await video_like_dislikeDetail(array_out_count_heart);
          }
          let countLikes_count_ = 0;
          if (array_out_count_heart != "") {
            countLikes_count_ = await getHeart(array_out_count_heart);
          }
          let total_fans = await total_fansList(fb_id);
          let total_following = await total_followingList(fb_id);

          let array_out_video = [];
          let count_video_rows = array_out_video.length;
          if (count_video_rows == "0") {
            array_out_video = [];
          }

          let follow_count = await followingListUser(my_fb_id, fb_id);
          let follow = "";
          let follow_button_status = "";

          if (follow_count[0].count == "0") {
            follow = "0";
            follow_button_status = "Follow";
          } else if (follow_count[0].count != "0") {
            follow = "1";
            follow_button_status = "Unfollow";
          }
          //WALLET
          let credit = "0";
          let debit = "0";
          let walletBalance = "0";
          let resWCount = resWCountlist(fb_id);
          if (resWCount.length > 0) {
            //$resWallet=mysqli_query($conn,"SELECT sum(credit) as credit,sum(debit) as debit FROM `wallet` where ref_fb_id='$fb_id' ");
            let rwl = resWalletList(fb_id);
            credit = rwl.credit.toString();
            debit = rwl.debit.toString();
            walletBalance = rwl.credit - rwl.debit;
            walletBalance = walletBalance.toString();
          }

          //DIAMOND
          let diamond = "0";
          let balanceDiamond = "0";
          let resDiamCount = await resDiamCountlist(fb_id);

          if (resDiamCount.length > 0) {
            let resDiamond = await resDiamondList(fb_id);
            let rdm = resDiamond[0];
            diamond = rdm.diamond.toString();
            balanceDiamond = rdm.diamond - rdm.convertedDiamond;
            balanceDiamond = balanceDiamond.toString();
          }

          let resSubsCount = await getSubscription(fb_id);

          let subscription = "";
          let endDate = "";
          let start_date = "";
          let amount = "";
          let transaction_id = "";
          let activesubs = "no";

          if (resSubsCount.length > 0) {
            let rsubs = resSubsCount[0];
            subscription = rsubs.subscription.toString();
            endDate = rsubs.end_date;
            start_date = rsubs.start_date;
            amount = rsubs.amount;
            transaction_id = rsubs.transaction_id;
            activesubs = "yes";
          }

          array_out = [
            {
              fb_id: fb_id,
              user_info: {
                fb_id: rd.fb_id,
                first_name: rd.first_name,
                last_name: rd.last_name,
                profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
                gender: rd.gender,
                created: rd.created,
                username: "@" + rd.username,
                verified: rd.verified,
                bio: rd.bio,
                category: rd.category,
                clipUpload: rd.clipUpload,
                marked: rd.marked,
                acceptdiamonds: rd.acceptdiamonds,
              },
              follow_Status: {
                follow: follow,
                follow_status_button: follow_button_status,
              },
              total_heart:
                // getting wrong heart data
                hear_count != 0 ? hear_count[0].count + countLikes_count_ : 0,
              // hear_count != 0 ? hear_count[0].count : 0,
              total_fans: total_fans[0].count,
              total_following: total_following[0].count,
              credit: credit,
              debit: debit,
              walletBalance: walletBalance,
              totalReceivedDiamond: diamond,
              balanceDiamond: balanceDiamond,
              active_subscription: activesubs,
              subscription_type: subscription,
              endDate: endDate,
              start_date: start_date,
              transaction_id: transaction_id,
              amount: amount,
              total_record_count: countRec.length,
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
          msg: [
            {
              response: "Json Parem are missing 1",
            },
          ],
        };
        res.status(200).json(output);
      }
      // send a json response
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
    // });
  },
  getAllReferral: async function (req, res, next) {
    try {
      let page = req.page;
      let type = req.type;
      let search = req.search ? pool.escape(req.search) : "";

      let qq = "";
      if (type == "fb_id") {
        if (search != "") {
          qq = ' AND  (fb_id like "%" ' + search + ' "%")';
        }
      }
      if (type == "username") {
        if (search != "") {
          qq = ' AND  (username like "%" ' + search + ' "%")';
        }
      }
      if (type == "name") {
        if (search != "") {
          qq =
            ' AND  (first_name like "%" ' +
            search +
            ' "%" OR last_name like "%" ' +
            search +
            ' "%")';
        }
      }
      let limit = 50;
      let offset = (page - 1) * limit;
      // console.log("qq", qq);
      let q1 = "select code from users where code!='-' " + qq + "";
      let res1 = await getUserCodeList(q1);

      let ar = {};
      for (i = 0; i < res1.length; i++) {
        ar = res1[i].code;
      }
      let arstring = ar.toString(", ");
      // let queryCount=mysqli_query($conn,"select * from users  WHERE referral in ('".implode("','",ar)."')  ");
      let countRec = await referralUserList(arstring);
      let queryCount = countRec.length;

      let log_in_rs = await referralUserListLimit(arstring, offset, limit);
      if (log_in_rs.length > 0) {
        let array_out = [];
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

        let output = {
          code: "200",
          msg: array_out,
          no_of_records_per_page: limit,
          total_record: queryCount,
        };
        res.status(200).json(output);
      } else {
        let output = {
          code: "201",
          msg: [
            {
              response: "No data found on your referral",
              no_of_records_per_page: "0",
              total_record: "0",
            },
          ],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  allProfileVerification: async function (req, res, next) {
    try {
      let page = req.page;
      let no_of_records_per_page = 10;
      let offset = (page - 1) * no_of_records_per_page;
      let query10 = await verification_requestList("test");
      let total_record = query10.length;
      let query1 = await verification_requestListLimit(
        offset,
        no_of_records_per_page
      );
      let array_out1 = [];
      for (i = 0; i < query1.length; i++) {
        let row1 = query1[i];
        let query11 = await userDetailByFB(row1.fb_id);

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

        let rd = query11[0];
        let get_data = {
          id: row1.id,
          fb_id: row1.fb_id,
          user_info: {
            first_name: rd.first_name,
            last_name: rd.st_name,
            profile_pic: customerFunctions.checkProfileURL(rd.profile_pic),
            username: "@" + rd.username,
            verified: rd.verified,
          },
          attachment: attachment,
          attachment1: attachment1,
          instagram: row1.instagram,
          youtube: row1.youtube,
          facebook: row1.facebook,
          created: row1.created,
        };
        array_out1.push(get_data);
      }
      let output = {
        code: "200",
        msg: array_out1,
        no_of_records_per_page: no_of_records_per_page,
        total_record: total_record,
      };
      res.status(200).json(output);
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
  manualReferral: async function (req, res, next) {
    try {
      if (req.referral_code && req.fb_id) {
        if (
          typeof req.referral_code !== "undefined" &&
          typeof req.fb_id !== "undefined"
        ) {
          let referral_code = req.referral_code;
          let fb_id = req.fb_id;

          let ress = await getReferralCode(referral_code);

          if (ress.length > 0) {
            let res2 = await getUserByFbID(fb_id);

            if (res2.length > 0) {
              if (res2[0].referral != "") {
                let output = {
                  code: "201",
                  msg: [{ response: "This user already reffered" }],
                };
                res.status(200).json(output);
              } else if (res2[0].code == referral_code) {
                let output = {
                  code: "201",
                  msg: [{ response: "You can not reffered to your own id" }],
                };
                res.status(200).json(output);
              } else {
                let update =
                  "update users SET referral ='" +
                  referral_code +
                  "' WHERE fb_id ='" +
                  fb_id +
                  "'";
                await reqInsertTimeEventLiveData(update);

                let output = {
                  code: "200",
                  msg: [{ response: "Referral code is set" }],
                };
                res.status(200).json(output);
              }
            } else {
              let output = {
                code: "201",
                msg: [{ response: "User's fb id is invalid" }],
              };
              res.status(200).json(output);
            }
          } else {
            let output = {
              code: "201",
              msg: [{ response: "Referral code is wrong" }],
            };
            res.status(200).json(output);
          }
        } else {
          let output = {
            code: "201",
            msg: [{ response: "Json Referral Code OR fb id is missing" }],
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
};
module.exports = customerFunctions;
