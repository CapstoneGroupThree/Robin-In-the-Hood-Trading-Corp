import React, { useState } from "react";
import Pagination from "./paginationTest";
import SearchBar from "../searchBar";

const AllStocksView = () => {
  const dummyData = [
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      price: 150.0,
      change: 2.15,
      marketCap: Math.random() * 3e12,
    },
    {
      name: "Microsoft Corporation",
      symbol: "MSFT",
      price: 275.3,
      change: 1.85,
      marketCap: Math.random() * 3e12,
    },
    {
      name: "Amazon.com, Inc.",
      symbol: "AMZN",
      price: 3400.5,
      change: -0.75,
      marketCap: Math.random() * 3e12,
    },
  ];

  const totalPages = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Selected page:", page);
  };

  // Needs pagination functionality
  return (
    <div>
      <SearchBar />
      <h2>All Stocks</h2>
      <h3>Top 100 Most Popular</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Today's Change (%)</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((stock, index) => (
            <tr key={index}>
              <td>{stock.name}</td>
              <td>{stock.symbol}</td>
              <td>${stock.price.toFixed(2)}</td>
              <td>{stock.change.toFixed(2)}%</td>
              <td>{formatMarketCap(stock.marketCap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

function formatMarketCap(number) {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(2) + "T";
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + "B";
  } else {
    return number.toFixed(2);
  }
}

export default AllStocksView;
