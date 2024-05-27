const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  DB_HOST: process.env.MYSQL_HOST,
  DB_USER: process.env.MYSQL_USER,
  DB_PASSWORD: process.env.MYSQL_PWD,
  DB_NAME: process.env.MYSQL_DB,
  DB_DIALECT: "mysql",
};
