const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const usersModel = require("../models/Users.models.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Please login first!",
      });
    }
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await usersModel.findById({ _id: decoded._id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User is not found according to the cookie token into database",
        from: "middleware",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = isAuthenticated;
