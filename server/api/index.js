const router = require("express").Router();
module.exports = router;

//Data file (to be deleted)
router.use("/data", require("./data"));
//Users
router.use("/users", require("./users"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
