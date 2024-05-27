const { Sequelize } = require("sequelize");
const dbConfig = require("../src/config/db.config");

var sequelize = new Sequelize(
  dbConfig.DB_NAME,
  dbConfig.DB_USER,
  dbConfig.DB_PASSWORD,
  {
    host: dbConfig.DB_HOST,
    dialect: dbConfig.DB_DIALECT,
    operatorsAliases: 0,
    logging: false,
    dialectOptions: {
      charset: "latin1_swedish_ci",
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
      timezone: "+05:45",
    },
    timezone: "+05:45", //for writing to database
  }
);

// const sequelize = new Sequelize(
//   dbConfig.DB_NAME,
//   dbConfig.DB_USER,
//   dbConfig.DB_PASSWORD,
//   {
//     host: dbConfig.DB_HOST,
//     dialect: dbConfig.DB_DIALECT,
//     operatorsAliases: 0,
//   }
// );

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection has been established successfully to database - " +
        dbConfig.DB_NAME
    );
  })
  .catch((err) => {
    console.error(
      "Unable to connect to the database - " + dbConfig.DB_NAME + ": ",
      err
    );
  });

module.exports = sequelize;
global.sequelize = sequelize;
