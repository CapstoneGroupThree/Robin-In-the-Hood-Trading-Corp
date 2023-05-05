import React from "react";
import { useSelector } from "react-redux";
import SearchBar from "../searchBar";

/**
 * COMPONENT
 */
const Home = () => {
  const username = useSelector((state) => state.auth.me.first_name);
  const displayedName = username.toUpperCase();

  const popularStocks = [
    {
      stock_name: "Apple",
      stock_ticker: "AAPL",
      currentPrice: "$170.52",
      changeFromOpenToday: "+1.2%",
      chart: "chart-apple-img",
    },
    {
      stock_name: "Amazon",
      stock_ticker: "AMZN",
      currentPrice: "$3,297.52",
      changeFromOpenToday: "+0.8%",
      chart: "chart-amazon-img",
    },
    {
      stock_name: "Tesla",
      stock_ticker: "TSLA",
      currentPrice: "$678.90",
      changeFromOpenToday: "-0.5%",
      chart: "chart-tesla-img",
    },
    {
      stock_name: "Alphabet Inc.",
      stock_ticker: "GOOGL",
      currentPrice: "$2,307.58",
      changeFromOpenToday: "+2.1%",
      chart: "chart-google-img",
    },
  ];

  const balance = "$100000";

  // console.log(displayedName);
  //todo create a search bar feature for pages that need it
  return (
    <div>
      <SearchBar name={displayedName} />
      <h2>Asset</h2>
      <h2> Total Balance: {balance}</h2>
      <h2> Popular Stocks</h2>
      <div className="popularStocksHomeView">
        {popularStocks.map((stock) => {
          return (
            <div key={stock.stock_ticker}>
              <h3>{stock.stock_name}</h3>
              <div>{stock.stock_ticker}</div>
              <div>{stock.currentPrice}</div>
              <div>{stock.changeFromOpenToday}</div>
              <div>Chart Placement Here:</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
