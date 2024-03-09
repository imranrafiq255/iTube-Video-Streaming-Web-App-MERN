const express = require("express");
const singleUpload = require("../middlewares/multipleUploads");
const isAuthenticated = require("../middlewares/auth.js");
const Router = express.Router();
const {
  videoUpload,
  likeVideo,
  dislikeVideo,
  createComment,
  deleteComment,
  deleteVideo,
  videoViews,
  loadAllVideos,
  loadVideoAllComments,
} = require("../controllers/Videos.controllers");

Router.route("/uploadvideo").post(isAuthenticated, singleUpload, videoUpload);
Router.route("/likevideo/:id").get(isAuthenticated, likeVideo);
Router.route("/dislikevideo/:id").get(isAuthenticated, dislikeVideo);
Router.route("/createcomment/:id").post(isAuthenticated, createComment);
Router.route("/deletecomment/:videoid/:commentid").delete(
  isAuthenticated,
  deleteComment
);
Router.route("/loadvideocomments/:id").get(loadVideoAllComments);
Router.route("/deletevideo/:id").delete(isAuthenticated, deleteVideo);
Router.route("/videoviews/:id").get(isAuthenticated, videoViews);
Router.route("/allvideos").get(loadAllVideos);
module.exports = Router;
