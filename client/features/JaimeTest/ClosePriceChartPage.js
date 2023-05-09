import React, { useState, useEffect } from "react";
import ClosePriceChart from "./ClosePriceChart";

const ClosePriceChartPage = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/polygon/candlestick/${symbol}`
      );
      const data = await response.json();
      console.log("Fetched data:", data);
  
      const labels = data.labels;
      const closePrices = data.datasets.map((entry) => entry.close);
  
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Close Price",
            data: closePrices,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
  
      setStockData(chartData);
    };
  
    fetchData();
  }, [symbol]);
  
  

  return (
    <div>
      {stockData ? (
        <>
          <ClosePriceChart stockData={stockData} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ClosePriceChartPage;
