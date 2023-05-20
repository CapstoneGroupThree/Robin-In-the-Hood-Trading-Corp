const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

app.post("/create-checkout-session", async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_API_KEY);
  const price_id = req.body.price_id;
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:8080/",
      cancel_url: "http://localhost:8080/cancel",
      line_items: [{ price: price_id, quantity: 1 }],
      payment_method_types: ["card"],
      mode: "payment",
    });
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = app;
