import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { SMA } from "technicalindicators";

const StockData = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [showSMA, setShowSMA] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/polygon/candlestick/${symbol}`)
      .then((response) => {
        setStockData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  }, [symbol]);

  // generates a 14-day simple moving average using fetched stock data - blue line on chart
  const generateSMA = (data) => {
    const closePrices = data.map((candle) => candle.close);
    const sma = SMA.calculate({ period: 14, values: closePrices });
    return sma;
  };

  const getChartData = () => {
    const sma = generateSMA(stockData.datasets);

    const candlestickTrace = {
      x: stockData.labels,
      close: stockData.datasets.map((data) => data.close),
      high: stockData.datasets.map((data) => data.high),
      low: stockData.datasets.map((data) => data.low),
      open: stockData.datasets.map((data) => data.open),
      type: "candlestick",
      xaxis: "x",
      yaxis: "y",
    };

    const smaTrace = {
      x: stockData.labels,
      y: sma,
      type: "scatter",
      mode: "lines",
      line: { color: "blue" },
      name: "SMA (14-day)",
      xaxis: "x",
      yaxis: "y",
  };

  return showSMA ? [candlestickTrace, smaTrace] : [candlestickTrace];
};

  const chartLayout = {
    title: `${symbol} Candlestick Chart`,
    dragmode: "zoom",
    showlegend: false,
    xaxis: {
      autorange: true,
      title: "Date",
      type: "date",
    },
    yaxis: {
      autorange: true,
      type: "linear",
      title: "Price",
    },
  };

  const toggleSMA = () => {
    setShowSMA(!showSMA);
  };


  return (
    <div>
      {stockData ? (
        <>
        <button onClick={toggleSMA}>
          {showSMA ? "Hide SMA (14)" : "Show SMA (14)"}
        </button>
        <Plot data={getChartData()} layout={chartLayout} />
      </>
      ) : (
        <p>Loading stock data...</p>
      )}
    </div>
  );
};


export default StockData;
