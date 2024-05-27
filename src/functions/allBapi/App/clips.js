let API_path =
  process.env.media_storage == "s3"
    ? process.env.S3_path
    : process.env.API_path;
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
const clipsfunction={
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
    showAllVideosClip_1: async function (req, res, next) {
        try {
          let event_json = req;
          let BLK_USR = "";
          let BLK_USR1 = await getBlockUsers();
    
          if (BLK_USR1 != "") {
            BLK_USR = " AND fb_id NOT IN (" + BLK_USR1 + ") ";
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
    
              let countLikes = await countLike(row.id);
              let countLikes_count = countLikes[0];
    
              let countLikes_count_ = await getHeart(row.id);
    
              let countcomment = await commentCount(row.id);
              let countcomment_count = countcomment[0];
    
              let liked = await videoLikeDislike(row.id, fb_id);
              let liked_count = liked[0];
    
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
              let countLikes = await countLike(row.id);
              let countLikes_count = countLikes[0];
    
              let countLikes_count_ = await getHeart(row.id);
    
              let countcomment = await commentCount(row.id);
              let countcomment_count = countcomment[0];
    
              let liked = await videoLikeDislike(row.id, fb_id);
              let liked_count = liked[0];
    
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
}
module.exports=clipsfunction