import React from "react";
import { useSelector } from "react-redux";
import SearchBar from "../searchBar";
import WatchListView from "./watchListView";
import PopularStocksHomeView from "./popularStockView";
import Chatbot from "../chatBot";
import TotalBalanceChartPage from "../JaimeTest/TotalBalanceChartPage";

const Home = () => {
  const username = useSelector((state) => state.auth.me.first_name);
  const userId = useSelector((state) => state.auth.me.id);
  const displayedName = username.toUpperCase();

  // console.log(displayedName);
  //todo create a search bar feature for pages that need it
  //todo need to get it working on my route pull
  return (
    <div className=" flex flex-col antialiased bg-transparent bg-gradient-to-tr from-slate-800 to-indigo-950 font-body font-medium w-full h-screen justify-between max-h-full overflow-hidden">
      <div className="flex justify-between max-w-full text-white items-center m-2 pl-4 pr-4">
        <h1 className=" font-medium font-body text-lg">Home</h1>
        <SearchBar name={displayedName} />
      </div>
      <div className="flex  space-x-4 p-2 pl-4 pr-4 h-5/12 w-11/12 overflow-hidden   ">
        <div className="w-1/2 h-full max-h-screen flex flex-col space-y-4  ">
          {/* <div className="assets h-1/3  border border-gray-400 p-4 rounded bg-gray-100"> */}
          {/* <div className=" assets gradient-home h-1/3 text-white border border-indigo-950 border-opacity-20 p-4 rounded bg-gradient-to-tr from-slate-800 to-slate-900 shadow-md shadow-slate-900 "> */}
          <div className="assets h-1/3 border p-4 rounded text-white bg-gradient-to-t from-slate-800 to-gray-900 shadow-md shadow-slate-900">
            <TotalBalanceChartPage userId={userId} />
          </div>
          <div className="watchlist h-2/3 w-full   bg-gradient-to-tr border border-indigo-950  from-slate-800 to-slate-900  p-4 rounded shadow-md shadow-slate-900 ">
            <WatchListView />
          </div>
        </div>
        <div className="popularStocks h-full w-1/2 flex flex-col  pt-4 pl-2 pr-2 border border-indigo-950 rounded bg-gradient-to-t from-slate-800 to-gray-900 shadow-md shadow-slate-900">
          <h2 className=" text-xl text-white font-medium pl-2">
            {" "}
            Popular Stocks
          </h2>

          <div className="popularStocksHomeView  flex-grow p-4  rounded ">
            <PopularStocksHomeView />
          </div>
        </div>
        <div className="aibot self-end bottom-0 right-0">
          {/* <img
          src="/aiChatRB.png"
          alt="your AI chat assistant "
          className="w-20 h-20"
        ></img> */}
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default Home;
