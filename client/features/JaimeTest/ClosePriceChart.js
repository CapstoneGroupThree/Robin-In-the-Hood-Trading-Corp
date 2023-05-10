import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ClosePriceChart = ({ stockData }) => {
  const [chartData, setChartData] = useState([]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <p className="label">{label}</p>
          <p className="intro">{`Price: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const labels = stockData.labels;
    const closePrices = stockData.datasets
      ? stockData.datasets[0].data.map((close, index) => ({
          name: labels[index],
          close,
        }))
      : [];

    setChartData(closePrices);
  }, [stockData]);

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            type="category"
            // this changes the time to only show hour
            tickFormatter={(tickItem) => tickItem.slice(10)}
          />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
            fill="rgba(136, 132, 216, 0.5)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClosePriceChart;
