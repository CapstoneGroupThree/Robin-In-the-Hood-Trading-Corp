import React, { useState, useEffect } from 'react';
import VolumeChart from './VolumeChart';

const VolumeChartPage = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Replace with your API URL
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polygon/candlestick/${symbol}`);
      const data = await response.json();
      console.log('Fetched data:', data);

      setStockData(data);
    };

    fetchData();
  }, [symbol]);

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
