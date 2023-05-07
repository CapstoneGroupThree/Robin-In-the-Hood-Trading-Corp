import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchSingleStockInfo,
  fetchSingleStockNews,
  fetchSingleStockTickerInfo,
} from "./singleStockViewSlice.js";

export default function SingleStockView(props) {
  const dispatch = useDispatch();
  const { ticker } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [tickerNews, setTickerNews] = useState([]);
  const [tickerInfo, setTickerInfo] = useState({});

  useEffect(() => {
    const fetchInfoToRender = async () => {
      const info = await dispatch(fetchSingleStockInfo({ ticker: "TSLA" }));
      const news = await dispatch(fetchSingleStockNews({ ticker: "TSLA" }));
      // await console.log(info.payload);
      // await console.log(news.payload);
      setTickerInfo(info.payload);
      setTickerNews(news.payload.results);
      // console.log(tickerInfo);
      // console.log(tickerNews);
      setIsLoading(false);
    };
    fetchInfoToRender();
  }, [dispatch]);

  if (isLoading) {
    return <div> Loading wooooo</div>;
  }

  return (
    <div>
      <h2>Stock Name</h2>
      <div>
        <h3></h3>
        <p>Price: </p>
        <p>High:</p>
        <p>Low: </p>
        <p>Close: </p>
        <div>News</div>
        <div>
          {console.log("here", tickerNews)}
          {tickerNews.map((news) => {
            return (
              <div key={news.id}>
                <div>{news.title}</div>
                <img
                  src={news.image_url}
                  alt="image"
                  style={{ width: "10rem", height: "10rem" }}
                ></img>
                <div>Author: {news.author}</div>
                <div>Date Published: {news.published_utc.slice(0, 10)}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <button onClick={() => console.log("Buy functionality")}>Buy</button>
        <button onClick={() => console.log("Sell functionality")}>Sell</button>
        <button onClick={() => console.log("Add to watchlist functionality")}>
          Add to Watchlist
        </button>
        <div>You already own: XXX shares:</div>
        <img
          src="/aiChatRB.png"
          alt="your AI chat assistant "
          style={{ width: "5rem", height: "5rem" }}
        ></img>
      </div>
    </div>
  );
}

//todo add to watchlist func, stock other info
