import React, { useState, useEffect } from "react";
import VolumeChart from "./VolumeChart";

const VolumeChartPage = ({ ticker }) => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Replace with your API URL
      const response = await fetch(
        `http://localhost:8080/polygon/candlestick/${ticker}`
      );
      const data = await response.json();
      console.log("Fetched data:", data);

      setStockData(data);
    };

    fetchData();
  }, [ticker]);

  return (
    <div>
      {stockData ? (
        <>
          <VolumeChart stockData={stockData} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VolumeChartPage;
