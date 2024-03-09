const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    userChannel: {
      type: String,
    },
    userAvatar: {
      type: String,
    },
    userVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    userShorts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Short",
      },
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);
const usersModel = mongoose.model("User", usersSchema);

module.exports = usersModel;
