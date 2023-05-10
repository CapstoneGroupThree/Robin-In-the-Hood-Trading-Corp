import React from "react";

const SearchBar = (props) => {
  const { name } = props;
  //todo tier2 feature
  return (
    <div>
      <form className="searchBar flex items-center">
        <input
          type="search"
          placeholder="Search Name/Ticker"
          aria-label="Search"
        ></input>
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
