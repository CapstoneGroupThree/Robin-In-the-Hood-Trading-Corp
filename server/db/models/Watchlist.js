const db = require("../db");
const Sequelize = require("sequelize");
const User = require("./User");
const Watchlist = db.define("watchlist", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // ticker: {
  //   type: Sequelize.STRING,
  //   allowNull: true,
  //   unique: true,
  // },
  tickers: {
    type: Sequelize.ARRAY(Sequelize.DataTypes.STRING),
    defaultValue: [],
  },
});

// Watchlist.belongsTo(User, { foreignKey: "user_id" });
// console.log(Watchlist.prototype);
module.exports = Watchlist;
