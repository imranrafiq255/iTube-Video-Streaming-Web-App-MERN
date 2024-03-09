const usersModel = require("../models/Users.models");
const cloudinary = require("cloudinary");
const getDataUri = require("../config/getUri");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require("dotenv").config();
exports.addEmailInfo = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    if (!userEmail || !userPassword) {
      return res.status(404).json({
        success: false,
        message: "Enter email or password",
      });
    }
    const findExistingEmail = await usersModel.findOne({ userEmail });
    if (findExistingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is not unique, please enter unique email",
      });
    }
    const user = usersModel({ userEmail, userPassword });
    await user.save();
    const findUser = await usersModel.findOne({ userEmail });
    const token = await jwt.sign({ _id: findUser._id }, process.env.SECRET_KEY);
    const options = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 120 };
    res.cookie("token", token, options);
    return res.status(201).json({
      success: true,
      message: "Email and password are added",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addUserName = async (req, res) => {
  try {
    const { userName } = req.body;
    const file = req.file;
    if (!file || !userName) {
      return res.status(404).json({
        success: false,
        message: "Avatar and username is mandatory",
      });
    }
    const fileURI = getDataUri(file);
    const myCloudinary = await cloudinary.v2.uploader.upload(fileURI.content);
    const currentUser = req.user;
    currentUser.userAvatar.publicId = myCloudinary.public_id;
    currentUser.userAvatar.avatarUrl = myCloudinary.url;
    await currentUser.save();
    res.status(201).json({
      success: true,
      message: "Username and avatar is added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.currentUserVideos = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await usersModel.findById(userId).populate("userVideos");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.currentUserShorts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await usersModel.findById(userId).populate("userShorts");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.subscribeAndUnsubscribeChannel = async (req, res) => {
  try {
    const subscribingUserId = req.params.subscribingUserId;
    const subscribedUserId = req.params.subscribedUserId;
    if (!subscribingUserId) {
      return res.status(404).json({
        success: false,
        message: "Subscribing user id is missing",
      });
    }
    if (!subscribedUserId) {
      return res.status(404).json({
        success: false,
        message: "Subscribed user id is missing",
      });
    }
    const subscribingUser = await usersModel.findOne({
      _id: subscribingUserId,
    });
    if (!subscribingUser) {
      return res.status(404).json({
        success: false,
        message: `Subscribing user not found with id of ${subscribingUserId}`,
      });
    }
    const subscribedUser = await usersModel.findOne({ _id: subscribedUserId });
    if (!subscribedUser) {
      return res.status(404).json({
        success: false,
        message: `Subscribed user not found with id of ${subscribedUserId}`,
      });
    }
    if (subscribingUser.subscriptions.includes(subscribedUserId)) {
      const index1 = subscribingUser.subscriptions.indexOf({
        subscribedUserId,
      });
      subscribingUser.subscriptions.splice(index1);
      await subscribingUser.save();
      const index2 = subscribedUser.subscribers.indexOf({ subscribingUserId });
      subscribedUser.subscribers.splice(index2);
      await subscribedUser.save();
      return res.status(201).json({
        success: true,
        message: "You unsubscribed the channel",
      });
    }
    subscribingUser.subscriptions.push(subscribedUserId);
    await subscribingUser.save();
    subscribedUser.subscribers.push(subscribingUserId);
    await subscribedUser.save();
    return res.status(201).json({
      success: true,
      message: "You subscribed the channel",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User detail is missing",
      });
    }

    const findExistingEmail = await usersModel.findOne({
      userEmail: user.email,
    });
    if (findExistingEmail) {
      const token = await jwt.sign(
        { _id: findExistingEmail._id },
        process.env.SECRET_KEY
      );
      const options = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 120 };
      res.cookie("token", token, options);
      return res.status(201).json({
        success: true,
        message: "you've logged in successfully",
        isAuthenticated: true,
      });
    }
    const newUser = usersModel({
      userEmail: user.email,
      userName: user.name,
      userChannel: user.name,
      userAvatar: user.picture,
    });
    await newUser.save();
    const token = await jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY);
    const options = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 120 };
    res.cookie("token", token, options);
    return res.status(201).json({
      success: true,
      message: "you've logged in successfully",
      isAuthenticated: true,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
      isAuthenticated: false,
    });
  }
};

exports.loadCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "Please login first",
        authenticated: false,
      });
    }
    const user = await usersModel
      .findOne({ userEmail: req.user.userEmail })
      .populate("userShorts")
      .populate("subscribers")
      .populate({
        path: "userVideos",
        populate: {
          path: "videoUploadedBy",
          model: usersModel,
        },
      })
      .populate("likedVideos");
    return res.status(201).json({
      success: true,
      currentUser: user,
      authenticated: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      authenticated: false,
    });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await usersModel
      .findOne({ _id: id })
      .populate({
        path: "userVideos",
        populate: {
          path: "videoUploadedBy",
          model: usersModel,
        },
      })
      .populate("userShorts");
    if (user) {
      return res.status(201).json({
        success: true,
        user: user,
      });
    }
    return res.status(404).json({
      success: false,
      message: `No user found with this id: ${id}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.cookies.token) {
      res.clearCookie("token");
      return res.status(201).json({
        success: true,
        message: "You logout successfully",
      });
    }
    return res.status(404).json({
      success: false,
      messsage: "You don't have any cookie, Please login first",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.response.data.message,
    });
  }
};
