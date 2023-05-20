const router = require("express").Router();
module.exports = router;

//Data file (to be deleted)
router.use("/data", require("./data"));
router.use("/ticker", require("./ticker"));
//Users
router.use("/users", require("./users"));
router.use("/portfolio", require("./portfolio"));
router.use("/totalBalanceHistory", require("./totalBalanceHistory"));
router.use("/transactions", require("./transactions"));
router.use("/stripe", require("./stripe"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
