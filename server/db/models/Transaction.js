const db = require("../db");
const Sequelize = require("sequelize");
const User = require("./User");
const Transaction = db.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticker: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  transaction_type: {
    type: Sequelize.ENUM("buy", "sell"),
    allowNull: false,
  },
  transaction_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

Transaction.belongsTo(User, { foreignKey: "user_id" });

module.exports = Transaction;
