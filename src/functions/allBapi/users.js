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


const usersApiFunctions = {
    All_Users_new: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let type = req.data.type;
          let search = req.data.search ? pool.escape(req.data.search) : "";
          let qq = "";
    
          if(search != "")
          {
            if (type == "fb_id") {
              qq = ' where users.fb_id like "%" ' + search + ' "%"';
            }
            if (type == "username") {
                qq = ' where username like "%" ' + search + ' "%"';
            }
            if (type == "name") {
                qq = ' where first_name like "%" ' + search + ' "%" OR last_name like "%" ' + search + ' "%"';
            }
            if (type == "location") {
                qq = ' where location like "%" ' + search + ' "%"';
            }
            if (type == "phone") {
                qq = ' where phone like "%" ' + search + ' "%"';
            }
            if (type == "device") {
                qq = ' where device like "%" ' + search + ' "%"';
            }
            if (type == "addedon") {
                qq = ' where users.created like "%" ' + search + ' "%"';
            } 
          }
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
          // let query = await getAllUser(qq, offset, limit);
    
          let parameters =
            "SELECT (SELECT COUNT(p.followed_fb_id) FROM follow_users p WHERE users.fb_id = p.followed_fb_id) AS follow_count, (SELECT COUNT(v.fb_id) FROM videos v WHERE users.fb_id = v.fb_id) AS vid_count, CONCAT(first_name, ' ', last_name) AS name, users.*, agencyName FROM users LEFT JOIN agency ON users.agency_id = agency.id " +
            qq +
            " order by users.created DESC LIMIT " +
            offset +
            ", " +
            limit +
            "";
          const query = await sequelize.query(`${parameters}`, {
            type: sequelize.QueryTypes.SELECT,
          });
          let queryCount = await selectUserfbId(qq);
          let countRec = queryCount.length > 0 ? Math.ceil(queryCount[0].TotalUser / limit) : 0;
          let array_out = [];
          let AgAr = await selectAgency();
    
          for (i = 0; i < query.length; i++) {
            let row = query[i];
            
            let agencyName = (row.agencyName != null) ? row.agencyName : "-";
            
            let get_data = {
              fb_id: row.fb_id,
              id: row.id,
              name: row.name,
              username: "@" + row.username,
              gender: row.gender,
              email: row.email,
              phone: row.phone,
              agencyName: agencyName,
              video_count: row.vid_count,
              location: row.location,
              device: row.device,
              created: moment(row.created).subtract(5, 'hours').subtract(45, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
              clipUpload: row.clipUpload,
              follow_count: row.follow_count,
              block: row.block,
              marked: row.marked,
              agencyList: AgAr,
              acceptdiamonds: row.acceptdiamonds,
            };
            array_out.push(get_data);
          }
          let output = {
            code: "200",
            msg: array_out,
            total_record: countRec,
            no_of_records_per_page: limit,
            total_number: queryCount.length > 0 ? queryCount[0].TotalUser : 0,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
    
};

module.exports =usersApiFunctions;