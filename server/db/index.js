const db = require("./db");

const User = require("./models/User");
const Watchlist = require("./models/Watchlist");
const Transaction = require("./models/Transaction");
const Ticker = require("./models/Ticker");
const TickerName = require("./models/TickerName");
const Portfolio = require("./models/Portfolio");
const TotalBalanceHistory = require("./models/TotalBalanceHistory");

User.hasOne(Watchlist);
Watchlist.belongsTo(User);

User.hasMany(TotalBalanceHistory, { foreignKey: "userId" });
TotalBalanceHistory.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Portfolio, { foreignKey: "userId" });
Portfolio.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

Ticker.hasOne(TickerName);
TickerName.belongsTo(Ticker);

module.exports = {
  db,
  models: {
    User,
    Watchlist,
    Transaction,
    Portfolio,
    Ticker,
    TickerName,
    TotalBalanceHistory,
  },
};
