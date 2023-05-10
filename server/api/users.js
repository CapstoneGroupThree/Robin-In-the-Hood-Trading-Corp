const express = require("express");
const app = express();
const {
  models: { User },
} = require("../db");
const requireToken = require("./gatekeepingMiddleware");
module.exports = app;

//GET a single user
app.get("/:id", requireToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Single User Error");
  }
});

//Edit User Profile
app.put("/:id", requireToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    await user.update(req.body);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Update User Error");
  }
});

//User wants to delete their profile
app.delete("/:id", requireToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    await user.destroy();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Delete User Error");
  }
});
