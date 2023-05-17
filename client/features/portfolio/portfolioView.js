import React, { useState, useEffect, Profiler } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSinglePortfolio,
  selectSinglePortfolio,
  updatePortfolioValuation,
} from "./portfolioSlice";
import { fetchTransactions, selectTransactions } from "./transactionSlice";
import { Link } from "react-router-dom";
import TotalBalanceChartPage from "../JaimeTest/TotalBalanceChartPage";
import { fetchSingleStockTickerPriceInfo } from "../singleStock/singleStockViewSlice.js";
import { fetchUserPortfolio } from "../singleStock/portfolioBuySellSlice";

const Portfolio = () => {
  const me = useSelector((state) => state.auth.me);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.me.id);
  const portfolio = useSelector(selectSinglePortfolio);
  const transactions = useSelector(selectTransactions);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function getPortfolioAndTransactions() {
      await dispatch(fetchSinglePortfolio(userId));
      await dispatch(fetchTransactions(userId));
    }
    getPortfolioAndTransactions();
  }, []);

  const fetchHolidays = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
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
    }
    return [];
  };

  const getStockInfo = async (ticker) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    let to = `${year}-${month}-${day}`;

    const holidays = await fetchHolidays();
    //! UNCHANGE THIS BEFORE MAKING PULL REQUEST
    const estOffset = -4 * 60; // Eastern Time is UTC-5
    //! UNCHANGE THE ABOVE OFFSET
    const utcOffset = -now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() + estOffset - utcOffset);

    //todo might need to add a check for 15 min delayed data??

    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    console.log(dayOfWeek, hour, minute);

    // Check if the current date is a holiday
    const isHoliday = holidays.includes(to);

    // Market is open on weekdays between 9:30 AM and 4:00 PM Eastern Time and not a holiday
    const marketOpen =
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      (hour > 9 || (hour === 9 && minute >= 45)) &&
      hour < 16 &&
      !isHoliday;
    console.log(marketOpen);

    const isPreMarket =
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      hour >= 0 &&
      (hour < 9 || (hour === 9 && minute < 45)) &&
      !isHoliday;

    const getMostRecentTradingDay = (date, marketOpen, isPreMarket) => {
      let newDate = new Date(date);

      if (isPreMarket) {
        newDate.setHours(16);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        newDate.setDate(newDate.getDate() - 1);
      }

      let currentMarketOpen = marketOpen || isPreMarket;

      while (!currentMarketOpen) {
        const dayOfWeek = newDate.getDay();
        const hour = newDate.getHours();
        const minute = newDate.getMinutes();
        const isHoliday = holidays.includes(newDate.toISOString().slice(0, 10));

        if (
          hour > 16 ||
          (hour === 16 && minute >= 1) ||
          dayOfWeek === 0 ||
          dayOfWeek === 6 ||
          isHoliday
        ) {
          if (hour > 16 || (hour === 16 && minute >= 1)) {
            // If the hour is past 4 PM, set the newDate to 16:00 (market close)
            newDate.setHours(16);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
          } else {
            // Move to the previous day
            newDate.setDate(newDate.getDate() - 1);
          }
        } else {
          currentMarketOpen = true;
        }
      }
      return newDate.toISOString().slice(0, 10);
    };

    const from =
      marketOpen || isPreMarket
        ? to
        : getMostRecentTradingDay(now, marketOpen, isPreMarket);
    to = marketOpen || isPreMarket ? to : from;

    // console.log(marketOpen);
    // console.log(from, to);
    // Pass marketOpen and from, to to the thunk
    const getTickerPrice = async (ticker) => {
      let tickerPriceInfo = await dispatch(
        fetchSingleStockTickerPriceInfo({ ticker, marketOpen, from, to })
      );
      //save misc info into state
      // await console.log(tickerPriceInfo);\
      console.log(tickerPriceInfo.payload);
      return tickerPriceInfo.payload;
    };
    return getTickerPrice(ticker);
  };

  useEffect(() => {
    const fetch = async () => {
      if (portfolio) {
        console.log(portfolio);
        const promises = portfolio.map(async (portfolioItem) => {
          console.log(portfolioItem.stockTicker, portfolioItem.quantity);
          const tickerInfo = await getStockInfo(portfolioItem.stockTicker);
          return {
            ticker: portfolioItem.stockTicker,
            quantity: portfolioItem.quantity,
            price: tickerInfo.results[0].c,
          };
        });

        const info = await Promise.all(promises);
        console.log(info);
        const totalValuation = info.reduce((total, stock) => {
          const stockValue = stock.quantity * stock.price;
          return total + stockValue;
        }, 0);
        console.log(totalValuation);
        if (totalValuation !== 0) {
          //todo
          dispatch(updatePortfolioValuation({ id: userId, totalValuation }));
        }
        setReload(reload + 1);
        setLoading(false);
      }
    };
    fetch();
  }, [portfolio]);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <>
      {console.log("portfolio", portfolio)}
      <h1 className="px-4 py-2 text-center">Your Portfolio</h1>
      {console.log("UserId:", userId)}
      <div className="assets h-1/3  border border-gray-400 p-4 rounded bg-gray-100">
        <TotalBalanceChartPage userId={userId} reload={reload} />
      </div>
      {transactions && (
        <table className="w-full table-auto border-collapse border border-purple-500">
          <thead className="border-b-2 border-purple-500">
            <tr>
              <th className="px-4 py-2">Ticker</th>
              <th className="px-4 py-2">Transaction Type</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((t) => {
                return (
                  <tr key={t.id} className="border-b border-purple-500">
                    <td className="px-4 py-2 text-center">
                      <Link
                        to={`/singleStock/${t.stockTicker}`}
                        className=" hover:text-purple-500 "
                      >
                        {t.stockTicker}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-center">
                      Quantity: {t.quantity} | Type: {t.transaction_type}
                    </td>
                    <td className="px-4 py-2 text-center">${t.price}</td>
                    <td className="px-4 py-2 text-center">
                      {t.transaction_time.slice(0, 10)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      {/* <div>
        {portfolio.map((port) => {
          return <div key={port.id}>{port.stockName}</div>;
        })}
      </div> */}
      {console.log("Our React Portfolio:", portfolio)}
      {console.log("Our React Transactions", transactions)}
    </>
  );
};

export default Portfolio;
