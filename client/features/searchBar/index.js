import React from "react";

const SearchBar = () => {
  //todo tier2 feature
  return (
    <div>
      <form>
        <input
          type="search"
          placeholder="Search Name/Ticker"
          aria-label="Search"
        ></input>
      </form>
    </div>
  );
};

export default SearchBar;
