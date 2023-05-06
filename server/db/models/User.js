const db = require("../db");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Watchlist = require("./Watchlist");
require("dotenv").config();

const SALT_ROUNDS = 10;

const User = db.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  virtual_balance: {
    type: Sequelize.DECIMAL,
    allowNull: true,
    defaultValue: 500000,
  },
});

User.prototype.correctPassword = function (candidatePwd) {
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  console.log(this.id);
  return jwt.sign({ id: this.id }, process.env.SECRET_KEY);
};

User.authenticate = async function ({ email, password }) {
  const user = await this.findOne({ where: { email } });
  if (!user || !(await user.correctPassword(password))) {
    const error = Error("Incorrect username/password");
    error.status = 401;
    throw error;
  }

  return user.generateToken();
};

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = User.findByPk(id);
    if (!user) {
      throw "nooo";
    }
    return user;
  } catch (ex) {
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};

const hashPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));
// User.hasOne(Watchlist);
module.exports = User;
