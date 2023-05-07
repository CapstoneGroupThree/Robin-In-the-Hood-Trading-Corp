import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllStocks,
  fetchAllStockDetails,
  selectAllStocks,
} from "../allStocks/allStocksSlice";
import { Link } from "react-router-dom";
import Pagination from "./paginationTest";
import "./styles.css";
import SearchBar from "../searchBar";

const AllStocksView = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageInfo, setCurrentPageInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageNameCapInfo, setCurrentPageNameCapInfo] = useState({});

  const allStocks = useSelector(selectAllStocks);
  const allStockDetails = useSelector((state) => state.allStocks.stockDetails);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Selected page:", page);
  };

  useEffect(() => {
    const x = async () => {
      const date = "2023-05-05";
      const page = 1;
      //todo import date functionality and pass it to the fetchAllStocks
      //todo links to singlestock that work
      console.log("Date:", date, "Page:", page);
      const currentPage = await dispatch(
        fetchAllStocks({ date: date, page: page })
      );
      await console.log(currentPage.payload.results);
      const fetchedInfo = currentPage.payload.results;
      // const fetchedInfoNameCap = fetchedInfo.map((info) => {info = {T: info.T}});
      //
      const updateNameCapState = () => {
        const objInfo = {};
        fetchedInfo.forEach(async (stock) => {
          const fetchedNameCap = await dispatch(
            fetchAllStockDetails({ ticker: stock.T })
          );
          await console.log(fetchedNameCap.payload.results);
          objInfo[stock.T] = fetchedNameCap.payload.results;
          console.log(objInfo);
          if (Object.keys(objInfo).length >= 10) {
            setCurrentPageNameCapInfo(objInfo);
          }
        });
      };
      updateNameCapState();

      // for (let ticker of fetchedInfo) {
      //   objInfo[ticker.T] =
      // }
      await setCurrentPageInfo(fetchedInfo);
      setIsLoading(false);
    };
    x();
  }, [dispatch]);

  // useEffect(() => {
  //   allStocks.forEach((stock) => {
  //     dispatch(fetchAllStockDetails({ ticker: stock.T }));
  //   });
  // }, [allStockDetails, dispatch]);

  const changePercentageFunc = (open, close) => {
    const change = close - open;
    const percentageChange = (change / open) * 100;
    return percentageChange.toFixed(2);
  };

  const formatMarketCap = (number) => {
    if (number >= 1e12) {
      return (number / 1e12).toFixed(2) + "T";
    } else if (number >= 1e9) {
      return (number / 1e9).toFixed(2) + "B";
    } else {
      return number.toFixed(2);
    }
  };

  if (isLoading) {
    return <div>is Loading</div>;
  }

  return (
    <div>
      <SearchBar />
      {console.log(currentPageNameCapInfo)}
      <h2>All Stocks</h2>
      <h3>Top 100 Most Popular</h3>
      {Object.keys(allStocks).length === 0 && <div>Loading stocks...</div>}
      {Object.keys(allStocks).length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Today's Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {currentPageInfo.map((stock) => {
              // const stockDetail = allStockDetails[stock.T];
              // const marketCap = stockDetail ? stockDetail.marketCap : "N/A";
              return (
                <tr key={stock.T}>
                  <td>
                    <Link to="/singleStock" className="stock-link">
                      {currentPageNameCapInfo[stock.T]
                        ? currentPageNameCapInfo[stock.T].name
                        : "loading"}
                    </Link>
                  </td>
                  <td>{stock.T}</td>
                  <td>${stock.c.toFixed(2)}</td>
                  <td>{changePercentageFunc(stock.o, stock.c)}%</td>
                </tr>
                // <tr key={index}>
                //   <td>
                //     <Link to="/singleStock" className="stock-link">
                //       {stockDetail ? stockDetail.name : "N/A"}
                //     </Link>
                //   </td>
                //   <td>
                //     <Link to="/singleStock" className="stock-link">
                //       {stock.T}
                //     </Link>
                //   </td>
                //   <td>${stock.c.toFixed(2)}</td>
                //   <td>{changePercentageFunc(stock.o, stock.c)}%</td>
                //   <td>{marketCap}</td>
                // </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default AllStocksView;

//todo page functionality, add market data , name
