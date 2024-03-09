const mongoose = require("mongoose");

const schema = {
  videoTitle: {
    type: String,
    required: [true, "Video title is required"],
  },
  videoDescription: {
    type: String,
    required: [true, "Video Description is required"],
  },
  videoURL: {
    type: String,
    required: [true, "Url is required"],
  },
  videoUploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  videoLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  videoDislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  videoComments: [
    {
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      videoComment: String,
      commentTime: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  videoThumbnail: {
    type: String,
  },
  videoViews: {
    type: Number,
    default: 0,
  },
  videoDuration: {
    type: Number,
  },
};
const videosSchema = new mongoose.Schema(schema, { timestamps: true });

const videosModel = mongoose.model("Video", videosSchema);

module.exports = videosModel;
