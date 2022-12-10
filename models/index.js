const Sequelize = require("sequelize");
const initModels = require("./init-models");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql"
  }
);

module.exports = {
  sequelize,
  models: initModels(sequelize)
};
