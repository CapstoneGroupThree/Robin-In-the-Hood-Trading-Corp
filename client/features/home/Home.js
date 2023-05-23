import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../searchBar";
import WatchListView from "./watchListView";
import PopularStocksHomeView from "./popularStockView";
// import Chatbot from "../chatBot";
import TotalBalanceChartPage from "../JaimeTest/TotalBalanceChartPage";
import {
  selectSinglePortfolio,
  updatePortfolioValuation,
  fetchSinglePortfolio,
} from "../portfolio/portfolioSlice";
import { fetchSingleStockTickerPriceInfo } from "../singleStock/singleStockViewSlice.js";
import ChatbotWrapper from "../chatBot/chatBotWrapper";

const Home = () => {
  const username = useSelector((state) => state.auth.me.first_name);
  const userId = useSelector((state) => state.auth.me.id);
  const displayedName = username.toUpperCase();
  const portfolio = useSelector(selectSinglePortfolio);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    async function getPortfolioAndTransactions() {
      await dispatch(fetchSinglePortfolio(userId));
    }
    getPortfolioAndTransactions();
  }, [dispatch]);

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
        console.log(tickerInfo);
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
        //todo
        console.log("sneaky", totalValuation, portfolio);
        dispatch(updatePortfolioValuation({ id: userId, totalValuation }));
      }
      setReload(reload + 1);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-slate-950 via-slate-800 to-slate-950">
        {/* <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>*/}
      </div>
    );
    // <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-slate-800 to-slate-900">
    //   <div className="animate-spin rounded-full h-64 w-64 border-t-8 border-b-8  border-purple-500"></div>
    // </div>
  }
  // console.log(displayedName);
  //todo create a search bar feature for pages that need it
  //todo need to get it working on my route pull
  return (
    <div className=" flex flex-col antialiased bg-transparent home-bg w-full h-full justify-between overflow-hidden">
      {console.log(portfolio)}

      <div className="flex items-center justify-between align-middle w-full text-center text-white pl-4 pr-4  ">
        <h1 className=" font-head text-3xl text-shadow-lg">Home</h1>
        <SearchBar name={displayedName} className="" />
      </div>
      <div className="flex  space-x-4 p-2 pl-4 pr-4 h-screen w-full overflow-hidden   ">
        <div className="w-1/2 h-5/6 max-h-screen flex flex-col space-y-4  ">
          {/* <div className="assets h-1/3  border border-gray-400 p-4 rounded bg-gray-100"> */}
          {/* <div className=" assets gradient-home h-1/3 text-white border border-indigo-950 border-opacity-20 p-4 rounded bg-gradient-to-tr from-slate-800 to-slate-900 shadow-md shadow-slate-900 "> */}
          <div className="assets relative h-2/5 border border-slate-600 p-4 rounded w-full text-white bg-gradient-to-t from-slate-900 via-slate-700 to-slate-900  p-4 rounded box-shadow ">
            <button
              className="refresh-button absolute top-4 right-4 z-10"
              onClick={fetchPortfolioData}
            >
              <i className="fa-solid fa-arrows-rotate"></i> Refresh
            </button>
            <TotalBalanceChartPage userId={userId} reload={reload} />
          </div>

          <div className="watchlist h-3/5 w-full border border-slate-600  bg-gradient-to-t from-slate-900 via-slate-700 to-slate-900  p-4 rounded box-shadow ">
            <WatchListView />
          </div>
        </div>
        <div className="popularStocks h-5/6 w-1/2 flex flex-col  pt-4 pl-2 pr-2 border border-slate-600 rounded bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900 box-shadow">
          <h2 className="relative mt-2 text-xl font-numbers font-semibold pl-2">
            <span className="ml-3.5 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Popular{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Stocks
            </span>
            <span className="absolute top-0 left-0 w-full h-full opacity-0 " />
          </h2>

          <div className="popularStocksHomeView  flex-grow p-4  rounded ">
            <PopularStocksHomeView />
          </div>
        </div>
        <div className="aibot absolute bottom-2 right-2">
          <ChatbotWrapper />
        </div>
      </div>
    </div>
  );
};

export default Home;
