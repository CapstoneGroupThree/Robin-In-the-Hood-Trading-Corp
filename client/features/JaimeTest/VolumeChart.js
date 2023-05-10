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

const VolumeChart = ({ stockData }) => {
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
          <p className="label">{label.slice(0, 10)}</p>
          <p className="intro">{`Volume: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const labels = stockData.labels;
    const volumes = stockData.datasets
      ? stockData.datasets.map((data, index) => ({
          name: labels[index],
          volume: data && data.volume,
        }))
      : [];

    setChartData(volumes);
  }, [stockData]);

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickFormatter={(tick) => {
              return tick.length > 10 ? `${tick.substring(0, 10)}` : tick;
            }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#8884d8"
            fillOpacity={0.2}
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
