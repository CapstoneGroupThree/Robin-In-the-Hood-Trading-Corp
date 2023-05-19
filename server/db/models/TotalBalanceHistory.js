const Sequelize = require("sequelize");
const db = require("../db");

const TotalBalanceHistory = db.define("totalBalanceHistory", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  balance: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  assets: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  startingBalance: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 100000,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = TotalBalanceHistory;
