// TotalBalanceChartPage.js

import React, { useEffect, useState } from "react";
import TotalBalanceChart from "./TotalBalanceChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TotalBalanceChartPage = (props) => {
  const [lastTotalBalance, setLastTotalBalance] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [lastAssets, setLastAssets] = useState(null);
  const [lastBalanceOnly, setLastBalanceOnly] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [startingBalance, setStartingBalnce] = useState(100000);
  const { userId, reload } = props;

  useEffect(() => {
    fetchData();
  }, [reload]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const fetchData = async () => {
    console.log("Fetch userId:", userId);
    const response = await fetch(
      `http://localhost:8080/api/totalBalanceHistory/balance/${userId}`
    );
    const data = await response.json();
    console.log("Total Balance Chart Data:", data);
    const labels = data.map((entry) =>
      new Date(entry.timestamp).toLocaleString()
    );
    const balances = data.map((entry) => entry.balance + entry.assets);
    setLastTotalBalance(balances[balances.length - 1]);
    setLastAssets(data[data.length - 1].assets);
    setLastBalanceOnly(data[data.length - 1].balance);
    setStartingBalnce(data[data.length - 1].startingBalance);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Total Balance",
          data: balances,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    setBalanceData(chartData);
  };

  return (
    <div style={{ height: "250px" }}>
      <h2
        className={`relative mt-[-8px] font-bold py-2 px-4 rounded cursor-pointer transition-all duration-300 ease-in-out ml-[-15.5px] ${
          showDetails
            ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500"
            : "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500"
        }`}
        // onClick={toggleDetails}
      >
        Total Balance:{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-100">
          {"$" + (lastTotalBalance?.toFixed(2) || "0.00")}
        </span>{" "}
        {lastTotalBalance - startingBalance >= 0 ? (
          <>
            <i className="fa-solid fa-circle-up text-green-500"></i>{" "}
          </>
        ) : (
          <>
            <i className="fa-solid fa-circle-down text-red-500"></i>{" "}
          </>
        )}
        <span
          className={`${
            lastTotalBalance - startingBalance >= 0
              ? "positive-change"
              : "negative-change"
          }`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 to-pink-100">
            {(
              ((lastTotalBalance - startingBalance) / startingBalance) *
              100
            ).toFixed(2)}
            {" % "}
          </span>
          {lastTotalBalance - startingBalance >= 0 ? (
            <>
              <i className="fa-solid fa-circle-up text-green-500"></i>
            </>
          ) : (
            <>
              <i className="fa-solid fa-circle-down text-red-500"></i>
            </>
          )}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 to-pink-100">
            {" $" + Math.abs(lastTotalBalance - startingBalance).toFixed(2)}
          </span>
        </span>
        <span className="absolute top-0 left-0 w-full h-full opacity-0  transition-opacity duration-300 ease-in-out bg-gray-800 rounded" />
      </h2>

      {showDetails && (
        <div style={{ marginTop: "-10px" }}>
          <p className="font-numbers">
            {/* Stock Assets: {"$" + (lastAssets?.toFixed(2) || "0.00")} */}
            Cash Balance: {"$" + (lastBalanceOnly?.toFixed(2) || "0.00")}
          </p>
        </div>
      )}

      {balanceData ? (
        <TotalBalanceChart balanceData={balanceData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TotalBalanceChartPage;
