// TotalBalanceChartPage.js

import React, { useEffect, useState } from "react";
import TotalBalanceChart from "./TotalBalanceChart";

const TotalBalanceChartPage = (props) => {
  const [lastTotalBalance, setLastTotalBalance] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [lastAssets, setLastAssets] = useState(null);
  const [lastBalanceOnly, setLastBalanceOnly] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [startingBalance, setStartingBalnce] = useState(100000);
  const { userId, reload } = props;

  useEffect(() => {
    fetchData();
  }, [reload]);

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
    <div>
      <h2
        className="button mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setShowDetails(!showDetails);
        }}
      >
        Total Balance: {"$" + lastTotalBalance?.toFixed(2)} (Click to view/hide
        details) Percentage Change:{" "}
        <span
          className={
            lastTotalBalance - startingBalance >= 0
              ? "positive-change"
              : "negative-change"
          }
        >
          {(
            ((lastTotalBalance - startingBalance) / startingBalance) *
            100
          ).toFixed(2)}
          {lastTotalBalance - startingBalance >= 0
            ? " % \u2191\u2191"
            : " % \u2193\u2193"}
          {" $ " + Math.abs(lastTotalBalance - startingBalance).toFixed(2)}
        </span>
      </h2>

      {showDetails ? (
        <div>
          <p>Stock Assets: {"$" + lastAssets?.toFixed(2)}</p>
          <p>Cash Balance: {"$" + lastBalanceOnly?.toFixed(2)}</p>
        </div>
      ) : (
        ""
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
