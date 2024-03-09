const videosModel = require("../models/Videos.models");
const usersModel = require("../models/Users.models");
const cloudinary = require("cloudinary");
const getDataUri = require("../config/getUri");

exports.videoUpload = async (req, res) => {
  try {
    const files = req.files;
    const { videoTitle, videoDescription } = req.body;
    const images = files.filter((file) => file.mimetype.startsWith("image/"));
    const videos = files.filter((file) => file.mimetype.startsWith("video/"));

    if (videos.length !== 1 || !videoTitle || !videoDescription) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, or video is missing, or incorrect number of videos provided",
      });
    }

    let videoThumbnail = null;
    if (images.length > 0) {
      const image = images[0];
      const imageURI = getDataUri(image);
      const imageUpload = await cloudinary.v2.uploader.upload(imageURI.content);
      videoThumbnail = imageUpload.url;
    }

    const video = videos[0];
    const videoURI = getDataUri(video);
    const videoUpload = await cloudinary.v2.uploader.upload(videoURI.content, {
      resource_type: "video",
      media_metadata: true,
    });

    const videoModelData = {
      videoTitle,
      videoDescription,
      videoURL: videoUpload.url,
      videoUploadedBy: req.user._id,
      videoThumbnail: videoThumbnail,
      videoDuration: videoUpload.duration,
    };
    const savedVideo = await videosModel.create(videoModelData);

    const currentUser = await usersModel.findOne({ _id: req.user._id });
    currentUser.userVideos.push(savedVideo._id);
    await currentUser.save();

    return res.status(201).json({
      success: true,
      videoDetail: savedVideo,
    });
  } catch (error) {
    console.error("Error during video upload:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Did not find id",
      });
    }

    const video = await videosModel.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video not found with id: ${id}`,
      });
    }
    const liked = video.videoLikes.includes(userId);
    if (liked) {
      const index = video.videoLikes.indexOf({ userId });
      video.videoLikes.splice(index, 1);
      await video.save();
      return res.status(201).json({
        success: true,
        message: "You unliked the video",
      });
    }
    const disliked = video.videoDislikes.includes(userId);
    if (disliked) {
      const index = video.videoDislikes.indexOf({ userId });
      video.videoDislikes.splice(index, 1);
      await video.save();
    }
    video.videoLikes.push(userId);
    await video.save();
    return res.status(201).json({
      success: true,
      message: "You liked the video",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.dislikeVideo = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: `Did not find id`,
      });
    }
    const video = await videosModel.findById({ _id: id });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video not found with id of ${id}`,
      });
    }
    const disliked = video.videoDislikes.includes(userId);
    if (disliked) {
      const index = video.videoDislikes.indexOf({ userId });
      video.videoDislikes.splice(index, 1);
      await video.save();
      return res.status(201).json({
        success: true,
        message: "You undisliked the video",
      });
    }
    const liked = video.videoLikes.includes(userId);
    if (liked) {
      const index = video.videoLikes.indexOf({ userId });
      video.videoLikes.splice(index, 1);
      await video.save();
    }
    video.videoDislikes.push(userId);
    await video.save();
    return res.status(201).json({
      success: true,
      message: "You disliked the video",
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
    const id = req.params.id;
    const userId = req.user._id;
    const { videoComment } = req.body;
    if (!id || !videoComment) {
      return res.status(404).json({
        success: false,
        message: "Video id or comment is missing",
      });
    }
    const video = await videosModel.findById({ _id: id });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video not found with id of ${id}`,
      });
    }
    video.videoComments.push({ commentedBy: userId, videoComment });
    await video.save();
    return res.status(201).json({
      success: true,
      message: `You commented: ${
        video.videoComments[video.videoComments.length - 1].videoComment
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
    const videoId = req.params.videoid;
    const commentId = req.params.commentid;
    if (!videoId || !commentId) {
      return res.status(404).json({
        success: false,
        message: "video id or comment id is missing",
      });
    }
    const video = await videosModel.findById({ _id: videoId });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video not found with the id ${videoId}`,
      });
    }
    const commentIndex = video.videoComments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );
    if (commentIndex !== -1) {
      video.videoComments.splice(commentIndex, 1);
      await video.save();
      return res.status(201).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loadVideoAllComments = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Id is missing",
      });
    }
    const video = await videosModel
      .findOne({ _id: id })
      .populate("videoComments.commentedBy")
      .populate("videoUploadedBy");
    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video not exists with id of ${id} in database`,
      });
    }
    return res.status(201).json({
      success: true,
      videoComments: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    if (!videoId) {
      return res.status(404).json({
        success: false,
        message: "Video id not found",
      });
    }
    await videosModel.findByIdAndDelete({ _id: videoId });
    const user = await usersModel.findById({ _id: req.user._id });
    const video = user.userVideos.includes(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video does not exist in user videos list with id of ${videoId}`,
      });
    }
    const index = user.userVideos.findIndex((id) => id === videoId);
    user.userVideos.splice(index, 1);
    await user.save();
    return res.status(201).json({
      success: true,
      message: `Video has been deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.videoViews = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await videosModel.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video not found with id: ${videoId}`,
      });
    }
    video.videoViews += 1;
    await video.save();
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

exports.loadAllVideos = async (req, res) => {
  try {
    const allVideos = await videosModel.find().populate({
      path: "videoUploadedBy",
      populate: {
        path: "userVideos",
        model: usersModel,
      },
    });
    if (allVideos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "There is no video in the database",
      });
    }
    return res.status(201).json({
      success: true,
      videos: allVideos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
