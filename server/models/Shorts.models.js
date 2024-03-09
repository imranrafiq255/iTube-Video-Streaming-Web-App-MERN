const mongoose = require("mongoose");

const shortsSchema = new mongoose.Schema(
  {
    shortTitle: {
      type: String,
      required: [true, "Short title is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
    },
    shortURL: {
      type: String,
      required: [true, "Short url is mandatory"],
    },
    shortUploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shortLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shortDislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shortViews: {
      type: Number,
      default: 0,
    },
    shortDuration: {
      type: Number,
    },
  },
  { timestamps: true }
);

const shortsModel = mongoose.model("Short", shortsSchema);

module.exports = shortsModel;
