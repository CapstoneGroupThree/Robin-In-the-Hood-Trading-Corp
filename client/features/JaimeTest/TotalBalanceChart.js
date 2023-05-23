import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TotalBalanceChart = ({ balanceData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const labels = balanceData.labels;
    const balances = balanceData.datasets
      ? balanceData.datasets[0].data.map((balance, index) => ({
          name: labels[index],
          balance,
        }))
      : [];

    setChartData(balances);
  }, [balanceData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const balance = payload[0].value.toFixed(2);
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
          <p className="intro" style={{ marginBottom: "0", color: "#000000" }}>
            {`Total Balance: $${balance}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "24.5vh",
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
            hide="true"
            dataKey="name"
            type="category"
            tickLine={false}
            tickFormatter={(tickItem) => {
              const dateStr = tickItem;
              const date = new Date(dateStr);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");

              const newDateStr = `${year}-${month}-${day}`;

              return newDateStr;
            }}
            axisLine={false}
          />
          <YAxis
            hide="true"
            domain={[
              "auto",
              Math.max(...chartData.map((data) => data.balance)) * 1.005,
            ]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="balance"
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

export default TotalBalanceChart;
