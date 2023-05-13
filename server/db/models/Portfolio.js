const { Sequelize } = require("sequelize");
const db = require("../db");

const Portfolio = db.define("portfolio", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  stockTicker: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  stockName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  purchasePrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

module.exports = Portfolio;
