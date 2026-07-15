const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    blog_author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    commented_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: { createdAt: "commentedAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Comment", commentSchema);
