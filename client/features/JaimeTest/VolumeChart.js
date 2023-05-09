import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const VolumeChart = ({ stockData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const labels = stockData.labels;
    const volumes = stockData.datasets
      ? stockData.datasets.map((data, index) => ({ name: labels[index], volume: data && data.volume }))
      : [];

    setChartData(volumes);
  }, [stockData]);

  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="volume" stroke="#8884d8" fillOpacity={0.2} fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
