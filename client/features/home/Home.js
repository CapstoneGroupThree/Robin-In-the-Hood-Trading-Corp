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
    <div className="font-semibold flex flex-col h-screen justify-between max-h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1>Home</h1>
        <SearchBar name={displayedName} />
      </div>
      <div className="flex flex-grow h-2/5 max-h-screen overflow-hidden border  ">
        <div className="w-1/2 h-full flex flex-col box-content">
          <div className="assets h-1/2  border border-gray-400 p-4">
            <h2>Asset</h2>
            <h2> Total Balance: {balance}</h2>
          </div>
          <div className="watchlist h-1/2  border border-gray-400 p-4">
            <WatchListView />
          </div>
        </div>

        <div className="popularStocks h-2/4 max-h-screen w-1/2 flex flex-col border border-gray-400 p-4 ">
          <h2> Popular Stocks</h2>

          <div className="popularStocksHomeView  flex-grow border border-gray-400 p-4">
            <PopularStocksHomeView />
          </div>
        </div>
      </div>
      <div className="aibot self-end bottom-0 right-0">
        <img
          src="/aiChatRB.png"
          alt="your AI chat assistant "
          className="w-20 h-20"
        ></img>
      </div>
    </div>
  );
};

export default Home;
