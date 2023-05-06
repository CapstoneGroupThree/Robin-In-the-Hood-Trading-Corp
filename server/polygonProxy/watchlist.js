const express = require("express");
const app = express();
const {
  models: { User, Watchlist },
} = require("../db");
module.exports = app;

//GET Watchlist
app.get("/:id", async (req, res, next) => {
  try {
    //Fetch Watchlist based on userID, include name and currency (subject to change)
    const watchlist = await Watchlist.findOne({
      include: [{ model: User, attributes: ["first_name", "virtual_balance"] }],
      where: {
        userId: req.params.id,
      },
    });
    res.send(watchlist);
  } catch (error) {
    next(error);
  }
});

//POST Watchlist
app.post("/:id", async (req, res, next) => {
  try {
    //Fetch Watchlist based on userID, include name and currency (subject to change)
    const watchlist = await Watchlist.findOne({
      include: [{ model: User, attributes: ["first_name", "virtual_balance"] }],
      where: {
        userId: req.params.id,
      },
    });
    //Set the watchlist tickers key to the value passed in to the body(array of tickers)
    watchlist.tickers = req.body.tickers;
    //Update(save) the new value of the watchlist
    await watchlist.save();
    res.send(watchlist);
  } catch (error) {
    next(error);
  }
});

//PUT Watchlist (this will allow us to delete something off of the watchlist ex -> AAPL Ticker)
app.put("/:id/:ticker", async (req, res, next) => {
  try {
    //Fetch the watchlist based on userID, include name and currency (subject to change)
    const watchlist = await Watchlist.findOne({
      include: [{ model: User, attributes: ["first_name", "virtual_balance"] }],
      where: {
        userId: req.params.id,
      },
    });
    //Fiter through the tickers array and return all tickers that do not match the given ticker param
    watchlist.tickers = watchlist.tickers.filter(
      (tick) => tick !== req.params.ticker
    );
    //Update (save) the watchlist
    await watchlist.save();
    //Send back the new watchlist with the updated tickers array
    res.send(watchlist);
  } catch (error) {
    next(error);
  }
});
