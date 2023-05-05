import React from "react";

export default function SingleStockView() {
  const dummyData = [
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      price: 150.0,
      high: 152.0,
      low: 148.0,
      close: 150.0,
      change: 2.15,
      marketCap: Math.random() * 3e12,
    },
  ];

  const stock = dummyData[0];

  return (
    <div>
      <h2>{stock.name}</h2>
      <div>
        <h3>{stock.symbol}</h3>
        <p>Price: ${stock.price.toFixed(2)}</p>
        <p>High: ${stock.high.toFixed(2)}</p>
        <p>Low: ${stock.low.toFixed(2)}</p>
        <p>Close: ${stock.close.toFixed(2)}</p>
      </div>
      <div>
        <button onClick={() => console.log("Buy functionality")}>Buy</button>
        <button onClick={() => console.log("Sell functionality")}>Sell</button>
        <button onClick={() => console.log("Add to watchlist functionality")}>
          Add to Watchlist
        </button>
      </div>
    </div>
  );
}
