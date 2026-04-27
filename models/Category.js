const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: [true, "English name is required"],
      trim: true,
      unique: true,
    },
    name_kh: {
      type: String,
      required: [true, "Khmer name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    ordering: {
      type: Number,
      default: 0,
    },
    _active: {
      type: Boolean,
      default: true,
    },
    _deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
