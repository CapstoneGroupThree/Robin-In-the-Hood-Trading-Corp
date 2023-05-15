// TotalBalanceChartPage.js

import React, { useEffect, useState } from "react";
import TotalBalanceChart from "./TotalBalanceChart";

const TotalBalanceChartPage = ({ userId }) => {
  const [lastTotalBalance, setLastTotalBalance] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [lastAssets, setLastAssets] = useState(null);
  const [lastBalanceOnly, setLastBalanceOnly] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:8080/api/totalBalanceHistory/balance/${userId}`
    );
    const data = await response.json();
    console.log(data);
    const labels = data.map((entry) =>
      new Date(entry.timestamp).toLocaleString()
    );
    const balances = data.map((entry) => entry.balance + entry.assets);
    setLastTotalBalance(balances[balances.length - 1]);
    setLastAssets(data[data.length - 1].assets);
    setLastBalanceOnly(data[data.length - 1].balance);

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
        onClick={() => {
          setShowDetails(!showDetails);
        }}
      >
        {" "}
        Total Balance: {"$" + lastTotalBalance} (Click to view/hide details)
      </h2>
      {showDetails ? (
        <div>
          <p>Stock Assets: {"$" + lastAssets}</p>
          <p>Cash Balance: {"$" + lastBalanceOnly}</p>
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
