const { deleteFileFroms3 } = require("../Uploads3");
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

const shotsfunction = {
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
  showAllVideos_1: async function (req, res, next) {
    try {
      let event_json = req;
      let followers_video = [];
      let trending_video = [];
      let maximum_like_video = [];
      let latest_like_video = [];
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
  uploads3Video: async function (req, res, next) {
    try {
      await uploadToS3();
    } catch (e) {
      res
        .status(500)
        .json({ code: "500", message: "Internal Server Error" + e });
    }
  },
};
module.exports = shotsfunction;
