const express = require("express");
const app = express();
const {
  models: { TotalBalanceHistory },
} = require("../db");
module.exports = app;

//example route : http://localhost:8080/api/totalBalanceHistory/balance/1
// use this to render the chart for assets/balance
app.get("/balance/:userId", async (req, res) => {
  const userId = req.params.userId;
  // you want to add the assets and balance together in the front end and then render it on the chart
  let balanceHistory = await TotalBalanceHistory.findAll({
    where: { userId },
    order: [["timestamp", "ASC"]],
  });

  // If there's no balance history for this user, create an initial balance entry, all users should have 100 grand to start
  if (balanceHistory.length === 0) {
    const startingBalance = 100000; //or more or less~
    balanceHistory = await TotalBalanceHistory.create({
      userId,
      balance: startingBalance,
      assets: 0,
    });
  }
  res.json(balanceHistory);
});
