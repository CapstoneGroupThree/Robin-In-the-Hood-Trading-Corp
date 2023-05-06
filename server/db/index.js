const db = require("./db");

const User = require("./models/User");
const Watchlist = require("./models/Watchlist");
const Transaction = require("./models/Transaction");
User.hasOne(Watchlist);
Watchlist.belongsTo(User);
module.exports = {
  db,
  models: {
    User,
    Watchlist,
    Transaction,
  },
};
