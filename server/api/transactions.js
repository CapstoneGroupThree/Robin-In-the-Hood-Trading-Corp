const express = require("express");
const app = express();
const {
  models: { Transaction },
} = require("../db");
module.exports = app;

//GET all transactions by a user based on userId of transaction
app.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const transaction = await Transaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.send(transaction);
  } catch (error) {
    console.log(error);
    res.status(404).send("GET Transaction Error");
  }
});
