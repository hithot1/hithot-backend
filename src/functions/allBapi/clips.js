
const CLipsApiFunctions = {

    admin_show_allClip_new: async function (req, res, next) {
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
};

module.exports =CLipsApiFunctions;