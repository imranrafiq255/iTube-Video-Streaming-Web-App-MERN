const shortsModel = require("../models/Shorts.models");
const usersModel = require("../models/Users.models");
const cloudinary = require("cloudinary");
const getUri = require("../config/getUri.js");

exports.createShort = async (req, res) => {
  try {
    const { videoTitle, videoDescription } = req.body;
    const file = req.file;
    if (!videoTitle || !videoDescription) {
      return res.status(400).json({
        success: false,
        message: "Short title, short description, or short video is missing",
      });
    }
    const shortURI = getUri(file);
    const shortUpload = await cloudinary.v2.uploader.upload(shortURI.content, {
      resource_type: "video",
      media_metadata: true,
    });

    const shortURL = shortUpload.secure_url;

    const shortModelData = {
      shortTitle: videoTitle,
      shortDescription: videoDescription,
      shortURL: shortURL, // Use the secure_url
      shortUploadedBy: req.user._id,
      shortDuration: shortUpload.duration,
    };
    const savedShort = await shortsModel.create(shortModelData);

    const currentUser = await usersModel.findOne({ _id: req.user._id });
    currentUser.userShorts.push(savedShort._id);
    await currentUser.save();

    return res.status(201).json({
      success: true,
      shortDetail: savedShort,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likeShort = async (req, res) => {
  try {
    const id = req.params.id;
    const short = await shortsModel.findById(id);
    if (!short) {
      return res.status(404).json({
        success: false,
        message: `Short not found with id of ${id}`,
      });
    }
    const liked = short.shortLikes.includes(req.user._id);
    if (liked) {
      const index = short.shortLikes.findIndex((id) => id == req.user._id);
      short.shortLikes.splice(index, 1);
      await short.save();
      return res.status(201).json({
        success: true,
        message: "You unliked the short",
      });
    }
    const disliked = short.shortDislikes.includes(req.user._id);
    if (disliked) {
      const index = short.shortDislikes.findIndex((id) => id == req.user._id);
      short.shortDislikes.splice(index, 1);
      await short.save();
    }
    short.shortLikes.push(req.user._id);
    await short.save();
    return res.status(201).json({
      success: true,
      message: "You liked the short",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.dislikeShort = async (req, res) => {
  try {
    const id = req.params.id;
    const short = await shortsModel.findById(id);
    if (!short) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    const disliked = short.shortDislikes.includes(req.user._id);
    if (disliked) {
      const index = short.shortDislikes.findIndex((id) => id == req.user._id);
      short.shortDislikes.splice(index, 1);
      await short.save();
      return res.status(201).json({
        success: true,
        message: "You undisliked the short",
      });
    }
    const liked = short.shortLikes.includes(req.user._id);
    if (liked) {
      const index = short.shortLikes.findIndex((id) => id == req.user._id);
      short.shortLikes.splice(index, 1);
      await short.save();
    }
    short.shortDislikes.push(req.user._id);
    await short.save();
    return res.status(201).json({
      success: true,
      message: "You disliked the short",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const shortId = req.params.shortid;
    const short = await shortsModel.findById(shortId);
    if (!short) {
      return res.status(404).json({
        success: false,
        messsage: `Short not found`,
      });
    }
    const { shortComment } = req.body;
    if (!shortComment) {
      return res.status(404).json({
        success: false,
        message: "Comment is missing for this short",
      });
    }
    short.shortComments.push({ commentedBy: req.user._id, shortComment });
    await short.save();
    return res.status(201).json({
      success: true,
      message: `Your short comment is: ${
        short.shortComments[short.shortComments.length - 1].shortComment
      }`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const shortId = req.params.shortid;
    const commentId = req.params.commentid;
    if (!shortId || !commentId) {
      return res.status(404).json({
        success: false,
        message: "Short id or comment id is missing",
      });
    }
    const short = await shortsModel.findById(shortId);
    if (!short) {
      return res.status(404).json({
        success: false,
        message: `Short not found with id of ${shortId}`,
      });
    }
    const index = short.shortComments.findIndex(
      (comment) => comment._id == commentId
    );
    if (index !== -1) {
      short.shortComments.splice(index, 1);
      await short.save();
      return res.status(201).json({
        success: true,
        message: `Short's Comment is deleted successfully`,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Comment not found with id of ${commentId}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteShort = async (req, res) => {
  try {
    const id = req.params.id;
    const short = await shortsModel.findById(id);
    if (!short) {
      return res.status(404).json({
        success: false,
        message: "Short not found",
      });
    }
    const user = await usersModel.findById(req.user._id);
    const userShort = user.userShorts.includes(short._id);
    if (userShort) {
      const index = user.userShorts.findIndex((id) => id == id);
      user.userShorts.splice(index, 1);
      await user.save();
    }
    await shortsModel.findByIdAndDelete(id);
    return res.status(201).json({
      success: false,
      message: "Short is deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.shortViews = async (req, res) => {
  try {
    const id = req.params.id;
    const short = await shortsModel.findById(id);
    if (!short) {
      return res.status(404).json({
        success: false,
        message: "Short not found",
      });
    }
    short.shortViews += 1;
    await short.save();
    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loadAllShorts = async (req, res) => {
  try {
    const allShorts = await shortsModel.find().populate({
      path: "shortUploadedBy",
      populate: {
        path: "userShorts",
        model: usersModel,
      },
    });
    if (allShorts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "There is not short in the database",
      });
    }
    return res.status(201).json({
      success: true,
      data: allShorts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
