const express = require("express");
const app = express();
const {
  models: { Portfolio, Transaction, TotalBalanceHistory },
} = require("../db");
module.exports = app;

// example route = http://localhost:8080/api/portfolio/1
// This route handles the retrieval of a user's portfolio.
app.get("/:userId", async (req, res) => {
  // get userid
  const userId = req.params.userId;

  // Fetch all portfolio entries for user
  const portfolio = await Portfolio.findAll({
    where: { userId },
  });

  // Fetch the most ****recent total balance for the user
  let latestBalance = await TotalBalanceHistory.findOne({
    where: { userId },
    order: [["timestamp", "DESC"]],
  });

  // If there's no balance history for this user, create an initial balance entry, all users should have 100 grand to start
  if (!latestBalance) {
    const startingBalance = 100000; //or more or less~
    latestBalance = await TotalBalanceHistory.create({
      userId,
      balance: startingBalance,
      assets: 0,
    });
  }
  // we want to handle in the front end issues with selling stocks that they don't have so something like a quantity: 0 for stock the user doesn't have, sell button is greyed out etc.
  // Send back the portfolio and the latest balance
  res.json({ portfolio, latestBalance: latestBalance.balance });
});

// example route: http://localhost:8080/api/portfolio/transaction
// sample test post: {
// "userId": "1",
// "stockTicker": "TSLA",
// "stockName": "Tesla",
// "transaction_type": "buy",
// "quantity": 100,
// "purchasePrice": 100
//       }
// when changing transaction type to buy or sell, be careful if seed file has force sync true as it will delete all old data everytime you edit the backend
// This route handles the buying and selling of stocks
app.post("/transaction", async (req, res) => {
  // Extract the necessary information from the request body
  const {
    userId,
    stockTicker,
    stockName,
    transaction_type,
    quantity,
    purchasePrice,
  } = req.body;

  // Fetch the portfolio entry for the user and ticker provided
  const portfolioEntry = await Portfolio.findOne({
    where: { userId, stockTicker },
  });

  // Fetch the most recent total balance for the user
  let currentTotalBalance = await TotalBalanceHistory.findOne({
    where: { userId },
    order: [["timestamp", "DESC"]],
  });

  // If there's no balance history for this user ~~~
  if (!currentTotalBalance) {
    const startingBalance = 100000; // 100k start
    currentTotalBalance = await TotalBalanceHistory.create({
      userId,
      balance: startingBalance,
      assets: 0,
    });
  }

  let newTotalBalance;
  let newAssetsValue;

  // Handle buying stocks
  if (transaction_type === "buy") {
    // If the user already has this stock in their portfolio, increment the quantity
    // Calculate the cost of the transaction
    const transactionCost = quantity * purchasePrice;
    // Check if the user has enough balance to complete the transaction
    if (currentTotalBalance.balance < transactionCost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    //if the user can afford proceed
    if (portfolioEntry) {
      portfolioEntry.quantity += quantity;
      await portfolioEntry.save();
    } else {
      // If the user does not have this stock in their portfolio, create a new entry
      await Portfolio.create({
        userId,
        stockTicker,
        stockName,
        quantity,
        purchasePrice,
      });
    }
    // Update the total balance and assets value
    newTotalBalance = currentTotalBalance.balance - quantity * purchasePrice;
    newAssetsValue = currentTotalBalance.assets + quantity * purchasePrice;
  } else if (transaction_type === "sell") {
    // Handle selling stocks
    // If the user does not have enough of this stock in their portfolio, return an error, we should handle this in the front end after the get route to not allow users to even hit this point
    if (!portfolioEntry || portfolioEntry.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock to sell" });
    }
    // Decrement the quantity of the stock in the user's portfolio
    portfolioEntry.quantity -= quantity;
    // If the quantity of this stock is now 0, remove the portfolio entry
    if (portfolioEntry.quantity === 0) {
      await portfolioEntry.destroy();
    } else {
      await portfolioEntry.save();
    }
    // Update the total balance and assets value
    newTotalBalance = currentTotalBalance.balance + quantity * purchasePrice;
    newAssetsValue = currentTotalBalance.assets - quantity * purchasePrice;
  } else {
    return res.status(400).json({ error: "Invalid transaction type" });
  }

  // Record the transaction in the database
  await Transaction.create({
    userId,
    stockTicker,
    transaction_type,
    quantity,
  });

  // Create a new total balance history entry with the updated balance and assets value
  await TotalBalanceHistory.create({
    userId,
    balance: newTotalBalance,
    assets: newAssetsValue,
  });

  res.status(201).json({ message: "Transaction successful" });
});
