const db = require("./db");

const User = require("./models/User");
const Watchlist = require("./models/Watchlist");
const Transaction = require("./models/Transaction");
const Ticker = require("./models/Ticker");
const TickerName = require("./models/TickerName");
User.hasOne(Watchlist);
Watchlist.belongsTo(User);
Ticker.hasOne(TickerName);
TickerName.belongsTo(Ticker);
module.exports = {
  db,
  models: {
    User,
    Watchlist,
    Transaction,
    Ticker,
    TickerName,
  },
};
