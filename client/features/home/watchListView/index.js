import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEntireWatchList,
  fetchWLSingleStockName,
  fetchWLSingleStockTickerPrice,
  selectWatchList,
  removeWatchListItem,
} from "./watchListViewSlice";
import "./watchlistView.css";
import { Link } from "react-router-dom";

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
      (hour > 9 || (hour === 9 && minute >= 30)) &&
      hour < 16 &&
      !isHoliday;
    console.log(marketOpen);

    const isPreMarket =
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      hour >= 0 &&
      (hour < 9 || (hour === 9 && minute < 30)) &&
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

  return (
    <div>
      <h2 style={{ color: "red" }} onClick={handlePopUpClick}>
        WatchList
      </h2>
      {popupVisible && (
        <div>
          <div className="overlay" onClick={handleOverlayClick}></div>
          <div className="popup">
            {lengthOfWatchlist ? (
              Object.entries(watchlist)
                .filter(([key]) => key !== "list")
                .map(([ticker, stockInfo]) => {
                  const trimmedName = trimName(stockInfo.name);
                  return (
                    <div key={ticker} className="Watchlist">
                      <Link to={`/singleStock/${ticker}`}>
                        <h2>{trimmedName}</h2>
                      </Link>
                      <p>Ticker: {ticker}</p>
                      <p>
                        Price:{" "}
                        {stockInfo.close.toFixed(2) ||
                          stockInfo.preMarket.toFixed(2)}
                      </p>
                      <button value={ticker} onClick={handleRemove}>
                        Remove
                      </button>
                    </div>
                  );
                })
            ) : (
              <div className="popup">Watchlist is empty</div>
            )}
          </div>
        </div>
      )}

      <div>
        {lengthOfWatchlist ? (
          Object.entries(watchlist)
            .filter(([key]) => key !== "list")
            .map(([ticker, stockInfo]) => {
              const trimmedName = trimName(stockInfo.name);
              return (
                <div key={ticker} className="Watchlist">
                  <Link to={`/singleStock/${ticker}`}>
                    <h2>{trimmedName}</h2>
                  </Link>
                  <p>Ticker: {ticker}</p>
                  <p>
                    Price:{" "}
                    {stockInfo.close.toFixed(2) ||
                      stockInfo.preMarket.toFixed(2)}
                  </p>
                </div>
              );
            })
        ) : (
          <div>Please add stocks to your watchlist</div>
        )}
      </div>
    </div>
  );
};

export default WatchListView;
//todo make its pulling from the state if info is available in the state
