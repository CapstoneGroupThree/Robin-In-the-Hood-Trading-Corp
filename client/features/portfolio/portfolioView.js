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

const Portfolio = () => {
  const me = useSelector((state) => state.auth.me);
  const yourName =
    me.first_name.slice(0, 1).toUpperCase() +
    me.first_name.slice(1).toLowerCase();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.me.id);
  const portfolio = useSelector(selectSinglePortfolio);
  const transactions = useSelector(selectTransactions);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [showPortfolio, setShowPortfolio] = useState(true);
  const [showPurchases, setShowPurchases] = useState(false);

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
      (hour > 9 || (hour === 9 && minute >= 50)) &&
      hour < 16 &&
      !isHoliday;
    console.log(marketOpen);

    const isPreMarket =
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      hour >= 0 &&
      (hour < 9 || (hour === 9 && minute < 50)) &&
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

  const fetchPortfolioData = async () => {
    if (portfolio) {
      console.log(portfolio);
      const promises = portfolio.map(async (portfolioItem) => {
        console.log(portfolioItem.stockTicker, portfolioItem.quantity);
        const tickerInfo = await getStockInfo(portfolioItem.stockTicker);
        return {
          ticker: portfolioItem.stockTicker,
          quantity: portfolioItem.quantity,
          price: tickerInfo.close || tickerInfo.results[0].c,
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
        //todo this is just going through weird for some reason
        dispatch(updatePortfolioValuation({ id: userId, totalValuation }));
      }
      setReload(reload + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-slate-800 to-slate-900">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      // <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-slate-800 to-slate-900">
      //   <div className="animate-spin rounded-full h-64 w-64 border-t-8 border-b-8  border-purple-500"></div>
      // </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 portfolio-bg">
      {console.log("portfolio", portfolio)}
      <h1
        className="px-4  mb-4 text-center font-body text-white"
        style={{
          fontSize: "25px",
        }}
      >
        Hello {yourName}!
      </h1>
      {console.log("UserId:", userId)}
      <div
        className="assets relative min-h-500 border border-slate-600 w-full text-white bg-gradient-to-t from-slate-900 via-slate-700 to-slate-900 p-4 rounded box-shadow"
        style={{ minHeight: "310px" }}
      >
        <button
          className="refresh-button absolute top-4 right-4 z-10"
          onClick={fetchPortfolioData}
        >
          <i className="fa-solid fa-arrows-rotate"></i> Refresh
        </button>
        <TotalBalanceChartPage userId={userId} reload={reload} />
      </div>
      {/* <button
        className=" button mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setShowPurchases(true);
          setShowPortfolio(false);
        }}
      >
        Toggle Purchase History
      </button>
      <button
        className=" button mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setShowPurchases(false);
          setShowPortfolio(true);
        }}
      >
        Show Portfolio Assets
      </button> */}
      <div className="border-t border-gray-500 mt-8 mb-8"></div>
      <div className="flex flex-row items-center justify-evenly">
        <button
          className=" styled-button mb-6"
          style={{ "--clr": " #0FF0FC" }}
          onClick={() => {
            setShowPurchases(true);
            setShowPortfolio(false);
          }}
        >
          <span>Toggle Purchase History</span>
          <i />
        </button>
        <button
          className=" styled-button mb-6"
          style={{ "--clr": "#39FF14" }}
          onClick={() => {
            setShowPurchases(false);
            setShowPortfolio(true);
          }}
        >
          <span>Show Portfolio Assets</span>
          <i />
        </button>
      </div>
      {portfolio && showPortfolio ? (
        <div className=" max-h-90 overflow-y-auto scroll-style">
          <table className="w-full h-1/3 table-auto border-collapse border-6 border-sky-800 rounded-lg bg-gradient-to-t from-slate-800 to-slate-900">
            <thead className="border-2 border-green-500">
              <tr>
                <th className="px-4 py-2 font-numbers text-white">Ticker</th>
                <th className="px-4 py-2 font-numbers text-white">Company</th>
                <th className="px-4 py-2 font-numbers text-white">Quantity</th>
                <th className="px-4 py-2 font-numbers text-white">
                  Average Purchase Price
                </th>
                <th className="px-4 py-2 font-numbers text-white">
                  Last Purchased:
                </th>
              </tr>
            </thead>
            <tbody>
              {portfolio &&
                portfolio.map((portfolioItem, index) => {
                  return (
                    <tr
                      key={portfolioItem.id}
                      className={`${
                        index % 2 === 0 ? "bg-slate-800" : ""
                      } hover:bg-slate-700 transition-colors duration-200 ease-in-out`}
                    >
                      <td className="px-4 py-2 text-center font-body text-white">
                        {portfolioItem.stockTicker}
                      </td>
                      <td className="px-4 py-2 text-center text-sky-200 hover:text-sky-400">
                        <Link
                          className="font-body"
                          to={`/singleStock/${portfolioItem.stockTicker}`}
                        >
                          {portfolioItem.stockName.length > 30
                            ? portfolioItem.stockName.slice(0, 30) + "..."
                            : portfolioItem.stockName}
                        </Link>
                      </td>
                      <td className="px-4 py-2 font-body text-center text-white">
                        {portfolioItem.quantity}
                      </td>
                      <td className="px-4 py-2 font-body text-center text-white">
                        {portfolioItem.purchasePrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 font-body text-center text-white">
                        {new Date(portfolioItem.updatedAt).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "short",
                            timeStyle: "short",
                          }
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}

      {transactions && showPurchases ? (
        <div className=" max-h-90 overflow-y-auto scroll-style">
          <table className="w-full h-1/3  table-auto border-collapse border-6 border-sky-800 rounded-lg bg-gradient-to-t from-slate-800 to-slate-900">
            <thead className="border-2 border-cyan-500">
              <tr>
                <th className="px-4 py-2 text-white">Ticker</th>
                <th className="px-4 py-2 text-white">Transaction Type</th>
                <th className="px-4 py-2 text-white">Price</th>
                <th className="px-4 py-2 text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {console.log(transactions)}
              {transactions &&
                transactions.map((t, index) => {
                  return (
                    <tr
                      key={t.id}
                      className={`${
                        index % 2 === 0 ? "bg-slate-800" : ""
                      } hover:bg-slate-700 transition-colors duration-200 ease-in-out`}
                    >
                      <td className="px-4 py-2 text-center font-body text-white">
                        <Link
                          to={`/singleStock/${t.stockTicker}`}
                          className=" text-sky-200 hover:text-sky-400 font-body "
                        >
                          {t.stockTicker}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-center font-body text-white">
                        Quantity: {t.quantity} | Type: {t.transaction_type}
                      </td>
                      <td className="px-4 py-2 text-center font-body text-white">
                        ${t.price}
                      </td>
                      <td className="px-4 py-2 text-center font-body text-white">
                        {new Date(t.transaction_time).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
      {/* <div>
        {portfolio.map((port) => {
          return <div key={port.id}>{port.stockName}</div>;
        })}
      </div> */}
      {console.log("Our React Portfolio:", portfolio)}
      {console.log("Our React Transactions", transactions)}
    </div>
  );
};

export default Portfolio;
