const axios = require("axios");
require("dotenv").config();
// const chalk = require('chalk');
const openaiController = require("./openaiController");

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
  const now = new Date();
  const currentYear = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const symbol = req.params.symbol;
  const multiplier = req.params.multiplier || 1;
  const timespan = req.params.timespan || "day";
  const from = req.params.from || `${currentYear}-01-01`;
  const to = req.params.to || `${currentYear}-${month}-${day}`;

  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}?unadjusted=true&sort=asc&limit=1000&apiKey=${polygonApiKey}`
    );
    console.log(`response.data: ${JSON.stringify(response.data)}`);

    // extract and format data for chart.js
    const chartData = {
      labels: response.data.results.map((result) =>
        // this is good for showing the entire date
        new Date(result.t).toISOString().slice(0, 16).replace("T", " ")
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

polygonController.getSummary = async (req, res, next) => {
  const symbol = req.params.symbol;
  const from = req.params.from || "2023-01-01";
  const to = req.params.to || "2023-05-08";

  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?unadjusted=true&sort=asc&limit=120&apiKey=${polygonApiKey}`
    );
    console.log(`response.data: ${JSON.stringify(response.data)}`);

    // extract closing prices
    const closePrices = response.data.results.map((result) => result.c);
    // console.log(chalk.green.italic(`closePrices: ${closePrices}`));

    // generate the prompt for the openai api call
    const prompt = `Please give me a summary of the following company's performance provided the stock ticker: ${symbol} which has the following history of close prices: ${closePrices.join(
      ", "
    )} during the following time period: ${from} to ${to}, also include the company's full name in your analysis as well as an average risk weighting if the stock should be bought, held or sold.`;

    // call openai api and get the response
    const openaiSummary = await openaiController.getOpenaiResponse(
      prompt,
      process.env.OPENAI_MODEL
    );

    // return the summary
    res.json({ summary: openaiSummary });
  } catch (err) {
    console.log(`Error in polygonController.getSummary: ${err.message}`);
    console.error(err);
    next(err);
  }
};

module.exports = polygonController;
