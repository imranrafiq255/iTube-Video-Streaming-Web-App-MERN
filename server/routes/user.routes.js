const express = require("express");
const singleUpload = require("../middlewares/singleUpload");
const isAuthenticated = require("../middlewares/auth.js");

const Router = express.Router();

const {
  addEmailInfo,
  addUserName,
  currentUserVideos,
  currentUserShorts,
  login,
  loadCurrentUser,
  findUserById,
  subscribeAndUnsubscribeChannel,
  logout,
} = require("../controllers/Users.controllers");

Router.route("/emailinfo").post(addEmailInfo);
Router.route("/username").post(isAuthenticated, singleUpload, addUserName);
Router.route("/currentuservideos").get(isAuthenticated, currentUserVideos);
Router.route("/currentusershorts").get(isAuthenticated, currentUserShorts);
Router.route("/login").post(login);
Router.route("/currentuser").get(isAuthenticated, loadCurrentUser);
Router.route("/finduser/:id").get(findUserById);
Router.route("/subscribe/:subscribingUserId/:subscribedUserId").get(
  isAuthenticated,
  subscribeAndUnsubscribeChannel
);
Router.route("/logout").get(isAuthenticated, logout);
module.exports = Router;
