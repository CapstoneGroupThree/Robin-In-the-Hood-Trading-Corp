import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchBar = (props) => {
  const [query, setQuery] = useState("");
  const { name } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    setQuery("");
  };
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  //todo tier2 feature
  return (
    <div className=" w-full flex justify-end  pl-44  ">
      <form
        className="searchBar flex  bg-transparent place-content-end space-x-4"
        onSubmit={handleSubmit}
      >
        <input
          type="search"
          placeholder="Search Ticker"
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
          className=" w-2/6 py-2 px-3 text-black rounded-md border-2 border-sky-800 shadow-sm focus:outline-none focus:ring-2"
        ></input>
        {/*On submit we navigate the user to the stock tickers page*/}
        <Link to={`/singleStock/${query}`}>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-700 text-white rounded-3xl  focus:outline-none focus:ring-2"
          >
            <i className="fas fa-search"></i>
          </button>
        </Link>
        {/* <span className="notificationBell mr-2">
          <img
            src="/notificationBell.png"
            alt="default profile picture"
            className="w-4 h-4"
          ></img>
        </span> */}
        <Link to={`/user/edit`}>
          <span className="profilePic&Name flex items-center space-x-2">
            <img
              src="/defaultPFP.avif"
              alt="default profile picture"
              className="w-4 h-4 rounded-full"
            ></img>
            <span className=" text-white font-body ">{name}</span>
          </span>
        </Link>
      </form>
    </div>
  );
};

export default SearchBar;
