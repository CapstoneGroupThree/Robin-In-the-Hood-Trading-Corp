const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();
module.exports = app;

const api_key = process.env.API_KEY;

//Front End Queries Example -> /open-close?ticker=their_value&date=their_value

//Aggregates (Bars)
app.get("/aggregates", async (req, res) => {
  try {
    //limit was hardcoded to 120, tested at 1
    //from and to are dates in YYYY-MM-DD Format
    const { ticker, from, to } = req.query;
    // const ticker = req.params.ticker;
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=1&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Aggregates Error!");
  }
});

//Grouped Daily
app.get("/all", async (req, res) => {
  try {
    const { page, date } = req.query;
    const pageSize = 10;
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${api_key}`
    );
    if (typeof response !== "object") {
      res.status(404).send("Input Error");
    } else {
      //Grab the results array
      const resultsData = response.data.results;
      //Cut the results array down to 10 results per page
      const paginated = resultsData.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      res.send(paginated);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Grouped Daily Error!");
  }
});

//Open-Close (Checked)
app.get("/open-close", async (req, res) => {
  try {
    const { ticker, date } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Open-Close Error!");
  }
});

//Previous Close
app.get("/previous-close", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Previous Close Error!");
  }
});

//Trades //Requires Subscription
app.get("/trades", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v3/trades/${ticker}?apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Trades Error!");
  }
});

//Last Trade //Requires Subscripton
app.get("/last-trade", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Last Trade Error");
  }
});

//Quotes //Requires Subscription

//Last Quote //Requires Subscription

//All Tickers //Requires Subscription

//Gainers/Losers //Requires Subscription

//Ticker //Requires Subscription

//Simple Moving Average
//Example Query -> ?ticker=AAPL&timespan=minute&adjusted=true&window=50&series_type=open&order=asc&limit=50
app.get("/simple-moving-average", async (req, res) => {
  try {
    const { ticker, timespan, adjusted, window, series_type, order, limit } =
      req.query;
    //Timespan -> minute, hour, day, week, month, quarter, year
    //Adjusted -> boolean
    //Window -> # ex. 50
    //Series_Type -> open, high, low, close
    //Order -> asc(ascending), desc(descending)
    //Limit -> Defaulted to 10 if null, max is 5000
    //const ticker = userTicker || 'AAPL'

    // if(!ticker){
    //   res.status(404).send('No input!')
    // }

    const response = await axios.get(
      `https://api.polygon.io/v1/indicators/sma/${ticker}?timespan=${timespan}&adjusted=${adjusted}&window=${window}&series_type=${series_type}&order=${order}&limit=${limit}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Simple Moving Average Error!");
  }
});

//Exponential Moving Average
//Example Query -> ?ticker=AAPL&timespan=minute&adjusted=true&window=50&series_type=open&order=asc&limit=50
app.get("/exponential-moving-average", async (req, res) => {
  try {
    const { ticker, timespan, adjusted, window, series_type, order, limit } =
      req.query;
    //Timespan -> minute, hour, day, week, month, quarter, year
    //Adjusted -> boolean
    //Window -> # ex. 50
    //Series_Type -> open, high, low, close
    //Order -> asc(ascending), desc(descending)
    //Limit -> Defaulted to 10 if null, max is 5000

    const response = await axios.get(
      `https://api.polygon.io/v1/indicators/ema/${ticker}?timespan=${timespan}&adjusted=${adjusted}&window=${window}&series_type=${series_type}&order=${order}&limit=${limit}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Exponential Moving Average Error!");
  }
});

//Moving Average Convergence/Divergence (MACD)
//Example Query -> ?ticker=AAPL&timespan=day&adjusted=true&short_window=12&long_window=26&signal_window=9&series_type=open&order=asc&limit=50
//You can use an object to specify all of the queries inside of the request
app.get("/moving-average-convergence-divergence", async (req, res) => {
  try {
    const {
      ticker,
      timespan,
      adjusted,
      short_window,
      long_window,
      signal_window,
      series_type,
      order,
      limit,
    } = req.query;
    //Timespan -> minute, hour, day, week, month, quarter, year
    //Adjusted -> boolean
    //Short_Window -> # ex. 12
    //Long_Window -> # ex. 26
    //Signal_Window -> # ex. 9
    //Series_Type -> open, high, low, close
    //Order -> asc(ascending), desc(descending)
    //Limit -> Defaulted to 10 if null, max is 5000

    const response = await axios.get(
      `https://api.polygon.io/v1/indicators/macd/${ticker}?timespan=${timespan}&adjusted=${adjusted}&short_window=${short_window}&long_window=${long_window}&signal_window=${signal_window}&series_type=${series_type}&order=${order}&limit=${limit}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("MACD Error!");
  }
});

//Relative Strength Index (RSI)
//Example Query -> ?ticker=AAPL&timespan=day&adjusted=true&window=50&series_type=open&order=asc&limit=50
app.get("/relative-strength-index", async (req, res) => {
  try {
    const { ticker, timespan, adjusted, window, series_type, order, limit } =
      req.query;
    //Timespan -> minute, hour, day, week, month, quarter, year
    //Adjusted -> boolean
    //Window -> # ex. 50
    //Series_Type -> open, high, low, close
    //Order -> asc(ascending), desc(descending)
    //Limit -> Defaulted to 10 if null, max is 5000

    const response = await axios.get(
      `https://api.polygon.io/v1/indicators/rsi/${ticker}?timespan=${timespan}&adjusted=${adjusted}&window=${window}&series_type=${series_type}&order=${order}&limit=${limit}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Relative Strength Index Error");
  }
});
