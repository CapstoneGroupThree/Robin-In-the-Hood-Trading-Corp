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
    <div className=" flex flex-col antialiased bg-transparent bg-gradient-to-tr from-slate-800 to-indigo-950 font-body font-medium w-full h-full justify-between overflow-hidden">
      <div className="flex items-center justify-between w-full text-center text-white pl-4 pr-4">
        <h1 className=" font-medium font-body text-2xl text-shadow-lg">Home</h1>
        <SearchBar name={displayedName} className="" />
      </div>
      <div className="flex  space-x-4 p-2 pl-4 pr-4 h-screen w-full overflow-hidden   ">
        <div className="w-1/2 h-5/6 max-h-screen flex flex-col space-y-4  ">
          {/* <div className="assets h-1/3  border border-gray-400 p-4 rounded bg-gray-100"> */}
          {/* <div className=" assets gradient-home h-1/3 text-white border border-indigo-950 border-opacity-20 p-4 rounded bg-gradient-to-tr from-slate-800 to-slate-900 shadow-md shadow-slate-900 "> */}
          <div className="assets h-2/5 border p-4 rounded w-full text-white bg-gradient-to-t from-slate-800 to-gray-900 shadow-md shadow-slate-900">
            <TotalBalanceChartPage userId={userId} />
          </div>
          <div className="watchlist h-3/5 w-full bg-gradient-to-tr border border-indigo-950  from-slate-800 to-slate-900  p-4 rounded shadow-md shadow-slate-900 ">
            <WatchListView />
          </div>
        </div>
        <div className="popularStocks h-5/6 w-1/2 flex flex-col  pt-4 pl-2 pr-2 border border-indigo-950 rounded bg-gradient-to-t from-slate-800 to-gray-900 shadow-md shadow-slate-900">
          <h2 className=" text-xl text-white font-medium pl-2">
            {" "}
            Popular Stocks
          </h2>

          <div className="popularStocksHomeView  flex-grow p-4  rounded ">
            <PopularStocksHomeView />
          </div>
        </div>
        <div className="aibot absolute bottom-2 right-2">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default Home;
