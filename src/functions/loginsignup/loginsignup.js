//apiRouter.js
const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
// const apiRouter = express.Router();
var moment = require("moment"); // require
const Sequelize = require("sequelize");
const sequelize = require("../../../database/connection");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql");
const { uploadToS3 } = require("../Uploads3");
const {
  uploadFileToFTP,
  CreateDirectoryToFTP,
} = require("../../config/ftp-connection");
let API_path =
  process.env.media_storage == "s3"
    ? process.env.S3_path
    : process.env.API_path;

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

reqInsertUserData = (query) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(query, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(JSON.parse(JSON.stringify(elements)));
    });
  });
};
reqInsertdevice_tokon = (query) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(query, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(JSON.parse(JSON.stringify(elements)));
    });
  });
};
resCheckMail = (email) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from users where email='" + email + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
distributeReferral = (referral, code, newFbId, device) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users where code='" + referral + "'",
      async (error, elements) => {
        if (error) {
          return reject(error);
        }
        if (elements.length > 0) {
          let fbId = elements[0].fb_id;
          let agencyId = elements[0].agency_id;
          if (agencyId == 0) {
            let r04 = await sequelize.query(
              "select * from users where fb_id='" + newFbId + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );
            let ref = "Referred @" + r04.username;
            let r005 = await sequelize.query("select * from setting", {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            });
            let cr = r005.referral_amount;

            let dated = moment().format("Y-MM-DD");

            let qrry_1 =
              "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`category`, `description`, `diamond`, `convertedDiamond`, `dated`, `created`)values(";
            qrry_1 += "'" + fbId + "',";
            qrry_1 += "'" + referral + "',";
            qrry_1 += "'" + newFbId + "',";
            qrry_1 += "'Referral',";
            qrry_1 += "'" + ref + "',";
            qrry_1 += "'" + cr + "',";
            qrry_1 += "'0',";
            qrry_1 += "'" + dated + "',";
            qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_1 += ")";
            await reqInsertdevice_tokon(qrry_1);
          } else {
            let r04 = await sequelize.query(
              "select * from users where fb_id='" + newFbId + "'",
              {
                type: sequelize.QueryTypes.SELECT,
                plain: true,
              }
            );
            let ref = "Referred @" + r04.username;
            let r005 = await sequelize.query("select * from setting", {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            });
            let cr = r005.referral_amount;

            let dated = moment().format("Y-MM-DD");

            let qrry_1 =
              "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`category`, `description`, `diamond`, `convertedDiamond`, `dated`, `created`)values(";
            qrry_1 += "'" + fbId + "',";
            qrry_1 += "'" + referral + "',";
            qrry_1 += "'" + newFbId + "',";
            qrry_1 += "'Referral',";
            qrry_1 += "'" + ref + "',";
            qrry_1 += "'0',";
            qrry_1 += "'0',";
            qrry_1 += "'" + dated + "',";
            qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_1 += ")";
            await reqInsertdevice_tokon(qrry_1);

            let qrry_2 =
              "insert into diamond(`ref_fb_id`, `ref_code`, `fb_id`,`category`, `description`, `diamond`, `convertedDiamond`, `dated`, `created`)values(";
            qrry_2 += "'" + newFbId + "',";
            qrry_2 += "'-',";
            qrry_2 += "'-',";
            qrry_2 += "'Reward',";
            qrry_2 += "'Reward',";
            qrry_2 += "'" + cr + "',";
            qrry_2 += "'0',";
            qrry_2 += "'" + dated + "',";
            qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            qrry_2 += ")";
            await reqInsertdevice_tokon(qrry_2);
          }
        }
        return resolve("");
      }
    );
  });
};
resCheckPhone = (phone) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from users where phone='" + phone + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
resCheckFBid = (fb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
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
UserDetail = (email_phone, password) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    //  pool.query("select * from videos where for_you_mark='1' and vtype='Clip' "+qq+" "+REPET_VID+" order by rand() limit 50",  (error, elements)=>{

    pool.query(
      "select * from users where (email=" +
        email_phone +
        " OR phone=" +
        email_phone +
        ") AND password=" +
        password +
        "",
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
  checkVideoUrl: function (url) {
    if (customerFunctions.startsWiths(url, "upload")) {
      return API_path + "UpLoad/" + url;
    } else if (customerFunctions.startsWiths(url, "UpLoad/Vidz")) {
      return API_path + "UpLoad/" + url;
    } else {
      return API_path + url;
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

  manualsignin: async function (req, res, next) {
    // apiRouter.get('/', async (req, res, next)=>{
    try {
      if (
        typeof req.email_phone !== "undefined" &&
        typeof req.password !== "undefined"
      ) {
        let email_phone = pool.escape(req.email_phone);
        let password = pool.escape(req.password);

        let log_in_rs = await UserDetail(email_phone, password);
        if (log_in_rs.length > 0) {
          let rd = log_in_rs[0];
          if (rd.deleted_at == "1") {
            let output = {
              code: "201",
              msg: "Account not found",
            };
            res.status(200).json(output);
          } else {
            if (rd.block == "0") {
              let array_out = [
                {
                  fb_id: rd.fb_id,
                  action: "login",
                  profile_pic: customerFunctions.checkProfileURL(
                    rd.profile_pic
                  ),
                  first_name: rd.first_name,
                  last_name: rd.last_name,
                  username: "@" + rd.username,
                  verified: rd.verified,
                  bio: rd.bio,
                  phone: rd.phone,
                  gender: rd.gender,
                  category: rd.category,
                  tokon: "", //$dvice_tokon->tokon
                  code: rd.code,
                  marked: rd.marked,
                },
              ];

              let output = {
                code: "200",
                msg: array_out,
              };
              res.status(200).json(output);
            } else {
              let output = {
                code: "201",
                msg: "error in login",
              };
              res.status(200).json(output);
            }
          }
        } else {
          let output = {
            code: "201",
            msg: "invalid credential",
          };
          res.status(200).json(output);
        }

        // res.status(200).json(array_for_you);
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
      console.log(e); // console log the error so we can see it in the console
      res.sendStatus(500);
    }
    // });
  },
  manualsignup: async function (req, res, next) {
    // apiRouter.get('/', async (req, res, next)=>{
    try {
      //console.log("req",req)

      if (
        typeof req.first_name !== "undefined" &&
        typeof req.last_name !== "undefined"
      ) {
        let fb_id =
          "229989" +
          Math.floor(Math.random() * 10000) +
          Math.floor(Math.random() * 1000) +
          Math.floor(Math.random() * 100);
        let first_name = req.first_name;
        let referral = req.referral ? req.referral : "";
        let last_name = req.last_name;
        let email = req.email;
        let password = req.password;
        let gender = req.gender;
        let phone = req.phone;
        let version = req.version;
        let device = req.device;
        let location = req.location;
        let signup_type = "manual";

        let username = first_name + Math.floor(Math.random() * 9000000000) + 1;

        // $resCheckMail=mysqli_query($conn, "select * from users where email='$email'");
        let checkMail = await resCheckMail(email);

        //$resCheckPhone=mysqli_query($conn, "select * from users where phone='$phone'");
        let checkPhone = await resCheckPhone(phone);
        //console.log('checkPhone',checkPhone)
        if (checkMail.length > 0) {
          let output = {
            code: "201",
            msg: [
              {
                response: "Email already exist",
              },
            ],
          };
          res.status(200).json(output);
          //mail already exist
        } else if (checkPhone.length > 0) {
          //phone already exist
          let output = {
            code: "201",
            msg: [
              {
                response: "Mobile no. already exist",
              },
            ],
          };
          res.status(200).json(output);
        } else {
          let log_in_rs = await resCheckFBid(fb_id);
          if (log_in_rs.length > 0) {
            let rd = log_in_rs[0];
            if (rd.block == "0") {
              let array_out = [
                {
                  fb_id: rd.fb_id,
                  action: "login",
                  profile_pic: customerFunctions.checkProfileURL(
                    rd.profile_pic
                  ),
                  first_name: rd.first_name,
                  last_name: rd.last_name,
                  username: "@" + rd.username,
                  verified: rd.verified,
                  bio: rd.bio,
                  gender: rd.gender,
                  category: rd.category,
                  tokon: "",
                  //$dvice_tokon->tokon
                  code: rd.code,
                  phone: rd.phone,
                },
              ];
              let output = {
                code: "200",
                msg: array_out,
              };
              res.status(200).json(output);
            } else {
              let output = {
                code: "201",
                msg: {
                  response: "error in signup",
                },
              };
              res.status(200).json(output);
            }
          } else {
            let imageURl = "UpLoad/upload/images/avatar9099.png";
            let code = Math.floor(Math.random() * 9000000000) + 1;
            // rand(100,999).rand(10,99).rand(100,999).rand(10,99);
            let qrry_1 =
              "insert into users(fb_id,code,referral,username,password,first_name,last_name,profile_pic,version,device,signup_type,location,email,phone,bio,tokon,bearer_token,created)values(";
            qrry_1 += "" + pool.escape(fb_id) + ",";
            qrry_1 += "" + pool.escape(code) + ",";
            qrry_1 += "" + pool.escape(referral) + ",";
            qrry_1 += "" + pool.escape(username) + ",";
            qrry_1 += "" + pool.escape(password) + ",";
            qrry_1 += "" + pool.escape(first_name) + ",";
            qrry_1 += "" + pool.escape(last_name) + ",";
            qrry_1 += "" + pool.escape(imageURl) + ",";
            qrry_1 += "" + pool.escape(version) + ",";
            qrry_1 += "" + pool.escape(device) + ",";
            qrry_1 += "" + pool.escape(signup_type) + ",";
            qrry_1 += "" + pool.escape(location) + ",";
            qrry_1 += "" + pool.escape(email) + ",";
            qrry_1 += "" + pool.escape(phone) + ",";
            qrry_1 += "'',";
            qrry_1 += "'',";
            qrry_1 += "'',";
            qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
            //$qrry_1+="'"+gender+"'";
            qrry_1 += ")";
            let last_insert_fb_id = await reqInsertUserData(qrry_1);
            await distributeReferral(referral, code, fb_id, "");

            // console.log("last insert",last_insert_fb_id)
            if (last_insert_fb_id.insertId != "") {
              let tokon = Math.round(+new Date() / 1000);
              let qrry_1 =
                "insert into device_tokon(fb_id,tokon,phone_id,created)values(";
              qrry_1 += "'" + fb_id + "',";
              qrry_1 += "'" + tokon + "',";
              qrry_1 += "'',";
              qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
              qrry_1 += ")";
              await reqInsertdevice_tokon(qrry_1);
              //register tokon

              let array_out = [
                {
                  fb_id: fb_id,
                  username: "@" + username,
                  action: "signup",
                  profile_pic: imageURl,
                  first_name: first_name,
                  last_name: last_name,
                  signup_type: signup_type,
                  gender: gender,
                  tokon: tokon,
                  code: code,
                  phone: phone,
                },
              ];
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
                    response: "problem in signup",
                  },
                ],
              };
              res.status(200).json(output);
            }
          }
        }
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
      console.log(e); // console log the error so we can see it in the console
      res.sendStatus(500);
    }
    // });
  },
  signup: async function (req, res, next) {
    try {
      if (
        typeof req.body.fb_id !== "undefined" &&
        typeof req.body.first_name !== "undefined" &&
        typeof req.body.last_name !== "undefined"
      ) {
        let fb_id = req.body.fb_id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let gender = req.body.gender;
        let profile_pic = req.body.profile_pic;
        let version = req.body.version;
        let referral = req.body.referral ? req.body.referral : "";
        let device = req.body.device;
        let signup_type = req.body.signup_type;
        let location = req.body.location ? req.body.location : "";
        let username = first_name + Math.floor(Math.random() * 9000000000) + 1;
        let image =
          typeof req.body.image !== "undefined" ? req.body.image.file_data : "";

        let rd = await sequelize.query(
          "select *,count(fb_id) as count from users where fb_id='" +
            fb_id +
            "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        let dvice_tokon = await sequelize.query(
          "select * from device_tokon where fb_id='" + fb_id + "'",
          {
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        );

        if (rd.count > 0) {
          if (rd.deleted_at == "1") {
            let output = {
              code: "201",
              msg: "Account not found",
            };
            res.status(200).json(output);
          } else {
            if (rd.block == 0) {
              let update =
                "UPDATE users SET newregister='FALSE' where fb_id='" +
                fb_id +
                "'";
              await reqInsertTimeEventLiveData(update);

              let array_out = [
                {
                  fb_id: rd.fb_id,
                  action: "login",
                  profile_pic: customerFunctions.checkProfileURL(
                    rd.profile_pic
                  ),
                  first_name: rd.first_name,
                  last_name: rd.last_name,
                  description: rd.description,
                  username: rd.username,
                  verified: rd.verified,
                  bio: rd.bio,
                  gender: rd.gender,
                  tokon: dvice_tokon.tokon,
                  code: rd.code,
                  phone: rd.phone,
                  newregister: "FALSE",
                  created: rd.created,
                },
              ];

              let output = {
                code: "200",
                msg: array_out,
              };
              res.status(200).json(output);
            } else {
              let output = {
                code: "200",
                msg: "error in login",
              };
              res.status(200).json(output);
            }
          }
        } else {
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
          let imageURl = profile_pic;
          if (image) {
            let fileName = Date.now() + "_" + uuidv4();
            imageURl = newPath + "/images/" + fileName + ".jpg";
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
          }
          let code = Math.floor(Math.random() * 9000000000) + 1;

          let qrry_1 =
            "insert into users(fb_id,code,referral,username,first_name,last_name,profile_pic,version,device,signup_type,location,gender,newregister,bio,tokon,bearer_token,created)values(";
          qrry_1 += "" + pool.escape(fb_id) + ",";
          qrry_1 += "" + pool.escape(code) + ",";
          qrry_1 += "" + pool.escape(referral) + ",";
          qrry_1 += "" + pool.escape(username) + ",";
          qrry_1 += "" + pool.escape(first_name) + ",";
          qrry_1 += "" + pool.escape(last_name) + ",";
          qrry_1 += "" + pool.escape(imageURl) + ",";
          qrry_1 += "" + pool.escape(version) + ",";
          qrry_1 += "" + pool.escape(device) + ",";
          qrry_1 += "" + pool.escape(signup_type) + ",";
          qrry_1 += "" + pool.escape(location) + ",";
          qrry_1 += "" + pool.escape(gender) + ",";
          qrry_1 += "'TRUE',";
          qrry_1 += "'',";
          qrry_1 += "'',";
          qrry_1 += "'',";
          qrry_1 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_1 += ")";
          await reqInsertTimeEventLiveData(qrry_1);

          await distributeReferral(referral, code, fb_id, "");

          let tokon = Math.round(+new Date() / 1000);

          let qrry_2 =
            "insert into device_tokon(fb_id,tokon,phone_id,created)values(";
          qrry_2 += "'" + fb_id + "',";
          qrry_2 += "" + pool.escape(tokon) + ",";
          qrry_2 += "'',";
          qrry_2 += "'" + moment().format("YYYY-MM-DD HH:mm:ss") + "'";
          qrry_2 += ")";
          await reqInsertTimeEventLiveData(qrry_2);

          let array_out = [
            {
              fb_id: fb_id,
              username: "@" + username,
              action: "signup",
              profile_pic: profile_pic,
              first_name: first_name,
              last_name: last_name,
              signup_type: signup_type,
              gender: gender,
              tokon: tokon,
              code: code,
              newregister: "TRUE",
              phone: "",
              created: moment().format("YYYY-MM-DD HH:mm:ss"),
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
          msg: [{ response: "Json Parem are missing 1" }],
        };
        res.status(200).json(output);
      }
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },

  updatelocation: async function (req, res, next) {
    try {
      if (typeof req.location !== "undefined") {
        let location = stripslashes(req.location);
        let fb_id = req.fb_id;

        if (location != "") {
          let update =
            "UPDATE users set location=" +
            pool.escape(location) +
            " where fb_id='" +
            fb_id +
            "'";
          await reqInsertTimeEventLiveData(update);

          let output = {
            code: "200",
            msg: [
              {
                response: "Location Updated",
              },
            ],
          };
          res.status(200).json(output);
        } else {
          let output = {
            code: "201",
            msg: [
              {
                response: "No need to update location",
              },
            ],
          };
          res.status(200).json(output);
        }
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
      console.log(e); // console log the error so we can see it in the console
      res.sendStatus(500);
    }
    // });
  },
};
module.exports = customerFunctions;
