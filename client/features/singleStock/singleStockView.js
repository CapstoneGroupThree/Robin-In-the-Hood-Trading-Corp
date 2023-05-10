import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleStockInfo,
  fetchSingleStockNews,
  fetchSingleStockTickerPriceInfo,
  fetchSingleStockOpenCloseInfo,
  selectSingleStock,
} from "./singleStockViewSlice.js";
import { addWatchListItem } from "../home/watchListView/watchListViewSlice.js";
import SearchBar from "../searchBar/index.js";
import { useParams } from "react-router-dom";
import VolumeChartPage from "../JaimeTest/VolumeChartPage.js";
import StockData from "../JaimeTest/StockData.js";
import ClosePriceChartPage from "../JaimeTest/ClosePriceChartPage";

export default function SingleStockView() {
  const dispatch = useDispatch();
  const { ticker } = useParams();
  const id = useSelector((state) => state.auth.me.id);
  const singleStockInfo = useSelector(selectSingleStock);
  // const allState = useSelector((state) => state);
  // console.log("All state:", allState);

  console.log(id);

  //! tesla is currently hardcoded in until all stocks is working

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevents infinite loop if the default image URL is also broken
    e.target.src = "/404sorryCat.avif";
  };

  const [isLoading, setIsLoading] = useState(true);
  const [tickerNews, setTickerNews] = useState([]);
  const [tickerInfo, setTickerInfo] = useState({});
  const [tickerPriceInfo, setTickerPriceInfo] = useState({});
  const [currentChart, setCurrentChart] = useState("stockData");

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

  const getStockInfo = async (ticker) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    let to = `${year}-${month}-${day}`;

    const holidays = await fetchHolidays();
    const estOffset = -4 * 60; // Eastern Time is UTC-5
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

    // console.log(marketOpen);
    // console.log(from, to);
    // Pass marketOpen and from, to to the thunk
    const getTickerPrice = async (ticker) => {
      let tickerPriceInfo = await dispatch(
        fetchSingleStockTickerPriceInfo({ ticker, marketOpen, from, to })
      );
      //save misc info into state
      const response = await dispatch(
        fetchSingleStockOpenCloseInfo({ ticker, to })
      ).unwrap();
      console.log("Response from fetchSingleStockOpenCloseInfo:", response);
      // await console.log(tickerPriceInfo);\
      console.log(tickerPriceInfo.payload);
      return tickerPriceInfo.payload;
    };
    return getTickerPrice(ticker);
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
  useEffect(() => {
    const fetchInfoToRender = async () => {
      const priceInfo = await getStockInfo(ticker);
      const info = await dispatch(fetchSingleStockInfo({ ticker }));
      const news = await dispatch(fetchSingleStockNews({ ticker }));

      // await console.log(info.payload);
      // await console.log(news.payload);
      // await console.log(priceInfo);
      setTickerInfo(info.payload);
      setTickerNews(news.payload.results);
      setTickerPriceInfo(priceInfo);

      // console.log(tickerInfo);
      // console.log(tickerNews);
      setIsLoading(false);
    };
    fetchInfoToRender();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  const handleAddToWatchList = async (e) => {
    e.preventDefault();
    let ticker = e.target.value;
    console.log(ticker);
    await dispatch(addWatchListItem({ id, ticker }));
  };
  const formatNumber = (number) => {
    return (number ?? 0).toFixed(2);
  };
  // todo maybe make the news section a little smaller 4 ~ etc
  // ! uses clearbit Logo API to get logos
  //! potentially might break during weekdays based on different api calls
  return (
    <div className="overflow-hidden max-h-screen">
      <div className="font-semibold flex flex-col h-screen  overflow-hidden">
        {console.log("singleStockInfoOpenCLose", singleStockInfo.openClose)}
        {console.log(tickerInfo)}
        {console.log(tickerPriceInfo)}

        {/* Header */}
        <div className="flex justify-between items-center mb-4 ">
          <div className="flex items-center">
            <div className="w-10 h-10 overflow-hidden rounded-full mr-4">
              <img
                src={`https://logo.clearbit.com/${tickerInfo.homepage_url}`}
                alt="Company Logo"
                onError={handleImageError}
                className="object-cover w-full h-full"
              />
            </div>
            <h2>{tickerInfo.name}</h2>
          </div>
          <SearchBar />
        </div>

        {/* Main  */}
        <div className="flex flex-grow">
          <div className="flex flex-col pr-4 w-7/12">
            <div>
              <div>
                {currentChart === "stockData" && <StockData ticker={ticker} />}
                {currentChart === "volume" && (
                  <VolumeChartPage ticker={ticker} />
                )}

                {currentChart === "closePrice" && (
                  <ClosePriceChartPage
                    className="close-price-chart"
                    ticker={ticker}
                  />
                )}
              </div>

              {/* Buttons to switch charts */}
              <div>
                <button
                  className="chart-button"
                  onClick={() => setCurrentChart("stockData")}
                >
                  Stock Data
                </button>
                <button
                  className="chart-button"
                  onClick={() => setCurrentChart("volume")}
                >
                  Volume Chart
                </button>
                <button
                  className="chart-button"
                  onClick={() => setCurrentChart("closePrice")}
                >
                  2-Hour Price Chart
                </button>
              </div>
            </div>

            <h3>{tickerInfo.ticker}</h3>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <strong>Price:</strong>
                <p>
                  {formatNumber(
                    tickerPriceInfo?.close ??
                      tickerPriceInfo?.results?.[0]?.c ??
                      tickerPriceInfo?.preMarket
                  )}
                </p>
              </div>
              <div>
                <strong>High:</strong>
                <p>
                  {formatNumber(
                    tickerPriceInfo?.high ?? singleStockInfo?.openClose?.high
                  )}
                </p>
              </div>
              <div>
                <strong>Premarket:</strong>
                <p>
                  {tickerPriceInfo?.preMarket ??
                    tickerPriceInfo?.open ??
                    singleStockInfo?.openClose?.open}
                </p>
              </div>
              <div>
                <strong>Low:</strong>
                <p>
                  {formatNumber(
                    tickerPriceInfo?.low ?? singleStockInfo?.openClose?.low
                  )}
                </p>
              </div>
              <div>
                <strong>Open:</strong>
                <p>
                  {formatNumber(
                    tickerPriceInfo?.open ?? singleStockInfo?.openClose?.open
                  )}
                </p>
              </div>
            </div>
            <div className=" max-h-full overflow-auto overflow-x-hidden">
              <p className="content-start ">
                Description: {tickerInfo.description}
              </p>
            </div>
          </div>

          {/* News */}
          <div className="  overflow-y-scroll h-5/6 max-h-screen w-5/12 ml-10 border border-purple-500 p-2 rounded-md flex-none">
            <h2>News</h2>
            <div>
              {console.log("here", tickerNews)}
              {tickerNews && tickerNews.length > 0 ? (
                tickerNews.map((news) => (
                  <div key={news.id}>
                    <h2>
                      <a
                        href={`${news.article_url}`}
                        alt={`link to ${news.title}`}
                      >
                        {news.title}
                      </a>
                    </h2>
                    <img
                      src={news.image_url}
                      alt="company image"
                      onError={handleImageError}
                      className="w-32 h-32 object-cover"
                    ></img>
                    <div>Author: {news.author}</div>
                    <div>Date Published: {news.published_utc.slice(0, 10)}</div>
                  </div>
                ))
              ) : (
                <div>Currently no news</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full absolute bottom-0 max-w-screen-md ">
          <button
            onClick={() => console.log("Buy functionality")}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Buy
          </button>
          <button
            onClick={() => console.log("Sell functionality")}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-3"
          >
            Sell
          </button>
          <button
            value={tickerInfo.ticker}
            onClick={handleAddToWatchList}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-3"
          >
            Add to Watchlist
          </button>
          <div>You already own: XXX shares:</div>
        </div>
        <div className="aibot absolute bottom-0 right-10">
          <img
            src="/aiChatRB.png"
            alt="your AI chat assistant"
            className="w-20 h-20"
          ></img>
        </div>
      </div>
    </div>
  );
}

//todo add to watchlist func, stock other info
