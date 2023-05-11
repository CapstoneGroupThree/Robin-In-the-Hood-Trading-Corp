// import React, { useState, useEffect } from "react";
// import ClosePriceChart from "./ClosePriceChart";

// const ClosePriceChartPage = ({ ticker }) => {
//   const [stockData, setStockData] = useState(null);
//   let multiplier = 1;
//   let timespan = "minute";
//   let from = "2023-05-09";
//   let to = "2023-05-09";
//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch(
//         `http://localhost:8080/polygon/candlestick/${ticker}/${multiplier}/${timespan}/${from}/${to}`
//       );
//       const data = await response.json();
//       console.log("Fetched data:", data);

//       const labels = data.labels;
//       const closePrices = data.datasets.map((entry) => entry.close);

//       const chartData = {
//         labels: labels,
//         datasets: [
//           {
//             label: "Close Price",
//             data: closePrices,
//             backgroundColor: "rgba(75, 192, 192, 0.2)",
//             borderColor: "rgba(75, 192, 192, 1)",
//             borderWidth: 1,
//           },
//         ],
//       };

//       setStockData(chartData);
//     };

//     fetchData();
//   }, [ticker]);

//   return (
//     <div>
//       {stockData ? (
//         <>
//           <ClosePriceChart stockData={stockData} />
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default ClosePriceChartPage;
import React, { useState, useEffect } from "react";
import ClosePriceChart from "./ClosePriceChart";

const ClosePriceChartPage = ({ ticker }) => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() - 0);

    const fromDate = new Date();
    fromDate.setHours(fromDate.getHours() - 2);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    const f = formatDate(fromDate);
    const t = formatDate(now);
    console.log(f, t);
    let f2 = new Date(f);
    let t2 = new Date(t);
    let from = f2.getTime();
    let to = t2.getTime();
    from = from - 900000 - 1;
    to = to - 900000 - 1;
    console.log(from, to);
    const fetchData = async () => {
      const multiplier = 1; // 1-minute intervals
      const timespan = "minute"; // minute-by-minute data
      // let from = 1683626400000;
      // let to = 1683646200000;
      const response = await fetch(
        `http://localhost:8080/polygon/candlestick/${ticker}/${multiplier}/${timespan}/${from}/${to}`
      );
      const data = await response.json();
      console.log("Fetched data:", data);

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

    fetchData();
  }, [ticker]);

  return (
    <div>
      {stockData ? (
        <>
          <ClosePriceChart stockData={stockData} />
        </>
      ) : (
        <p className="loader"></p>
      )}
    </div>
  );
};

export default ClosePriceChartPage;
