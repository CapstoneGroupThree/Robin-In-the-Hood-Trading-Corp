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
        <div className="custom-tooltip">
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
    <div style={{ width: "100%", height: 500, backgroundColor: "#15202B" }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{
            top: 30,
            right: 50,
            left: 20,
            bottom: 30,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e80a89" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f9af57" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ stroke: "#f9af57", strokeWidth: 0.5 }}
            tickFormatter={(tick) => {
              return tick.length > 10 ? `${tick.substring(0, 10)}` : tick;
            }}
          />
          <YAxis tick={{ stroke: "#f9af57", strokeWidth: 0.5 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              color: "#f9af57",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#e80a89"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <style jsx="true">{`
        .custom-tooltip {
          background-color: #000;
          padding: 10px;
          border-radius: 5px;
          font-size: 12px;
        }
        .custom-tooltip .label {
          color: #f9af57;
          margin: 0;
          font-size: 14px;
          font-weight: bold;
        }
        .custom-tooltip .intro {
          color: #fff;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default VolumeChart;
