const {
  models: { Ticker, TickerName },
} = require("../db");
const router = require("express").Router();
const { Op } = require("sequelize");

// router.get("/:symbol", async (req, res) => {
//   const { symbol } = req.params;

//   try {
//     const ticker = await Ticker.findAll({
//       where: { symbol },
//       include: [TickerName],
//     });
//     const slicedTickers = ticker.slice(0, 5);

//     if (slicedTickers.length > 0) {
//       res.json(slicedTickers);
//     } else {
//       res.status(404).json({ error: "Ticker not found" });
//     }
//   } catch (error) {
//     console.error("Error querying ticker:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    const tickers = await Ticker.findAll({
      where: {
        symbol: {
          [Op.startsWith]: symbol,
        },
      },
      include: [TickerName],
      limit: 5,
    });

    if (tickers.length > 0) {
      res.json(tickers);
    } else {
      res.status(404).json({ error: "Ticker not found" });
    }
  } catch (error) {
    console.error("Error querying ticker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
