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

  const startingBalance = 100000; //or more or less~
  // If there's no balance history for this user, create an initial balance entry, all users should have 100 grand to start
  if (balanceHistory.length === 0) {
    await TotalBalanceHistory.bulkCreate([
      {
        userId,
        balance: startingBalance,
        assets: 0,
      },
      {
        userId,
        balance: startingBalance,
        assets: 0,
      },
    ]);
  }

  res.json(balanceHistory);
});

//example route : http://localhost:8080/api/totalBalanceHistory/balance/1
// example post after user has traded something:
//{"newAssetsValue" : 999999}
// used to update asset value for real time refresh updates, we want the frontend to pass in the new balance after calculating everything from the portfolio get route, so FE updates first then passes new asset value in
app.post("/balance/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { newAssetsValue } = req.body;

  // Get the latest TotalBalanceHistory for the user
  let latestBalanceHistory = await TotalBalanceHistory.findOne({
    where: { userId },
    order: [["timestamp", "DESC"]],
  });
  //if no history, user hasn't traded yet
  if (!latestBalanceHistory) {
    return res.status(404).json({ error: "User hasn't done any trading yet" });
  }

  // Create a new entry with the updated assets value and the same balance
  let newBalanceHistory = await TotalBalanceHistory.create({
    userId,
    balance: latestBalanceHistory.balance,
    assets: newAssetsValue,
    startingBalance: latestBalanceHistory.startingBalance,
  });

  res.json({
    message: "Balance history updated successfully",
    newBalanceHistory,
  });
});
