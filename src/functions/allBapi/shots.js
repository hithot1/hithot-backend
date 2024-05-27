const express = require("express");
var moment = require("moment");
let API_path = process.env.media_storage == "s3" ? process.env.S3_path : process.env.API_path;

const utilFunctions = require("./utils.js");

const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.MYSQL_PWD,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  charset: "latin1_swedish_ci",
  timezone: "Asia/Kolkata",
});

/* ------------------ FiHD Meta Function Start -------------- */

getVideoMetaData = (id, fb_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(DISTINCT CASE WHEN video_id = '" + id + "' THEN id END) AS like_dislike_count, (SELECT COUNT(*) FROM video_comment WHERE video_id = '" + id + "') AS comment_count, COUNT(CASE WHEN video_id = '" + id + "' AND fb_id = '" + fb_id + "' THEN id END) AS user_like_dislike_count FROM video_like_dislike WHERE video_id = '" + id + "'",
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
  
  /* ------------------ FiHD Meta Function End -------------- */

const shotsApiFunctions = {
    
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
  
            let countRec = queryCount.length > 0 ? Math.ceil(queryCount[0].count / limit) : 0;
        
            let array_out = [];
        
            for (i = 0; i < query.length; i++) {
                let row = query[i];
  
                let metaData = await getVideoMetaData(row.id, row.fb_id);
                let metaData_count = metaData[0];
  
                let SoundObject = {
                    id: row.sid,
                    audio_path: {
                      mp3: (row.screated != '') ?
                            API_path +
                            (await utilFunctions.checkFileExist(
                              moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
                              row.sid + ".mp3"
                            )) : '',
                      acc: (row.screated != '') ? 
                            API_path +
                            (await utilFunctions.checkFileExist(
                              moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
                              row.sid + ".aac"
                            )) : '',
                    },
                    sound_name: row.sound_name,
                    description: row.sdescription,
                    thum: row.sthum,
                    section: row.ssection,
                    created: (row.screated != '') ? moment(row.screated).format("YYYY-MM-DD HH:mm:ss") : '',
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
                      like_count: parseInt(metaData_count.like_dislike_count + row.fake_like),
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
};

module.exports = shotsApiFunctions;