import React from "react";

const SearchBar = (props) => {
  const { name } = props;
  //todo tier2 feature
  return (
    <div>
      <form className="searchBar">
        <input
          type="search"
          placeholder="Search Name/Ticker"
          aria-label="Search"
        ></input>
        <span className="notificationBell">
          <img
            src="/notificationBell.png"
            alt="default profile picture"
            style={{ width: "1rem", height: "1rem" }}
          ></img>
        </span>
        <span className="profilePic&Name">
          <img
            src="/defaultPFP.avif"
            alt="default profile picture"
            style={{ width: "1rem", height: "1rem" }}
          ></img>
          {name}
        </span>
      </form>
    </div>
  );
};

export default SearchBar;
