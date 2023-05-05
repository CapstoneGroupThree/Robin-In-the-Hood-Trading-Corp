const router = require("express").Router();
module.exports = router;

//Market Data Endpoints
router.use("/mde", require("./mde"));
//Reference Data Endpoints
router.use("/rde", require("./rde"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
