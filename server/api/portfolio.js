const express = require("express");
const app = express();
const {
  models: { Portfolio, Transaction },
} = require("../db");
module.exports = app;
