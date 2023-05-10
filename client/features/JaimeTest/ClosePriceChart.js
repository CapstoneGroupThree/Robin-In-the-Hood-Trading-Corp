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
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            border: "1px solid #999999",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: "bold",
          }}
        >
          <p className="label" style={{ marginBottom: "0", color: "#999999" }}>
            {label}
          </p>
          <p
            className="intro"
            style={{ marginBottom: "0", color: "#000000" }}
          >{`Price: ${payload[0].value.toFixed(2)}`}</p>
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
    <div
      style={{
        width: "100%",
        height: "80vh",
        backgroundColor: "#15202B",
        color: "#FFFFFF",
      }}
    >
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2CD082" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2CD082" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#394B59" />
          <XAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickFormatter={(tickItem) => tickItem.slice(10)}
            axisLine={false}
          />
          <YAxis
            domain={[
              "auto",
              Math.max(...chartData.map((data) => data.close)) * 1.005,
            ]}
          />

          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#2CD082"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClosePriceChart;
