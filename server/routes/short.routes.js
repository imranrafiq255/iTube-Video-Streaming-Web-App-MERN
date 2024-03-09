const express = require("express");
const singleUpload = require("../middlewares/singleUpload");
const isAuthenticated = require("../middlewares/auth.js");
const {
  createShort,
  likeShort,
  dislikeShort,
  createComment,
  shortViews,
  deleteComment,
  deleteShort,
  loadAllShorts,
} = require("../controllers/Shorts.controllers");
const Router = express.Router();

Router.route("/uploadshort").post(isAuthenticated, singleUpload, createShort);
Router.route("/likeshort/:id").get(isAuthenticated, likeShort);
Router.route("/dislikeshort/:id").get(isAuthenticated, dislikeShort);
Router.route("/createcomment/:shortid").post(isAuthenticated, createComment);
Router.route("/viewshort/:id").get(isAuthenticated, shortViews);
Router.route("/deletecomment/:shortid/:commentid").delete(
  isAuthenticated,
  deleteComment
);
Router.route("/deleteshort/:id").delete(isAuthenticated, deleteShort);
Router.route("/allshorts").get(isAuthenticated, loadAllShorts);
module.exports = Router;
