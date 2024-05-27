//apiRouter.js

const express = require("express");
// const apiRouter = express.Router();

const mysql = require("mysql");
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
});

SelectAllElements = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM `follow_users` limit 0,10", (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};

getBlockUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT fb_id  from users where block='1'`,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
blockRepeatVideo = (deviceID) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      `SELECT video_id  from view_view_block where device_id='` +
        deviceID +
        `'`,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
updateUserTokon = (token, fb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      `update users set tokon='` + token + `' where fb_id='` + fb_id + `'`,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
QStatUser = (token, fb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      `update users set tokon='` + token + `' where fb_id='` + fb_id + `'`,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
videosDetail = (video_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      `select * from videos where  ids='` + video_id + `'`,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
videosList = (qq, REPET_VID) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from videos where  AND for_you='1' and vtype='Clip' " +
        qq +
        " " +
        REPET_VID +
        "  order by rand() limit 50",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
follow_usersUser = (fb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from follow_users where fb_id='" + fb_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
videosQueryList = (qq, REPET_VID, array_out_count_heart) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from videos where  for_you='1' and vtype='Clip' " +
        qq +
        " " +
        REPET_VID +
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
videosQuerySort = (qq, REPET_VID) => {
  return new Promise((resolve, reject) => {
    // console.log("select * from videos where for_you='1' and vtype='Clip' "+qq+" "+REPET_VID+" order by rand() limit 50")
    pool.query(
      "select * from videos where vtype='Clip' " +
        qq +
        " " +
        REPET_VID +
        " order by rand() limit 10",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        // JSON.parse(JSON.stringify(REPET_VID1))
        return resolve(JSON.parse(JSON.stringify(elements)));
      }
    );
  });
};
usersListFB = (fb_id) => {
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
soundDetail = (sound_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from sound where id='" + sound_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
Countcount_like = (id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "SELECT count(1) as count_like from video_like_dislike where video_id='" +
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
      "SELECT fake_like FROM videos WHERE id='" + id + "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
countcommentDetail = (id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "SELECT count(1) as count from video_comment where video_id='" +
        id +
        "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
video_like_dislikeDetail = (id, fb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "SELECT count(1) as count from video_like_dislike where video_id='" +
        id +
        "' and fb_id='" +
        fb_id +
        "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
FollowCountRFun = (fb_id, rowfb_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select count(1) as count from follow_users where fb_id='" +
        fb_id +
        "' AND  followed_fb_id='" +
        rowfb_id +
        "'",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
checkFollowStatus = (fbId, followingFbId) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "SELECT * FROM `follow_users`  where fb_id='" +
        fbId +
        "' and followed_fb_id='" +
        followingFbId +
        "' limit 1",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
MarkVideosListByIds = (video_id) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from videos where  ids='" + video_id + "' ",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
relatedVideosList = (qq, REPET_VID) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from videos where  AND for_you_mark='1' and vtype='Clip' " +
        qq +
        " " +
        REPET_VID +
        "  order by rand() limit 50",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
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
        return resolve(elements);
      }
    );
  });
};
VideosListCountHeart = (qq, REPET_VID, array_out_count_heart) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    pool.query(
      "select * from videos where  for_you_mark='1' and vtype='Clip' " +
        qq +
        " " +
        REPET_VID +
        " AND  fb_id IN(" +
        array_out_count_heart +
        ") order by rand() limit 50",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
VideosListByMark = (qq, REPET_VID) => {
  return new Promise((resolve, reject) => {
    //console.log(`SELECT video_id  from view_view_block where device_id='`+deviceID+`'`)
    //  pool.query("select * from videos where for_you_mark='1' and vtype='Clip' "+qq+" "+REPET_VID+" order by rand() limit 50",  (error, elements)=>{

    pool.query(
      "select * from videos where vtype='Clip' " +
        qq +
        " " +
        REPET_VID +
        " order by rand() limit 50",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
};
const customerFunctions = {
  checkProfileURL: function (url) {
    // if(typeof banner[i].brand_id?.brandLogo!=='undefined'){
    if (url != "" && typeof url !== "undefined") {
      let checkImageURL = url.indexOf(".com");
      if (checkImageURL == true) {
        return url;
      } else if (url == "null") {
        return "null";
      } else {
        // return API_path."/".$url;
        // return API_path.$url;
        if (customerFunctions.startsWiths(url, "upload")) {
          //return API_path."/".$url;
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

  showAllVideosClip_1: async function (req, res, next) {
    // apiRouter.get('/', async (req, res, next)=>{
    try {
      let BLK_USR1 = await getBlockUsers(req);

      //console.log("BLK_USR1",JSON.parse(JSON.stringify(BLK_USR1)));
      if (BLK_USR1 != "") {
        let BLK_USR = " AND fb_id NOT IN (" + BLK_USR1 + ") ";
      }

      let REPET_VID1 = "";
      let REPET_VID = "";
      if (req.device_id) {
        if (req.device_id != "") {
          let devc_id = req.device_id;
          REPET_VID1 = await blockRepeatVideo(devc_id);
          //console.log("REPET_VID1",JSON.parse(JSON.stringify(REPET_VID1)));
          //if($REPET_VID1!='') { $REPET_VID=" AND id NOT IN ($REPET_VID1) "; }
        }
      }
      let VidID = [];
      //console.log("BLK_USR1 req",req)
      if (typeof req.fb_id !== "undefined") {
        let fb_id = req.fb_id.trim();
        let token = req.token;
        let device_id = req.device_id;
        let category = req.category;
        let type = req.type;
        let qq = "";
        if (category != "") {
          qq = " AND category='" + category + "' ";
        }
        let update = await updateUserTokon(token, fb_id);
        let QStatus = QStatUser(token, fb_id);
        var array_for_you = [];
        let query = "";
        if (typeof req.video_id !== "undefined") {
          //$query=mysqli_query($conn,"select * from videos where types='$types' AND id='".$event_json['video_id']."' ");
          query = await videosDetail(req.video_id);
        } else if (type == "related") {
          query = await videosList(qq, REPET_VID);
        } else if (type == "following") {
          let query123 = await follow_usersUser(fb_id);

          let array_out_count_heart = "";
          query123[0].forEach((row123) => {
            array_out_count_heart += row123.followed_fb_id + ",";
          });
          array_out_count_heart = array_out_count_heart + "0";
          query = await videosQueryList(qq, REPET_VID, array_out_count_heart);
        } else {
          //console.log("last condition ", "select * from videos where for_you='1' and vtype='Short' "+qq+" "+REPET_VID+" order by rand() limit 50")
          query = await videosQuerySort(qq, REPET_VID);
          // query=await connected.execute("select * from videos where for_you='1' and vtype='Short' "+qq+" "+REPET_VID+" order by rand() limit 50");
        }

        for (i = 0; i < query.length; i++) {
          let row = query[i];
          let query1 = await usersListFB(row.fb_id);

          let query112 = await soundDetail(row.sound_id);

          // ADD BY SANGAT SHAH
          let countLikes_count = await Countcount_like(row.id);
          // console.log()

          let AR = row.id;
          let s = 0;
          // for(i=0; i < AR.length; i++){
          //     let id=AR[i]
          //     let res=await getHeart(id);
          //     s+=res.fake_like;
          // }
          let countcomment_count = countcommentDetail(row.id);
          // ADD BY SANGAT SHAH
          //  let countcomment_count=await connected.execute(countcomment);

          //ADD BY SANGAT SHAH
          let liked_count = await video_like_dislikeDetail(row.id, fb_id);

          //ADD BY SANGAT SHAH
          // let FollowCountR=await FollowCountRFun(fb_id,row.fb_id);
          // let FollowCount=FollowCountR.count;
          let VidID = row.id;
          // let followStatus=await checkFollowStatus(fb_id,row.fb_id);
          let followStatus1 = false;
          // if(followStatus.length > 0){
          //     followStatus1 = true;
          // }
          let array_for_you_value = {
            tag: "trending",
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              fb_id: query1[0].fb_id,
              first_name: query1[0].first_name,
              last_name: query1[0].last_name,
              profile_pic: customerFunctions.checkProfileURL(
                query1[0].profile_pic
              ),
              username: "@" + query1[0].username,
              verified: query1[0].verified,
              bio: query1[0].bio,
              gender: query1[0].gender,
              category: query1[0].category,
              marked: query1[0].marked,
            },
            count: {
              like_count: countLikes_count.count + s,
              video_comment_count: countcomment_count.count,
              view: row.view + row.fake_view,
            },
            followStatus: followStatus1,
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            description: row.description,
            type: row.type,
            marked: row.marked,
            allowDownload: row.allowDownload,
            created: row.created,
          };
          // console.log("array_for_you_value",array_for_you_value)
          array_for_you.push(array_for_you_value);
        }
        ///FOR YOU MARK###
        let array_for_you_mark = {};
        if (req.video_id) {
          //$query=mysqli_query($conn,"select * from videos where types='$types' AND id='".$event_json['video_id']."' ");
          let query = await MarkVideosListByIds(req.video_id);
        } else if (req.type == "related") {
          let query = await relatedVideosList(qq, REPET_VID);
        } else if (req.type == "following") {
          let query123 = await UserFollowingList(fb_id);
          let array_out_count_heart = "";
          let row123 = query123[0];
          array_out_count_heart = row123.followed_fb_id + ",";

          array_out_count_heart = array_out_count_heart + "0";
          query = await VideosListCountHeart(
            qq,
            REPET_VID,
            array_out_count_heart
          );
        } else {
          // echo "select * from videos where for_you_mark='1' $qq $REPET_VID order by rand() limit 50";
          let query = await VideosListByMark(qq, REPET_VID);
        }

        for (i = 0; i < query.length; i++) {
          let row = query[i];
          // mysqli_query($conn,"update videos SET view =view+1 WHERE id ='".$row["id"]."' ");
          // mysqli_query($conn,"INSERT INTO `view_view_block` ( `video_id`, `device_id`, `fb_id`) VALUES ( '".$row["id"]."', '$device_id', '".$fb_id."')" );
          //echo "select * from users where fb_id='".$row['fb_id']."'";
          let rd = await usersListFB(row.fb_id);
          //$rd=mysqli_fetch_object($query1);

          //echo "select * from sound where id='".$row['sound_id']."' ";
          // let query112="select * from sound where id='"+row.sound_id+"' ";
          let rd12 = await soundDetail(row.sound_id);

          //let countLikes = "SELECT count(*) as count_like from video_like_dislike where video_id='"+row.id+"'";
          let countLikes_count = await Countcount_like(row.id);

          let AR = row.id;
          let countLikes_count_ = "";
          // let countLikes_count_=await customerFunctions.getHeart(AR);

          // let countcomment = "SELECT count(*) as count from video_comment where video_id='"+row.id+"'";
          let countcomment_count = await countcommentDetail(row.id);

          // let liked = "SELECT count(*) as count from video_like_dislike where video_id='"+row.id+"' and fb_id='"+fb_id+"' ";
          let liked_count = await video_like_dislikeDetail(row.id, fb_id);

          //echo "select count(*) as count from fav_video where fb_id='".$fb_id."' AND  id='".$row['id']."'";
          //$query1FV=mysqli_query($conn,"select count(*) as count from fav_video where fb_id='".$fb_id."' AND  video_id='".$row['id']."'");
          //$rdFV=mysqli_fetch_assoc($query1FV);

          //echo "select count(*) as count from follow_users where fb_id='".$fb_id."' AND  followed_fb_id='".$row['fb_id']."'";
          //let queryFollowRES=fb_id,row.fb_id;
          // let FollowCountR=await FollowCountRFun(fb_id,row.fb_id);

          // let FollowCount=FollowCountR.count;
          let VidID = row.id;
          // let followStatus=await checkFollowStatus(fb_id,row.fb_id);
          let followStatus1 = false;
          // if(followStatus.length > 0){
          //     followStatus1 = true;
          // }

          let array_for_you_mark = {
            tag: "regular",
            id: row.id,
            fb_id: row.fb_id,
            user_info: {
              fb_id: row.fb_id,
              first_name: row.first_name,
              last_name: row.last_name,
              profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
              username: "@".row?.username,
              verified: row.verified,
              bio: row.bio,
              gender: row.gender + ", category: " + row.category,
              marked: row.marked,
            },
            count: {
              like_count: countLikes_count.count + countLikes_count_,
              video_comment_count: countcomment_count.count,
              view: row.view + row.fake_view,
            },
            followStatus: followStatus1,
            liked: liked_count.count,
            video: customerFunctions.checkVideoUrl(row.video),
            thum: customerFunctions.checkVideoUrl(row.thum),
            gif: customerFunctions.checkVideoUrl(row.gif),
            category: row.category,
            description: row.description,
            type: row.type,
            marked: row.marked,
            allowDownload: row.allowDownload,
            created: row.created,
          };
          array_for_you.push(array_for_you_mark);
        }

        res.status(200).json(array_for_you);
      } // send a json response
    } catch (e) {
      console.log(e); // console log the error so we can see it in the console
      res.sendStatus(500);
    }
    // });
  },
};
module.exports = customerFunctions;
