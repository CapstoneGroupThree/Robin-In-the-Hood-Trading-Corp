import React, { useState, useEffect } from "react";
import ClosePriceChart from "./ClosePriceChart";

const ClosePriceChartPage = (props) => {
  const [stockData, setStockData] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [isWeekend, setIsWeekend] = useState(false);
  const { ticker, page } = props;

  useEffect(() => {
    fetchHolidays();
  }, []);

  useEffect(() => {
    fetchData();
  }, [ticker, holidays]);

  const fetchHolidays = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/US`
      );

      //filter holidays because veterans day and comlumbus dont count for stock exchanges, there's only 13 so should be relatively quick
      //got market holiday info from https://www.aarp.org/money/investing/info-2023/stock-market-holidays.html#:~:text=They%20will%20close%20early%2C%20at,after%20Thanksgiving%20and%20Christmas%20Eve.
      //api using: https://date.nager.at/swagger/index.html
      const holidays = await response.json();
      const filteredHolidays = holidays
        .filter(
          (holiday) =>
            holiday.name !== "Veterans Day" && holiday.name !== "Columbus Day"
        )
        .map((holiday) => holiday.date);
      // console.log(
      //   "🚀 ~ file: index.js:102 ~ fetchHolidays ~ filteredHolidays:",
      //   filteredHolidays
      // );
      setHolidays(filteredHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  };

  const now = new Date();
  now.setHours(now.getHours() - 0);

  const fromDate = new Date();
  fromDate.setHours(fromDate.getHours() - 2);

  const getMostRecentTradingDay = (date) => {
    let dayOfWeek = date.getDay();
    let deltaDays = dayOfWeek === 0 ? 2 : 1; // if it's Sunday, go back 2 days, else go back 1 day
    date.setDate(date.getDate() - deltaDays);

    // format date to YYYY-MM-DD for comparison with holidays
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    while (
      holidays.includes(formatDate(date)) ||
      date.getDay() === 0 ||
      date.getDay() === 6
    ) {
      date.setDate(date.getDate() - 1);
    }
    return date;
  };

  const fetchData = async () => {
    let now = new Date();
    let fromDate = new Date();

    let from;
    let to;
    if (
      now.getDay() === 0 ||
      now.getDay() === 6 ||
      holidays.includes(now.toISOString().split("T")[0])
    ) {
      now = getMostRecentTradingDay(now);
      now.setHours(16, 0, 0, 0); // Set the time to 14:00
      fromDate = new Date(now.getTime());
      fromDate.setHours(fromDate.getHours() - 2);
      setIsWeekend(true);
      from = fromDate.getTime();
      to = now.getTime();
    } else {
      fromDate.setHours(fromDate.getHours() - 2);
      setIsWeekend(false);
      from = fromDate.getTime();
      to = now.getTime();
      from = from - 900000 - 1;
      to = to - 900000 - 1;
    }

    const response = await fetch(
      `http://localhost:8080/polygon/candlestick/${ticker}/1/minute/${from}/${to}`
    );
    const data = await response.json();

    const labels = data.labels;
    const closePrices = data.datasets.map((entry) => entry.close);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Close Price",
          data: closePrices,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    setStockData(chartData);
  };

  return (
    <div>
      {stockData ? (
        <ClosePriceChart
          stockData={stockData}
          page={page}
          isWeekend={isWeekend}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ClosePriceChartPage;
