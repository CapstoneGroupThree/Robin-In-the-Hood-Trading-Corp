const express = require("express");
const app = express();

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const {
  models: { TotalBalanceHistory },
} = require("../db");

app.use(express.json());

const fetchPrices = async () => {
  try {
    const prices = await stripe.prices.list();
    return prices.data;
  } catch (error) {
    console.error("Error retrieving prices from Stripe:", error);
    return []; // Return an empty array or handle the error case as needed
  }
};

app.post("/create-checkout-session", async (req, res) => {
  const { price_id, user_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}`,
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

app.post("/success", async (req, res) => {
  const { session_id, user_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const price_id = session.line_items[0].price.id;

    // Fetch the prices from Stripe
    const prices = await fetchPrices();

    // Find the selected price based on the price_id
    const selectedPrice = prices.find((price) => price.id === price_id);

    if (!selectedPrice) {
      console.error("Selected price not found");
      return res.status(400).json({ error: "Selected price not found" });
    }

    const priceValue = selectedPrice.metadata.unit_value;

    const userBalance = await TotalBalanceHistory.findOne({
      where: { userId: user_id },
      order: [["timestamp", "DESC"]],
    });

    if (!userBalance) {
      console.error("User balance not found");
      return res.status(400).json({ error: "User balance not found" });
    }

    const newBalance = userBalance.balance + priceValue;

    await TotalBalanceHistory.create({
      userId: user_id,
      balance: newBalance,
      assets: userBalance.assets,
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = app;
