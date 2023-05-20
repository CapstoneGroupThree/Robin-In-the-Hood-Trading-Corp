import React, { useState, useEffect } from "react";
import axios from "axios";

const StripeConts = () => {
  const prices = [
    {
      price_id: "price_1N9azfABe3nv4v5B976RvHJc",
      value: 1,
    },
    {
      price_id: "price_1N9aeBABe3nv4v5Bq5vNe64C",
      value: 10,
    },
    {
      price_id: "price_1N9bDbABe3nv4v5BntTvnk6d",
      value: 20,
    },
    {
      price_id: "price_1N9bEXABe3nv4v5BAUoepmNZ",
      value: 35,
    },
    {
      price_id: "price_1N9bFsABe3nv4v5BcS8knZfn",
      value: 50,
    },
    {
      price_id: "price_1N9bGpABe3nv4v5BbBOvnYCN",
      value: 100,
    },
  ];

  const handleCheckout = async (priceId) => {
    try {
      const response = await axios.post("/api/stripe/create-checkout-session", {
        price_id: priceId,
      });
      console.log(response.data);
      // Handle the response as needed
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const createContainers = (prices) => {
    return prices.map((eachPrice) => (
      <div key={eachPrice.price_id}>
        <h2>Robin Bucks</h2>
        <h3>Price: {eachPrice.value}</h3>
        <button onClick={() => handleCheckout(eachPrice.price_id)}>
          Click to Purchase
        </button>
      </div>
    ));
  };

  return (
    <div className="Robinbucks_containers">{createContainers(prices)}</div>
  );
};

export default StripeConts;
