const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.MYSQL_PWD,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  charset: "latin1_swedish_ci",
  timezone: "+05:30",
});
