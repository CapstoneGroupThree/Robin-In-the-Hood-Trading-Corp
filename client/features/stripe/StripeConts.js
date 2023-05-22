import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const StripeConts = () => {
  const userId = useSelector((state) => state.auth.me.id);

  const prices = [
    {
      price_id: "price_1NAaa8DwEm8QvLNJqgULlLwz",
      value: 1,
      chargeValue: "10000",
      unit_value: 10000,
      note: "Robin Mini ",
      img: "/robin/robinMiniBR.png",
    },
    {
      price_id: "price_1NAc6HDwEm8QvLNJQ9ntuy0W",
      value: 10,
      chargeValue: "100000 + 8000 Bonus",
      unit_value: 108000,
      note: "Robin Starter ",
      img: "/robin/robinStarterBR.png",
    },
    {
      price_id: "price_1NAcC5DwEm8QvLNJSuTkoQvY",
      value: 20,
      chargeValue: "200000 + 20000 Bonus",
      unit_value: 220000,
      note: "Robin Roller ",
      img: "/robin/robinRollerBR.png",
    },
    {
      price_id: "price_1NAcFDDwEm8QvLNJFzzRgm7W",
      value: 35,
      chargeValue: "350000 + 50000 Bonus",
      unit_value: 400000,
      note: "Robin Senior ",
      img: "/robin/robinSenior.jpg",
    },
    {
      price_id: "price_1NAcHfDwEm8QvLNJk2kWD156",
      value: 50,
      chargeValue: "500000 + 70000 Bonus",
      unit_value: 570000,
      note: "Robin Staff ",
      img: "/robin/robinStaff.png",
    },
    {
      price_id: "price_1NAcIfDwEm8QvLNJkqd37iE3",
      value: 100,
      chargeValue: "1000000 + 200000 Bonus",
      unit_value: 1200000,
      note: "Robin Millionaire ",
      img: "/robin/robinMillionBR.png",
    },
  ];

  const handleCheckout = async (priceId) => {
    try {
      const response = await axios.post(`/api/stripe/create-checkout-session`, {
        price_id: priceId,
        user_id: userId,
      });

      const { url } = response.data;

      // Redirect to the success URL
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const createContainers = (prices) => {
    return prices.map((eachPrice) => (
      <div
        key={eachPrice.price_id}
        className="m-2 bg-gray-900 rounded-lg shadow-lg p-6 text-white text-center relative flex flex-col justify-center items-center"
      >
        <h2 className="text-3xl font-bold mb-2">{eachPrice.note}</h2>

        <div className="flex items-center justify-center mb-2">
          <div>
            <img
              src={eachPrice.img}
              alt={eachPrice.note}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "white",
              }}
            />
          </div>
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
