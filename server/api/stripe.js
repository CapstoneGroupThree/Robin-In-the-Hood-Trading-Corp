const express = require("express");
const app = express();

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const {
  models: { TotalBalanceHistory },
} = require("../db");

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { price_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}`,
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
  const session_id = req.query.session_id;
  const customerId = req.user.id;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const price_id = session.line_items[0].price.id;
    const selectedPrice = prices.find((price) => price.price_id === price_id);
    const priceValue = selectedPrice.value;

    const userBalance = await TotalBalanceHistory.findOne({
      where: { userId: customerId },
      order: [["timestamp", "DESC"]],
    });
    const newBalance = userBalance.balance + priceValue;
    await TotalBalanceHistory.create({
      userId: customerId,
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
