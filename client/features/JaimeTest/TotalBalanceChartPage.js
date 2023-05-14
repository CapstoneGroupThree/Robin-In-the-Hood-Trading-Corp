// TotalBalanceChartPage.js

import React, { useEffect, useState } from "react";
import TotalBalanceChart from "./TotalBalanceChart";

const TotalBalanceChartPage = ({ userId }) => {
  const [balanceData, setBalanceData] = useState(null);

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
      {balanceData ? (
        <TotalBalanceChart balanceData={balanceData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TotalBalanceChartPage;
