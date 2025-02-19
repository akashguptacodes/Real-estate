const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
  });

// Ensure uniqueness of userId & postId combination
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("SavedPost", savedPostSchema);