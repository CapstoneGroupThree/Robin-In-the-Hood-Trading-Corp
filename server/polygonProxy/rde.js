const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();
module.exports = app;

const api_key = process.env.API_KEY;

//Tickers (All Tickers Supported by Polygon)
app.get("/tickers", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/tickers?active=true&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Tickers Error!");
  }
});

//useEffect(()=> {this}, [this])

//Ticker Details
app.get("/ticker-details", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Ticker Details Error!");
  }
});

//Ticker Events (Experimental)
app.get("/ticker-events", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/vX/reference/tickers/${ticker}/events?apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Ticker Details Error!");
  }
});

//Ticker News
app.get("/ticker-news", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Ticker News Error!");
  }
});

//Ticker Types
app.get("/ticker-types", async (req, res) => {
  try {
    const { asset_class } = req.query;
    //Assest_Class -> stocks, options, crypto, fx, indices
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/tickers/types?asset_class=${asset_class}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Ticker Types Error!");
  }
});

//Market Holidays
app.get("/market-holidays", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v1/marketstatus/upcoming?apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Market Holidays Error!");
  }
});

//Market Status
app.get("/market-status", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v1/marketstatus/now?apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Market Status Error!");
  }
});

//Stock Splits v3
app.get("/stock-splits", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/splits?ticker=${ticker}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Stock Splits Error!");
  }
});

//[Cash] Dividends v3
app.get("/dividends", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/dividends?apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Dividends Error!");
  }
});

//Stock Financials vX (Historic financial data for a stock ticker)
//Returns Large Payload, Pagination needed?
app.get("/stock-financials", async (req, res) => {
  try {
    const { ticker } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/vX/reference/financials?ticker=${ticker}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Stock Financials Error!");
  }
});

//Conditions //Lists all conditions Polygon uses
app.get("/conditions", async (req, res) => {
  try {
    const { asset_class } = req.query;
    //Assest_Class -> stocks, options, crypto, fx, indices
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/conditions?asset_class=${asset_class}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(404).send("Conditions Error!");
  }
});

//Exchanges //Lists all exchanges Ploygon knows about
app.get("/exchanges", async (req, res) => {
  try {
    const { asset_class } = req.query;
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/exchanges?asset_class=${asset_class}&apiKey=${api_key}`
    );
    res.send(response.data);
  } catch (error) {
    console.log("Exchnages Error");
    res.status(404).send("Exchanges Error!");
  }
});
