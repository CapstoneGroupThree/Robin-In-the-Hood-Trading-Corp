import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEntireWatchList,
  fetchWLSingleStockName,
  fetchWLSingleStockTickerPrice,
  selectWatchList,
  removeWatchListItem,
} from "./watchListViewSlice";
// import "./watchlistView.css";
import { Link } from "react-router-dom";
import ClosePriceChartPage from "../../JaimeTest/ClosePriceChartPage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WatchListView = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.auth.me.id);
  const watchlist = useSelector(selectWatchList);
  const [isLoading, setIsLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const hasRunRef = useRef(false);

  const handleRemove = (e) => {
    e.preventDefault();
    let ticker = e.target.value;
    dispatch(removeWatchListItem({ id, ticker }));
  };

  const handlePopUpClick = () => {
    setPopupVisible(!popupVisible);
  };

  const handleOverlayClick = () => {
    setPopupVisible(false);
  };

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

  const getWLStockInfo = async (ticker) => {
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
    console.log(marketOpen);
    // console.log(from, to);
    // Pass marketOpen and from, to to the thunk
    const getTickerPrice = async (ticker) => {
      let tickerPriceInfo = await dispatch(
        fetchWLSingleStockTickerPrice({
          ticker,
          marketOpen: marketOpen,
          from,
          to,
        })
      );
      await console.log(tickerPriceInfo);
      return tickerPriceInfo.payload.close || tickerPriceInfo.payload.preMarket;
    };
    const tickerPrice = await getTickerPrice(ticker);
    console.log(`[getStockInfo] Ticker: ${ticker}, Price: ${tickerPrice}`);
    return tickerPrice;
  };

  const getWLTickerName = async (ticker) => {
    let tickerInfo = await dispatch(fetchWLSingleStockName(ticker));
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

  useEffect(
    () => {
      const fetchWatchlist = async () => {
        await dispatch(fetchEntireWatchList(id));
      };
      if (!watchlist.list) {
        fetchWatchlist();
      }
    },
    [dispatch],
    watchlist
  );

  useEffect(() => {
    if (watchlist.list && !hasRunRef.current) {
      console.log(watchlist.list);
      let list = watchlist.list.filter((ticker) => !watchlist[ticker]);
      //todo once realtime(fake) chart is implemented we need to change this so that it potentially updates every minute etc.
      const runWLStocksFetch = async (list) => {
        await Promise.all(
          list.map(async (ticker) => {
            await getWLStockInfo(ticker);
            await getWLTickerName(ticker);
          })
        );
      };

      runWLStocksFetch(list);

      setIsLoading(false);

      hasRunRef.current = true;
    }
  }, [watchlist]);

  if (isLoading) {
    return <div> Watchlist Loading wooooo</div>;
  }

  let lengthOfWatchlist = Object.keys(watchlist).length - 1;

  {
    /* Tailwind classes for .popup */
  }
  const popupClasses = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-5  border-blue-950 shadow-md shadow-black rounded-md w-100 max-w-full w-max max-h-full h-max overflow-y-auto bg-gradient-to-bl from-slate-950 to-indigo-950`;

  {
    /* Tailwind classes for .overlay */
  }
  const overlayClasses = `fixed inset-0 bg-black bg-opacity-50 z-5`;

  return (
    <div>
      <h2
        className=" button mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handlePopUpClick}
      >
        WatchList (Click to View)
      </h2>
      {popupVisible && (
        <div className="">
          <div className={overlayClasses} onClick={handleOverlayClick}></div>
          <div className={popupClasses}>
            {lengthOfWatchlist > 0 ? (
              <div className="watchlist-table-container max-h-600px w-full overflow-y-auto shadow-lg shadow-black rounded-md border-6 border-x-sky-800">
                <table className="w-full table-auto border-collapse border  border-6 border-sky-800 rounded-lg bg-gradient-to-t from-slate-800 to-slate-900 text-white">
                  <thead className="border-b-2 border-sky-950">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Name</th>
                      <th className="px-4 py-2 font-semibold">Symbol</th>
                      <th className="px-4 py-2 font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(watchlist)
                      .filter(([key]) => key !== "list")
                      .map(([ticker, stockInfo], index) => {
                        const trimmedName = trimName(stockInfo.name);
                        return (
                          <tr
                            key={ticker}
                            className={`${
                              index % 2 === 0 ? "bg-slate-800" : ""
                            } hover:bg-slate-700 transition-colors duration-200 ease-in-out`}
                          >
                            <td className="px-4 py-2">
                              <Link to={`/singleStock/${ticker}`}>
                                {trimmedName}
                              </Link>
                            </td>
                            <td className="px-4 py-2">{ticker}</td>
                            <td className="px-4 py-2">
                              {"$" + stockInfo.close?.toFixed(2) ||
                                "$" + stockInfo.preMarket?.toFixed(2)}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                value={ticker}
                                onClick={handleRemove}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="popup">Watchlist is empty</div>
            )}
          </div>
        </div>
      )}

      <div>
        {lengthOfWatchlist > 0 ? (
          <div className="watchlist-table-container shadow-lg shadow-black rounded-md border-6 border-x-sky-800">
            {/* <table className="w-full table-auto border-collapse border-6 border-sky-800 rounded-lg bg-gradient-to-t from-slate-800 to-slate-900 text-white  ">
              <thead className="border-2  border-sky-950">
                <tr>
                  <th className="px-4 py-2 font-semibold">Name</th>
                  <th className="px-4 py-2 font-semibold">Symbol</th>
                  <th className="px-4 py-2 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className=" ">
                {/* {Object.entries(watchlist) */}
            {/* .filter(([key]) => key !== "list") */}
            {/* .map(([ticker, stockInfo], index) => { */}
            {/* const trimmedName = trimName(stockInfo.name);
                    return (
                      <tr
                        key={ticker}
                        className={`${
                          index % 2 === 0 ? "bg-slate-800" : ""
                        } hover:bg-slate-700 transition-colors duration-200 ease-in-out`}
                      >
                        <td className="px-4 py-2">
                          <Link
                            to={`/singleStock/${ticker}`}
                            className="text-sky-200 hover:text-sky-400 "
                          >
                            {trimmedName}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{ticker}</td>
                        <td className="px-4 py-2">
                          {stockInfo.close.toFixed(2) ||
                            stockInfo.preMarket.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table> */}
            <div style={{ width: "750px", height: "40vh", overflow: "hidden" }}>
              <Slider
                infinite={true}
                slidesToShow={1}
                slidesToScroll={1}
                swipeToSlide={true}
                arrows={false}
              >
                {Object.entries(watchlist)
                  .filter(([key]) => key !== "list")
                  .map(([ticker, stockInfo]) => {
                    const trimmedName = trimName(stockInfo.name);
                    return (
                      <div key={ticker} className=" ">
                        <div className=" flex flex-row space-x-4 text-white">
                          <div>
                            <Link to={`/singleStock/${ticker}`}>
                              {trimmedName}
                            </Link>
                          </div>
                          <div>
                            {"$" + stockInfo.close?.toFixed(2) ||
                              "$" + stockInfo.preMarket?.toFixed(2)}
                          </div>
                        </div>
                        <ClosePriceChartPage ticker={ticker} />
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        ) : (
          <div>Watchlist is empty</div>
        )}
      </div>
    </div>
  );
};

export default WatchListView;
//todo make its pulling from the state if info is available in the state
