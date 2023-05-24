const router = require("express").Router();
const {
  models: { User, Watchlist, TotalBalanceHistory },
} = require("../db");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    // Create a new Watchlist with the default values
    const watchlist = await Watchlist.create({
      tickers: ["HOOD", "TSLA", "AAPL"],
    });

    // Associate the Watchlist with the user
    await user.setWatchlist(watchlist);

    let balanceHistory = await TotalBalanceHistory.findAll({
      where: { userId: user.id },
      order: [["timestamp", "ASC"]],
    });

    const startingBalance = 100000;

    // If there's no balance history for this user, create an initial balance entry
    if (balanceHistory.length === 0) {
      await TotalBalanceHistory.bulkCreate([
        {
          userId: user.id,
          balance: startingBalance,
          assets: 0,
        },
        {
          userId: user.id,
          balance: startingBalance,
          assets: 0,
        },
      ]);
    }

    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.get("/me", async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});
