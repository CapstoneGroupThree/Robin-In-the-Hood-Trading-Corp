import React from "react";
import { useSelector } from "react-redux";
import SearchBar from "../searchBar";
import WatchListView from "./watchListView";
import PopularStocksHomeView from "./popularStockView";
import Chatbot from "../chatBot";

const Home = () => {
  const username = useSelector((state) => state.auth.me.first_name);
  const displayedName = username.toUpperCase();

  const balance = "$100000";

  // console.log(displayedName);
  //todo create a search bar feature for pages that need it
  return (
    <div className="font-semibold flex flex-col w-full h-screen justify-between max-h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1>Home</h1>
        <SearchBar name={displayedName} />
      </div>
      <div className="flex flex-grow space-x-4 h-2/5 overflow-hidden   ">
        <div className="w-1/2 h-full flex flex-col space-y-4 box-content ">
          <div className="assets h-1/3  border border-gray-400 p-4 rounded bg-gray-100">
            <h2>Asset</h2>
            <h2> Total Balance: {balance}</h2>
          </div>
          <div className="watchlist h-2/3 w-full  border border-gray-400 p-4 bg-gray-100 rounded">
            <WatchListView />
          </div>
        </div>

        <div className="popularStocks h-full w-1/2 flex flex-col border border-gray-400 p-4 bg-gray-100 rounded ">
          <h2> Popular Stocks</h2>

          <div className="popularStocksHomeView  flex-grow  border-gray-400 p-4 bg-gray-100 rounded">
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
      <Chatbot />
    </div>
  );
};

export default Home;
