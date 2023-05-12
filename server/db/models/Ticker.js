const db = require("../db");
const Sequelize = require("sequelize");

const Ticker = db.define("ticker", {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Ticker;
