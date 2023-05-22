const express = require("express");
const app = express();

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const {
  models: { TotalBalanceHistory },
} = require("../db");

app.use(express.json());

// const fetchPrices = async () => {
//   try {
//     const prices = await stripe.prices.list();
//     return prices.data;
//   } catch (error) {
//     console.error("Error retrieving prices from Stripe:", error);
//     return []; // Return an empty array or handle the error case as needed
//   }
// };

app.post("/create-checkout-session", async (req, res) => {
  const { price_id, user_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:8080/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}&price_id=${price_id}`,
      cancel_url: "http://localhost:8080/cancel",
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      currency: "usd",
    });
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// app.post("/success", async (req, res) => {
//   const { session_id, user_id } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.retrieve(session_id);
//     const price_id = session.line_items[0].price.id;

//     // Fetch the prices from Stripe
//     const prices = await fetchPrices();

//     // Find the selected price based on the price_id
//     const selectedPrice = prices.find((price) => price.id === price_id);

//     if (!selectedPrice) {
//       console.error("Selected price not found");
//       return res.status(400).json({ error: "Selected price not found" });
//     }

//     const priceValue = selectedPrice.metadata.unit_value;

//     const userBalance = await TotalBalanceHistory.findOne({
//       where: { userId: user_id },
//       order: [["timestamp", "DESC"]],
//     });

//     if (!userBalance) {
//       console.error("User balance not found");
//       return res.status(400).json({ error: "User balance not found" });
//     }

//     const newBalance = userBalance.balance + priceValue;
//     const newStartingBalance = userBalance.startingBalance + priceValue;

//     await TotalBalanceHistory.create({
//       userId: user_id,
//       balance: newBalance,
//       assets: userBalance.assets,
//       startingBalance: newStartingBalance,
//     });

//     res.redirect("/");
//   } catch (error) {
//     console.error("Error retrieving session:", error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

app.get("/success", async (req, res) => {
  const { session_id, user_id, price_id } = req.query;

  try {
    // Retrieve the session using the session_id
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const prices = [
      {
        price_id: "price_1NAaa8DwEm8QvLNJqgULlLwz",
        value: 1,
        chargeValue: "10000",
        unit_value: 10000,
        note: "Robin Mini ",
      },
      {
        price_id: "price_1NAc6HDwEm8QvLNJQ9ntuy0W",
        value: 10,
        chargeValue: "100000 + 8000 Bonus",
        unit_value: 108000,
        note: "Robin Starter ",
      },
      {
        price_id: "price_1NAcC5DwEm8QvLNJSuTkoQvY",
        value: 20,
        chargeValue: "200000 + 20000 Bonus",
        unit_value: 220000,
        note: "Robin Roller ",
      },
      {
        price_id: "price_1NAcFDDwEm8QvLNJFzzRgm7W",
        value: 35,
        chargeValue: "350000 + 50000 Bonus",
        unit_value: 400000,
        note: "Robin Senior ",
      },
      {
        price_id: "price_1NAcHfDwEm8QvLNJk2kWD156",
        value: 50,
        chargeValue: "500000 + 70000 Bonus",
        unit_value: 570000,
        note: "Robin Staff ",
      },
      {
        price_id: "price_1NAcIfDwEm8QvLNJkqd37iE3",
        value: 100,
        chargeValue: "1000000 + 200000 Bonus",
        unit_value: 1200000,
        note: "Robin Millionaire ",
      },
    ];

    // Check if the payment was successful
    if (session.payment_status === "paid") {
      // Retrieve the price_id from the session

      // Fetch the prices from Stripe
      // const prices = await fetchPrices();

      // Find the selected price based on the price_id
      const selectedPrice = prices.find((price) => price.price_id === price_id);

      if (!selectedPrice) {
        console.error("Selected price not found");
        return res.status(400).json({ error: "Selected price not found" });
      }

      const priceValue = selectedPrice.unit_value;

      const userBalance = await TotalBalanceHistory.findOne({
        where: { userId: user_id },
        order: [["timestamp", "DESC"]],
      });

      if (!userBalance) {
        console.error("User balance not found");
        return res.status(400).json({ error: "User balance not found" });
      }

      // Calculate the new balance based on the initial balance and priceValue

      const newInitialBalance = userBalance.startingBalance + priceValue;
      const newBalance = userBalance.balance + priceValue;

      console.log(newInitialBalance, newBalance, priceValue);

      await TotalBalanceHistory.create({
        userId: user_id,
        balance: newBalance,
        assets: userBalance.assets,
        startingBalance: newInitialBalance, // Set the startingBalance to the initial value
      });

      res.redirect("/home");

      // res.status(200).send("Success");
    } else {
      console.error("Payment was not successful");
      alert("Payment was not successful");
      res.redirect("/home");
      return res.status(400).json({ error: "Payment was not successful" });
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = app;
