import React from "react";
import { useSelector } from "react-redux";
import SearchBar from "../searchBar";

/**
 * COMPONENT
 */
const Home = (props) => {
  const username = useSelector((state) => state.auth.me.username);

  //todo create a search bar feature for pages that need it
  return (
    <div>
      <SearchBar />
      <h3>Welcome, {username}</h3>
    </div>
  );
};

export default Home;
