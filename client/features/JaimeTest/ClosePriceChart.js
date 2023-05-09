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

const ClosePriceChart = ({ stockData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const labels = stockData.labels;
    const closePrices = stockData.datasets
      ? stockData.datasets[0].data.map((close, index) => ({ name: labels[index], close }))
      : [];

    setChartData(closePrices);
  }, [stockData]);

  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" type="category" tickFormatter={(tickItem) => new Date(tickItem).toLocaleDateString()} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="close" stroke="#8884d8" fill="rgba(136, 132, 216, 0.5)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClosePriceChart;
