import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSingleStockName } from "../../singleStock/singleStockSearchSlice";
import { fetchSingleStockTickerInfo } from "../../singleStock/singleStockSearchSlice";

const PopularStocksHomeView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    function getRandomTickers() {
      const tickerNames = [
        "GOOGL",
        "AMZN",
        "AAPL",
        "BAC",
        "BRK-A",
        "FB",
        "GE",
        "GS",
        "JNJ",
        "JPM",
        "MCD",
        "MSFT",
        "NFLX",
        "NVDA",
        "PFE",
        "PG",
        "TSLA",
        "KO",
        "DIS",
        "V",
        "BABA",
        "AMD",
        "CSCO",
        "XOM",
        "F",
        "INTC",
        "JCI",
        "NKE",
        "PYPL",
        "HD",
        "ADBE",
        "ALPFF",
        "GOOG",
        "AXP",
        "T",
        "BA",
        "CVX",
        "CCEP",
        "DAL",
        "XOM",
        "GM",
        "HD",
        "IBM",
        "JPM",
        "MA",
        "MRK",
        "PEP",
        "PG",
        "VZ",
        "WMT",
      ];

      const selectedTickers = [];
      const numToSelect = 4;

      // Randomly select 4 tickers from the array
      while (selectedTickers.length < numToSelect) {
        const randomIndex = Math.floor(Math.random() * tickerNames.length);
        const randomTicker = tickerNames[randomIndex];
        if (!selectedTickers.includes(randomTicker)) {
          selectedTickers.push(randomTicker);
        }
      }

      return selectedTickers;
    }

    // const getName = async () => {
    //   let tickerInfo = await dispatch(fetchSingleStockName("TSLA"));
    //   await console.log(tickerInfo.payload.results.name);
    //   return tickerInfo.payload.results.name;
    // };

    // getName();

    const getTickerPrice = async () => {
      let tickerPriceInfo = await dispatch(fetchSingleStockTickerInfo("TSLA"));
      await console.log(tickerPriceInfo.payload);
      return tickerPriceInfo.payload;
    };
    getTickerPrice();

    // const tickers = getRandomTickers();
    // console.log(tickers);
    // const popularStocks = {};
    // for (let i = 0; i < tickers.length; i++) {
    //   let ticker = tickers[i];
    //   popularStocks.ticker = [dispatch(fetchSingleStockName(ticker))];
    // }

    //todo do thunk calls to get the item for the 4 tickers one to tickerdetails one to aggregates per minute
  }, [dispatch]);

  return <div>pop stocks here yay</div>;
};

export default PopularStocksHomeView;
