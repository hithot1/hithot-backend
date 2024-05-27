
const ImagesApiFunctions = {

    admin_show_allImages_new: async function (req, res, next) {
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
                            (await customerFunctions.checkFileExist(
                              moment(row.screated).format("YYYY-MM-DD HH:mm:ss"),
                              row.sid + ".mp3"
                            )) : '',
                      acc: (row.screated != '') ? 
                            API_path +
                            (await customerFunctions.checkFileExist(
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
                        profile_pic: customerFunctions.checkProfileURL(row.profile_pic),
                    },
                    count: {
                      like_count: parseInt(metaData_count.like_dislike_count + row.fake_like),
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
};

module.exports =ImagesApiFunctions;