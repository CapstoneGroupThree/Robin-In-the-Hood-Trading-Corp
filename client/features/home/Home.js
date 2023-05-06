import React from "react";
import { useSelector } from "react-redux";
import SearchBar from "../searchBar";
import WatchListView from "./watchListView";
import PopularStocksHomeView from "./popularStockView";

const Home = () => {
  const username = useSelector((state) => state.auth.me.first_name);
  const displayedName = username.toUpperCase();

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
        <PopularStocksHomeView />
      </div>
      <h2>
        <WatchListView />
      </h2>
      <img
        src="/aiChatRB.png"
        alt="your AI chat assistant "
        style={{ width: "5rem", height: "5rem" }}
      ></img>
    </div>
  );
};

export default Home;
