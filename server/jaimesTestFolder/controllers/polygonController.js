const axios = require("axios");
require("dotenv").config();
// const chalk = require('chalk');

const polygonApiKey = process.env.API_KEY;
// console.log(chalk.red.bold(`polygonApiKey: ${polygonApiKey}`));

const polygonController = {};

polygonController.getStockData = async (req, res, next) => {
  const symbol = req.params.symbol;

  const config = {
    headers: {
      Authorization: `Bearer ${polygonApiKey}`,
    },
    params: {
      limit: 5,
      order: "desc",
    },
  };

  try {
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/tickers/${symbol}`,
      config
    );
    console.log(`response.data: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (err) {
    console.log(`Error in polygonController.getStockData: ${err.message}`);
    console.error(err);
    next(err);
  }
};

// get a group of stock tickers sperated by commas and return the data
polygonController.getGroupTickers = async (req, res, next) => {
  const symbols = req.params.symbols;
  const config = {
    headers: {
      Authorization: `Bearer ${polygonApiKey}`,
    },
    params: {
      limit: 5,
      order: "desc",
    },
  };

  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbols}`,
      config
    );
    console.log(`response.data: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (err) {
    console.log(`Error in polygonController.getGroupTickers: ${err.message}`);
    console.error(err);
    next(err);
  }
};

// fetch stock data for candlestick chart
polygonController.getCandlestickData = async (req, res, next) => {
  const symbol = req.params.symbol;
  const multiplier = req.params.multiplier || 1;
  const timespan = req.params.timespan || "day";
  const from = req.params.from || "2022-01-01";
  const to = req.params.to || "2022-12-31";

  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}?unadjusted=true&sort=asc&limit=120&apiKey=${polygonApiKey}`
    );
    console.log(`response.data: ${JSON.stringify(response.data)}`);

    // extract and format data for chart.js
    const chartData = {
      labels: response.data.results.map((result) =>
        new Date(result.t).toISOString().slice(0, 10)
      ),
      datasets: response.data.results.map((result) => ({
        open: result.o,
        close: result.c,
        high: result.h,
        low: result.l,
        volume: result.v,
      })),
    };

    res.json(chartData); // object that contains labels and datasets
  } catch (err) {
    console.log(
      `Error in polygonController.getCandlestickData: ${err.message}`
    );
    console.error(err);
    next(err);
  }
};

module.exports = polygonController;
