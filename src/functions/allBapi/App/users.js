const {
    uploadFileToFTP,
    CreateDirectoryToFTP,
    downloadFileFromFTP,
  } = require("../../config/ftp-connection");

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
  
  
  

  
 

const usersfunction={
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
    
    
    

}

module.exports=usersfunction