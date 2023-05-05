import React from "react";

const PopularStocksHomeView = () => {
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

  const tickers = getRandomTickers();
  console.log(tickers);

  return <div>pop stocks here</div>;
};

export default PopularStocksHomeView;
