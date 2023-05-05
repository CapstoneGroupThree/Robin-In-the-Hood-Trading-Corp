const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

const api_key = process.env.API_KEY;
// const circularJson = require("circular-json");
// app.get("/", async (req, res) => {
//   console.log(api_key);
//   res.send("Dev mode, working on stuff.");
// });

//front end needs to provide queries, such as    /open-close?ticker=someticker&date=YYYY-MM-DD
app.get("/open-close", async (req, res) => {
  try {
    console.log(req.query);
    const { ticker, date } = req.query;
    if (!ticker || !date) {
      console.log(`inside if condition`);
      res.status(404).send({ message: "NO TICKER OR DATE PROVIDED!!!" });
    } else {
      const response = await axios.get(
        `https://api.polygon.io/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=${api_key}`
      );
      res.json(response.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/aggregate-bars/:ticker", async (req, res) => {
  try {
    console.log(req.params.ticker);
    const ticker = req.params.ticker
      ? req.params.ticker
      : () => {
          throw new Error("Foo is null!");
        };
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=${api_key}`
    );
    // console.log(response);

    const response_length = response.data;
    res.json(response_length);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//again front end must provide the queries    /all?page=somenumber&date=somedate
app.get("/all", async (req, res) => {
  try {
    const date = req.query.date;
    const { page } = req.query;
    const pageSize = 10;
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${api_key}`
    );
    if (typeof response !== "object") {
      res
        .status(404)
        .send({ message: "something went wrong, please check your inputs!" });
    } else {
      const dataArray = response.data.results;
      //note: first page -> 1 - 1= 0, so first index
      const paginated = dataArray.slice((page - 1) * pageSize, page * pageSize);
      res.json(paginated);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
