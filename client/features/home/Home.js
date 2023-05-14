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
    <div className=" flex flex-col antialiased bg-transparent bg-gradient-to-tr from-slate-800 to-indigo-950 text-base font-body font-medium w-full h-screen justify-between max-h-screen overflow-hidden">
      <div className="flex justify-between text-white items-center m-2 pl-4 pr-4">
        <h1 className=" font-medium font-body text-lg">Home</h1>
        <SearchBar name={displayedName} />
      </div>
      <div className="flex flex-grow space-x-4 p-2 pl-4 pr-4 h-2/5 overflow-hidden   ">
        <div className="w-1/2 h-full flex flex-col space-y-4 box-content ">
          <div className=" assets gradient-home h-1/3 text-white border border-indigo-950 border-opacity-20 p-4 rounded bg-gradient-to-tr from-slate-800 to-slate-900 shadow-md shadow-slate-900 ">
            <h2 className=" text-xl">Assets</h2>
            <h2 className=" text-gray-200 text-opacity-60">
              {" "}
              Total Balance: {balance}
            </h2>
          </div>
          <div className="watchlist h-full w-full   bg-gradient-to-tr border border-indigo-950  from-slate-800 to-slate-900  p-4 rounded shadow-md shadow-slate-900 ">
            <div className="h-1/3 ">
              <WatchListView />
            </div>
          </div>
        </div>

        <div className="popularStocks h-full w-1/2 flex flex-col  pt-4 pl-2 pr-2 border border-indigo-950 rounded bg-gradient-to-t from-slate-800 to-gray-900 shadow-md shadow-slate-900">
          <h2 className=" text-xl text-white font-medium pl-2">
            {" "}
            Popular Stocks
          </h2>

          <div className="popularStocksHomeView  flex-col h-full max-h-full  p-4  rounded ">
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
