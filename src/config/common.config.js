const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  BASE_URL: process.env.API_path,

  WEBSITE_URL: process.env.WEBSITE_URL,

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_TOKEN_LIFE: process.env.JWT_TOKEN_LIFE,
  JWT_REFRESH_TOKEN_LIFE: process.env.JWT_REFRESH_TOKEN_LIFE,

  JWT_EMAIL_TOKEN_SECRET: process.env.JWT_EMAIL_TOKEN_SECRET,
  JWT_EMAIL_TOKEN_LIFE: process.env.JWT_EMAIL_TOKEN_LIFE,

  API_KEY: process.env.API_KEY,

  PWD_SECRET: process.env.PWD_SECRET,
  AND_API_KEY: process.env.AND_API_KEY,
  IOS_API_KEY: process.env.IOS_API_KEY,
  WEB_API_KEY: process.env.WEB_API_KEY,

  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,

  // FILE_LOCATION: process.env.FILE_LOCATION,

  SERVER: process.env.SERVER,
};
