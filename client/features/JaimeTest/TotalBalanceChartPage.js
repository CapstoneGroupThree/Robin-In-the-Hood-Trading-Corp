// TotalBalanceChartPage.js

import React, { useEffect, useState } from "react";
import TotalBalanceChart from "./TotalBalanceChart";

const TotalBalanceChartPage = (props) => {
  const [lastTotalBalance, setLastTotalBalance] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [lastAssets, setLastAssets] = useState(null);
  const [lastBalanceOnly, setLastBalanceOnly] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { userId, reload } = props;

  useEffect(() => {
    fetchData();
  }, [userId, reload]);

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
        className=" font-numbers font-semibold"
      >
        {" "}
        Total Balance: {"$" + lastTotalBalance?.toFixed(2)} (Click to view/hide
        details)
      </h2>
      {showDetails ? (
        <div>
          <p className="font-numbers">
            Stock Assets: {"$" + lastAssets?.toFixed(2)}
          </p>
          <p className="font-numbers">
            Cash Balance: {"$" + lastBalanceOnly?.toFixed(2)}
          </p>
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
