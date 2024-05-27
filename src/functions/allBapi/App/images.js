const {
  uploadToS3,
  getFromS3,
  checkFileExistS3,
  deleteFileFroms3,
  getListS3,
} = require("../Uploads3");
const {
  uploadFileToFTP,
  CreateDirectoryToFTP,
  downloadFileFromFTP,
} = require("../../config/ftp-connection");
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

  
  
  

  
  

const Imagesfunction = {
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

            let countLikes = await countLike(row.id);
            let countLikes_count = countLikes[0];

            let countLikes_count_ = await getHeart(row.id);

            let countcomment = await commentCount(row.id);
            let countcomment_count = countcomment[0];

            let liked = await videoLikeDislike(row.id, my_fb_id);
            let liked_count = liked[0];
          
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
};
module.exports = Imagesfunction;
