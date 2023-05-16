import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSinglePortfolio, selectSinglePortfolio } from "./portfolioSlice";
import { fetchTransactions, selectTransactions } from "./transactionSlice";
import { Link } from "react-router-dom";
import TotalBalanceChartPage from "../JaimeTest/TotalBalanceChartPage";

const Portfolio = () => {
  const me = useSelector((state) => state.auth.me);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.me.id);
  const portfolio = useSelector(selectSinglePortfolio);
  const transactions = useSelector(selectTransactions);

  useEffect(() => {
    async function getPortfolioAndTransactions() {
      await dispatch(fetchSinglePortfolio(userId));
      await dispatch(fetchTransactions(userId));
    }
    getPortfolioAndTransactions();
  }, []);

  return (
    <>
      <div>Portfolio!</div>
      <h1>Hello! {me.first_name}</h1>
      {console.log("UserId:", userId)}
      <div className="assets h-1/3  border border-gray-400 p-4 rounded bg-gray-100">
        <TotalBalanceChartPage userId={userId} />
      </div>
      {transactions && (
        <table className="w-full table-auto border-collapse border border-purple-500">
          <thead className="border-b-2 border-purple-500">
            <tr>
              <th className="px-4 py-2">Ticker</th>
              <th className="px-4 py-2">Transaction Type</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((t) => {
                return (
                  <tr key={t.id} className="border-b border-purple-500">
                    <td className="px-4 py-2 text-center">
                      <Link
                        to={`/singleStock/${t.stockTicker}`}
                        className=" hover:text-purple-500 "
                      >
                        {t.stockTicker}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-center">
                      Quantity: {t.quantity} | Type: {t.transaction_type}
                    </td>
                    <td className="px-4 py-2 text-center">${t.price}</td>
                    <td className="px-4 py-2 text-center">
                      {t.transaction_time.slice(0, 10)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      {/* <div>
        {portfolio.map((port) => {
          return <div key={port.id}>{port.stockName}</div>;
        })}
      </div> */}
      {console.log("Our React Portfolio:", portfolio)}
      {console.log("Our React Transactions", transactions)}
    </>
  );
};

export default Portfolio;
