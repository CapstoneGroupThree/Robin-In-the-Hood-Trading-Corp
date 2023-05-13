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

const ClosePriceChart = (props) => {
  const [chartData, setChartData] = useState([]);
  // const [holidays, setHolidays] = useState([]);
  const { stockData, page, isWeekend } = props;

  const isWidget = page === "popular";
  // const isWatchlist = page === "watchlist";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // console.log(label);
      const dateStr = label;
      const date = new Date(dateStr);

      if (isWeekend) {
        date.setTime(date.getTime() - 4 * 60 * 60 * 1000);
      } else {
        // Subtract 3 hours and 45 minutes in milliseconds
        date.setTime(date.getTime() - (3 * 60 + 45) * 60 * 1000);
      }

      // Format date back to string
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");

      const newDateStr = `${year}-${month}-${day} ${hour}:${minute}`;

      // console.log(newDateStr);
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
            {newDateStr}
          </p>
          <p
            className="intro"
            style={{ marginBottom: "0", color: "#000000" }}
          >{`Price: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const WidgetTooltip = ({ active, payload, label }) => {
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
          <p className="intro" style={{ marginBottom: "0", color: "#000000" }}>
            {`Price: $${payload[0].value.toFixed(2)}`}
          </p>
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
        width: isWidget ? "30%" : "100%",
        height: isWidget ? "10vh" : "50vh",
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
            tickFormatter={
              isWidget
                ? null
                : (tickItem) => {
                    // console.log(tickItem);
                    const dateStr = tickItem;
                    const date = new Date(dateStr);

                    if (isWeekend) {
                      date.setTime(date.getTime() - 4 * 60 * 60 * 1000);
                    } else {
                      // Subtract 3 hours and 45 minutes in milliseconds
                      date.setTime(date.getTime() - (3 * 60 + 45) * 60 * 1000);
                    }

                    const hour = String(date.getHours()).padStart(2, "0");
                    const minute = String(date.getMinutes()).padStart(2, "0");

                    const newDateStr = `${hour}:${minute}`;

                    // console.log(newDateStr);
                    return newDateStr;
                  }
            }
            axisLine={false}
            hide={isWidget} // hide the axis if it's a widget
          />
          <YAxis
            domain={[
              "auto",
              Math.max(...chartData.map((data) => data.close)) * 1.005,
            ]}
            hide={isWidget} // hide the axis if it's a widget
          />

          <Tooltip content={isWidget ? <WidgetTooltip /> : <CustomTooltip />} />
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
