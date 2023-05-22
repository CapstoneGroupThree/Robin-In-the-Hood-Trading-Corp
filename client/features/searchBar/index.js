import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchSearchResults, selectSearchResults } from "./searchSlice";
import "./search.css";

const SearchBar = (props) => {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { name } = props;
  const searchRef = useRef(null);
  const location = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    setQuery("");
  };

  const searchResults = useSelector(selectSearchResults);

  useEffect(() => {
    if (searchResults.status === "failed") {
      console.error(searchResults.error);
      setQueryResults([]);
      setError("No Corresponding Ticker Info Was Found");
    } else if (searchResults.status === "succeeded") {
      console.log(searchResults.data);
      setQueryResults(searchResults.data);
      setError(null);
    }
  }, [searchResults]);

  const handleInputChange = async (event) => {
    const queryInput = event.target.value.toUpperCase();
    setQuery(queryInput);
    dispatch(fetchSearchResults({ symbol: queryInput }));
  };

  const handleOutsideClick = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setQuery("");
      setQueryResults([]);
      setError(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setQuery("");
    setQueryResults([]);
    setError(null);
  }, [location.pathname]); // Clear the query when the pathname changes

  const handleDropdownItemClick = (event) => {
    event.stopPropagation();
    setQuery("");
    setQueryResults([]);
    setError(null);
  };

  const renderDropdown = () => {
    if (error) {
      return (
        <ul className="dropdown-menu">
          <li className="dropdown-item">{error}</li>
        </ul>
      );
    }

    if (Array.isArray(queryResults) && queryResults.length > 0) {
      return (
        <ul className="dropdown-menu">
          {queryResults.map((result) => (
            <li key={result.id} className="dropdown-item">
              <Link
                to={`/singleStock/${result.symbol}`}
                onClick={handleDropdownItemClick}
                style={{ display: "block", width: "100%" }}
              >
                <span>{result.symbol + " : "}</span>
                {result.ticker_name && result.ticker_name.name.length > 40
                  ? `${result.ticker_name.name.substring(0, 40)}...`
                  : result.ticker_name && result.ticker_name.name}
              </Link>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  //todo we can check the backend during the query to see if it is a legit ~~~
  return (
    <div className="w-full flex justify-end pl-44">
      <form
        className="searchBar flex bg-transparent place-content-end space-x-4"
        onSubmit={handleSubmit}
        ref={searchRef}
      >
        <Link to={`/user/edit`}>
          <span className="profilePic&Name flex items-center space-x-2">
            {/* <img
              src="/defaultPFP.avif"
              alt="default profile picture"
              className="w-4 h-4 rounded-full"
            ></img> */}
            <i
              className="fa-regular fa-circle-user fa-2xl"
              style={{ color: "whitesmoke" }}
            ></i>

            <span className=" text-white text-xl font-body">{name}</span>
          </span>
        </Link>
        <input
          type="search"
          placeholder="Search Ticker"
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
          className="py-2 px-3 text-black bg-slate-700 rounded-md border border-slate-900 shadow-sm focus:outline-none focus:ring-2"
          style={{ width: "440px" }}
        ></input>
        {/*On submit we navigate the user to the stock tickers page*/}
        {/* <Link to={`/singleStock/${query}`}> */}
        <div className="px-3 py-2 bg-slate-700 text-white rounded-3xl  focus:outline-none focus:ring-2">
          <i className="fas fa-search"></i>
        </div>

        {/* </Link> */}
        {/* <span className="notificationBell mr-2">
          <img
            src="/notificationBell.png"
            alt="default profile picture"
            className="w-4 h-4"
          ></img>
        </span> */}

        <div>{renderDropdown()}</div>
      </form>
    </div>
  );
};

export default SearchBar;
