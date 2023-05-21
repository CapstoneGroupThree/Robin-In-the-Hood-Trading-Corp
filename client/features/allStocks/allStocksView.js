import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllStocks,
  fetchAllStockDetails,
  selectAllStocks,
  fetchAllStockTickerPriceSingle,
} from "../allStocks/allStocksSlice";
import { Link } from "react-router-dom";
// import "./styles.css";
import SearchBar from "../searchBar";
// import Chatbot from "../chatBot";
import anime from "animejs";
import ChatbotWrapper from "../chatBot/chatBotWrapper";

const AllStocksView = () => {
  const username = useSelector((state) => state.auth.me.first_name);
  const displayedName = username.toUpperCase();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageInfo, setCurrentPageInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageNameCapInfo, setCurrentPageNameCapInfo] = useState({});

  const allStocks = useSelector(selectAllStocks);
  const allStockDetails = useSelector((state) => state.allStocks.stockDetails);

  const handlePageChange = (e) => {
    e.preventDefault();
    if (e.target.value === "prev") {
      setCurrentPage(currentPage - 1);
    }
    if (e.target.value === "next") {
      setCurrentPage(currentPage + 1);
    }
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

  //! used nager date api to get public holidays

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
      return [];
    }
  };

  const getStockDate = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    let to = `${year}-${month}-${day}`;

    const holidays = await fetchHolidays();
    const estOffset = -4 * 60; // Eastern Time is UTC-5
    const utcOffset = -now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() + estOffset - utcOffset);

    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    console.log(hour, minute);

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

      // todo test what happens if its monday premarket
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

    return { marketOpen, from, to };
  };

  useEffect(() => {
    if (!isLoading) {
      anime({
        targets: ".ticker",
        translateX: ["-25%", "-1000%"],
        duration: 600000,
        loop: true,
        direction: "normal",
        easing: "linear",
        loopComplete: function (anim) {
          anim.reset();
          anim.play();
        },
      });
    }
  }, [isLoading]);

  const getTickerPrice = async (ticker, marketOpen, from, to) => {
    let tickerPriceInfo = await dispatch(
      fetchAllStockTickerPriceSingle({
        ticker,
        marketOpen: marketOpen,
        from,
        to,
      })
    );
    // await console.log(tickerPriceInfo);
    console.log(tickerPriceInfo.payload);
    return tickerPriceInfo.payload.close || tickerPriceInfo.payload.preMarket;
  };

  useEffect(() => {
    const main = async () => {
      const { marketOpen, from, to } = await getStockDate();
      const page = currentPage;
      //todo import date functionality and pass it to the fetchAllStocks

      console.log("Date:", to, "Page:", page);
      const currentPageInfo = await dispatch(
        fetchAllStocks({ date: to, page: page })
      );

      await console.log(currentPageInfo.payload.results);
      const fetchedInfo = currentPageInfo.payload.results;
      // const fetchedInfoNameCap = fetchedInfo.map((info) => {info = {T: info.T}});
      //
      const updateNameCapState = () => {
        const objInfo = {};
        fetchedInfo.forEach(async (stock) => {
          const fetchedNameCap = await dispatch(
            fetchAllStockDetails({ ticker: stock.T })
          );
          const price = await getTickerPrice(stock.T, marketOpen, from, to);
          console.log(fetchedNameCap.payload.results);
          objInfo[stock.T] = fetchedNameCap.payload.results;
          objInfo[stock.T].price = price;
          console.log(objInfo);
          if (Object.keys(objInfo).length >= 10) {
            setCurrentPageNameCapInfo(objInfo);
          }
        });
      };
      updateNameCapState();

      // for (let ticker of fetchedInfo) {
      //   objInfo[ticker.T] =
      // }
      await setCurrentPageInfo(fetchedInfo);
      setIsLoading(false);
    };
    main();
  }, [dispatch, currentPage]);

  // useEffect(() => {
  //   allStocks.forEach((stock) => {
  //     dispatch(fetchAllStockDetails({ ticker: stock.T }));
  //   });
  // }, [allStockDetails, dispatch]);

  const changePercentageFunc = (open, close) => {
    const change = close - open;
    const percentageChange = (change / open) * 100;
    return percentageChange.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-950">
        <div class="lds-roller">
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
    );
  }

  return (
    <div className=" flex flex-col font-medium antialiased font-body h-screen w-full p-2 allStock-bg ">
      <div className="flex w-full justify-between text-white items-center pb-2 pl-4 pr-4 ">
        <h1 className=" whitespace-nowrap font-medium font-numbers text-2xl text-shadow-default">
          All Stocks
        </h1>
        <SearchBar name={displayedName} className="" />
      </div>
      {/* ticker tape */}
      <div className="ticker-wrap mb-2">
        <div className="ticker">
          {[...Array(2)].map((_, i) =>
            currentPageInfo.map((stock, index) => (
              <div
                className={`ticker__item ${
                  changePercentageFunc(stock.o, stock.c) >= 0
                    ? "ticker__item--positive"
                    : "ticker__item--negative"
                }`}
                key={stock.T + i + index} // ensure keys are unique
              >
                {stock.T} {changePercentageFunc(stock.o, stock.c)}%
              </div>
            ))
          )}
        </div>
      </div>

      {console.log(currentPageNameCapInfo)}
      {Object.keys(allStocks).length === 0 && <div>Loading stocks...</div>}
      {Object.keys(allStocks).length > 0 && (
        <table className="w-full table-auto border-collapse border-6 border-sky-800 rounded-lg bg-gradient-to-t from-slate-800 to-slate-900 text-white">
          <thead className="border-2 border-sky-950">
            <tr>
              <th className="px-4 py-2 font-numbers">Name</th>
              <th className="px-4 py-2 font-numbers">Symbol</th>
              <th className="px-4 py-2 font-numbers">Price</th>
              <th className="px-4 py-2 font-numbers">Today's Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {currentPageInfo.map((stock, index) => {
              // const stockDetail = allStockDetails[stock.T];
              // const marketCap = stockDetail ? stockDetail.marketCap : "N/A";
              return (
                <tr
                  key={stock.T}
                  className={`${
                    index % 2 === 0 ? "bg-slate-800" : ""
                  } hover:bg-slate-700 transition-colors duration-200 ease-in-out`}
                >
                  <td className="px-4 py-2 text-center">
                    <Link
                      to={`/singleStock/${stock.T}`}
                      className="text-sky-200 hover:text-sky-400 font-numbers "
                    >
                      {currentPageNameCapInfo[stock.T]
                        ? trimName(currentPageNameCapInfo[stock.T].name)
                        : "loading"}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-center font-numbers">
                    {stock.T}
                  </td>
                  <td className="px-4 py-2 text-center font-numbers">
                    $
                    {currentPageNameCapInfo[stock.T]
                      ? currentPageNameCapInfo[stock.T].price?.toFixed(2) ||
                        " Premarket Price Unavailable"
                      : "loading"}
                  </td>
                  <td className="px-4 py-2 text-center font-numbers">
                    {changePercentageFunc(stock.o, stock.c)}%
                  </td>
                </tr>
                // <tr key={index}>
                //   <td>
                //     <Link to="/singleStock" className="stock-link">
                //       {stockDetail ? stockDetail.name : "N/A"}
                //     </Link>
                //   </td>
                //   <td>
                //     <Link to="/singleStock" className="stock-link">
                //       {stock.T}
                //     </Link>
                //   </td>
                //   <td>${stock.c.toFixed(2)}</td>
                //   <td>{changePercentageFunc(stock.o, stock.c)}%</td>
                //   <td>{marketCap}</td>
                // </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-center items-center">
        {" "}
        {currentPage > 1 ? (
          <button
            value="prev"
            onClick={handlePageChange}
            class="AS-button"
            role="button"
          >
            Prev
          </button>
        ) : (
          ""
        )}
        <span className="mr-2 text-white">Page: {currentPage}</span>
        <button
          value="next"
          onClick={handlePageChange}
          class="AS-button"
          role="button"
        >
          Next
        </button>
        <div className="aibot absolute bottom-0 right-0">
          <ChatbotWrapper />
        </div>
      </div>
    </div>
  );
};

export default AllStocksView;
