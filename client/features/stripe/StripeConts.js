import React, { useState, useEffect } from "react";
import axios from "axios";

const StripeConts = () => {
  const prices = [
    {
      price_id: "price_1N9azfABe3nv4v5B976RvHJc",
      value: 1,
      chargeValue: "10000",
      note: "Robin Mini",
    },
    {
      price_id: "price_1N9aeBABe3nv4v5Bq5vNe64C",
      value: 10,
      chargeValue: "100000 + 8000 Bonus",
      note: "Robin Starter",
    },
    {
      price_id: "price_1N9bDbABe3nv4v5BntTvnk6d",
      value: 20,
      chargeValue: "200000 + 20000 Bonus",
      note: "Robin Roller",
    },
    {
      price_id: "price_1N9bEXABe3nv4v5BAUoepmNZ",
      value: 35,
      chargeValue: "350000 + 50000 Bonus",
      note: "Robin Senior ",
    },
    {
      price_id: "price_1N9bFsABe3nv4v5BcS8knZfn",
      value: 50,
      chargeValue: "500000 + 70000 Bonus",
      note: "Robin Staff ",
    },
    {
      price_id: "price_1N9bGpABe3nv4v5BbBOvnYCN",
      value: 100,
      chargeValue: "1000000 + 200000 Bonus",
      note: "Robin Millionaire",
    },
  ];

  const handleCheckout = async (priceId) => {
    try {
      const response = await axios.post(
        `/api/stripe/create-checkout-session?${priceId}`,
        {
          price_id: priceId,
        }
      );
      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const createContainers = (prices) => {
    return prices.map((eachPrice) => (
      <div
        key={eachPrice.price_id}
        className="m-2 bg-gray-900 rounded-lg shadow-lg p-6 text-white text-center relative flex flex-col justify-center items-center"
      >
        <h2 className="text-3xl font-bold mb-4">{eachPrice.note}</h2>

        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center">
            <span className="text-2xl font-bold">${eachPrice.value}</span>
          </div>
        </div>

        <h3 className="text-2xl mb-4">
          <i className="fa-solid fa-coins"></i> {eachPrice.chargeValue}
        </h3>

        <button
          onClick={() => handleCheckout(eachPrice.price_id)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
        >
          Click to Purchase
        </button>
      </div>
    ));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-8 home-bg justify-center">
      {createContainers(prices)}
    </div>
  );
};

export default StripeConts;
