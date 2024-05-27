
const SubscriptionApiFunctions = {

    allsubscriber_new: async function (req, res, next) {
        try {
          let page = req.data.page - 1;
          let search = req.data.search ? pool.escape(req.data.search) : "";
          let type = req.data.type;
          let qq = "";
    
          if (type == "fb_id") {
            if (search != "") {
              qq = ' AND  u.fb_id like "%" ' + search + ' "%"';
            }
          }
          if (type == "username") {
            if (search != "") {
              qq = ' AND  u.username like "%" ' + search + ' "%"';
            }
          }
          if (type == "phone") {
            if (search != "") {
              qq = ' AND  u.phone like "%" ' + search + ' "%"';
            }
          }
          if (type == "name") {
            if (search != "") {
              qq =
                ' AND  CONCAT(u.first_name, " ", u.last_name) like "%" ' +
                search +
                ' "%"';
            }
          }
          if (type == "transaction") {
            if (search != "") {
              qq = ' AND  s.transaction_id like "%" ' + search + ' "%"';
            }
          }
          if (type == "subscription") {
            if (search != "") {
              qq = ' AND  s.subscription like "%" ' + search + ' "%"';
            }
          }
          if (type == "addedon") {
            if (search != "") {
              qq = ' AND  s.created like "%" ' + search + ' "%"';
            }
          }
    
          const countRec = await sequelize.query(
            "SELECT count(s.fb_id) as count FROM subscription s, users u where u.fb_id=s.fb_id and s.paymentstatus=1 " +
              qq +
              "",
            {
              type: sequelize.QueryTypes.SELECT,
              plain: true,
            }
          );
    
          let limit = req.data.rowsPerPage;
          let offset = page * limit;
    
          let parameters =
            "SELECT s.id,u.username, u.email, u.phone, u.first_name, u.last_name, s.fb_id,s.subscription,s.amount,s.transaction_id, s.start_date,s.end_date,s.created,s.paymentstatus FROM subscription s, users u where u.fb_id=s.fb_id and s.paymentstatus=1 " +
            qq +
            " order by s.id DESC LIMIT " +
            offset +
            ", " +
            limit +
            "";
          const query = await sequelize.query(`${parameters}`, {
            type: sequelize.QueryTypes.SELECT,
          });
    
          let output = {
            code: "200",
            msg: "Success",
            data: query,
            total_record: Math.ceil(countRec.count / limit),
            no_of_records_per_page: limit,
            total_number: countRec.count,
          };
          res.status(200).json(output);
        } catch (e) {
          res
            .status(500)
            .json({ code: "500", message: "Internal Server Error" + e });
        }
      },
};

module.exports =SubscriptionApiFunctions;