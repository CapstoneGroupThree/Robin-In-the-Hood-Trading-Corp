const {
  models: { Ticker, TickerName },
} = require("../db");
const router = require("express").Router();

router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    const ticker = await Ticker.findOne({
      where: { symbol },
      include: [TickerName],
    });

    if (ticker) {
      const tickerName =
        ticker.ticker_name?.name || "Ticker name not available";
      res.json({ ticker: symbol, tickerName });
    } else {
      res.status(404).json({ error: "Ticker not found" });
    }
  } catch (error) {
    console.error("Error querying ticker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
