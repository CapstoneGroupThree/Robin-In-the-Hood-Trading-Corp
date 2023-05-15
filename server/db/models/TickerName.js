const db = require("../db");
const Sequelize = require("sequelize");

const TickerName = db.define("ticker_name", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = TickerName;
