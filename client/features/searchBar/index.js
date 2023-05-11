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
    <div>
      <form className="searchBar flex items-center" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search Name/Ticker"
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
        ></input>
        {/*On submit we navigate the user to the stock tickers page*/}
        <Link to={`/singleStock/${query}`}>
          <button type="submit">GO!</button>
        </Link>
        <span className="notificationBell mr-2">
          <img
            src="/notificationBell.png"
            alt="default profile picture"
            className="w-4 h-4"
          ></img>
        </span>
        <span className="profilePic&Name flex">
          <img
            src="/defaultPFP.avif"
            alt="default profile picture"
            className="w-4 h-4 mr-2"
          ></img>
          {name}
        </span>
      </form>
    </div>
  );
};

export default SearchBar;
