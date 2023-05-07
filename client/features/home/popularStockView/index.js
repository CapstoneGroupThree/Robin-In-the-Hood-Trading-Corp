import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSinglePopularStockName,
  fetchSinglePopularStockTickerPrice,
  selectSinglePopularStock,
} from "./popularStockViewSlice";

const PopularStocksHomeView = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  //this is where we have the things in the state
  const popularStocks = useSelector(selectSinglePopularStock);
  // console.log(popularStocks);

  const tickerNames = [
    "GOOGL",
    "AMZN",
    "AAPL",
    "BAC",
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
    "NKE",
    "PYPL",
    "ADBE",
    "GOOG",
    "AXP",
    "T",
    "BA",
    "CVX",
    "DAL",
    "GM",
    "IBM",
    "MA",
    "MRK",
    "PEP",
    "VZ",
    "WMT",
  ];

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  let to = `${year}-${month}-${day}`;

  const fetchHolidays = async () => {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/US`
      );

      //filter holidays because veterans day and comlumbus dont count for stock exchanges, there's only 13 so should be relatively quick
      //got market holiday info from https://www.aarp.org/money/investing/info-2023/stock-market-holidays.html#:~:text=They%20will%20close%20early%2C%20at,after%20Thanksgiving%20and%20Christmas%20Eve.
      //api using: https://date.nager.at/swagger/index.html
      const holidays = await response.json();
      const filteredHolidays = holidays
        .filter(
          (holiday) =>
            holiday.name !== "Veterans Day" && holiday.name !== "Columbus Day"
        )
        .map((holiday) => holiday.date);
      // console.log(
      //   "🚀 ~ file: index.js:102 ~ fetchHolidays ~ filteredHolidays:",
      //   filteredHolidays
      // );
      return filteredHolidays;
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  };

  const getStockInfo = async (ticker) => {
    const holidays = await fetchHolidays();
    const estOffset = -5 * 60; // Eastern Time is UTC-5
    const utcOffset = -now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() + estOffset - utcOffset);

    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Check if the current date is a holiday
    const isHoliday = holidays.includes(to);

    // Market is open on weekdays between 9:30 AM and 4:00 PM Eastern Time and not a holiday
    const marketOpen =
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      (hour > 9 || (hour === 9 && minute >= 30)) &&
      hour < 16 &&
      !isHoliday;

    const getMostRecentTradingDay = (date) => {
      let newDate = new Date(date);
      let currentMarketOpen = marketOpen;

      while (!currentMarketOpen) {
        newDate.setDate(newDate.getDate() - 1);

        // Update the marketOpen condition inside the loop
        const dayOfWeek = newDate.getDay();
        const isHoliday = holidays.includes(newDate.toISOString().slice(0, 10));
        currentMarketOpen = dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday;
      }
      return newDate.toISOString().slice(0, 10);
    };

    const from = marketOpen ? to : getMostRecentTradingDay(now);
    to = marketOpen ? to : from;
    // console.log(marketOpen);
    // console.log(from, to);
    // Pass marketOpen and from, to to the thunk
    const getTickerPrice = async (ticker) => {
      let tickerPriceInfo = await dispatch(
        fetchSinglePopularStockTickerPrice({ ticker, marketOpen, from, to })
      );
      // await console.log(tickerPriceInfo);
      return tickerPriceInfo.payload.close;
    };
    return getTickerPrice(ticker);
  };

  const getTickerName = async (ticker) => {
    let tickerInfo = await dispatch(fetchSinglePopularStockName(ticker));
    return tickerInfo.payload.results.name;
  };

  const trimName = (name, maxLength = 30) => {
    if (!name) {
      return "";
    }
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + "...";
    }
    return name;
  };

  const getRandomTickers = () => {
    const selectedTickers = [];
    const numToSelect = 4;
    while (selectedTickers.length < numToSelect) {
      const randomIndex = Math.floor(Math.random() * tickerNames.length);
      const randomTicker = tickerNames[randomIndex];
      if (!selectedTickers.includes(randomTicker)) {
        selectedTickers.push(randomTicker);
      }
    }
    // todo put thunk logic on front end instead to make sure that we are making valid calls, also make sure that the thing isnt going to make a call on weekends/holidays where the stock exchange isnt open
    return selectedTickers;
  };

  let numOfPopStocksInfoInState = Object.keys(popularStocks).length;
  console.log(numOfPopStocksInfoInState);

  useEffect(() => {
    const selectedTickers = getRandomTickers();
    console.log(selectedTickers);
    const runPopStocksFetch = async (arrTickers) => {
      await Promise.all(
        arrTickers.map(async (ticker) => {
          await getStockInfo(ticker);
          await getTickerName(ticker);
        })
      );
    };

    if (numOfPopStocksInfoInState < 4) {
      console.log("running fetch");
      runPopStocksFetch(selectedTickers)
        .then(() => {
          console.log("done loading");
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching stocks:", error);
        });
    } //else everything we need should be in the state via (popularStocks)
  }, [dispatch]);

  useEffect(() => {
    if (numOfPopStocksInfoInState >= 4) {
      setIsLoading(false);
    }
  }, [popularStocks]);

  if (isLoading) {
    return <div>Yeah its loading woooooooo nice graphics here please</div>;
  }

  return (
    <div className="popularStocksView">
      {Object.entries(popularStocks).map(([ticker, stockInfo]) => {
        const trimmedName = trimName(stockInfo.name);
        return (
          <div key={ticker} className="stock">
            <h2>Name: {trimmedName}</h2>
            <p>Ticker: {ticker}</p>
            <p>Price: {stockInfo.close}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PopularStocksHomeView;
