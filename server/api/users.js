const express = require("express");
const app = express();
const {
  models: { User },
} = require("../db");
const requireToken = require("./gatekeepingMiddleware");
module.exports = app;

app.get("/", async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});
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

// Edit User Profile with Password Change
app.put("/password/:id", requireToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    // Check if the old password is correct
    const isOldPasswordValid = await user.correctPassword(req.body.oldPassword);

    if (!isOldPasswordValid) {
      // Old password is incorrect
      const err = new Error("Please input the correct previous password");
      err.status = 401;
      throw err;
    }

    // Old password is correct, so update the password and any other fields
    const updatedUser = await user.update({
      password: req.body.newPassword,
      ...req.body,
    });

    res.send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).send({ message: error.message });
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
