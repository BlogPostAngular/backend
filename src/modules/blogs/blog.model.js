const mongoose = require("mongoose");

const articleActivitySchema = new mongoose.Schema(
  {
    total_likes: { type: Number, default: 0 },
    total_comments: { type: Number, default: 0 },
    total_reads: { type: Number, default: 0 },
    total_parent_comments: { type: Number, default: 0 },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    blog_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    des: {
      type: String,
      trim: true,
      maxlength: [600, "Description cannot exceed 600 characters"],
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // supports both String and Array
    },
    banner: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [{ type: String, trim: true }],
    activity: {
      type: articleActivitySchema,
      default: () => ({}),
    },
    draft: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    published_at: {
      type: String,
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

// Auto-set blog_id from title if not provided
blogSchema.pre("save", function () {
  if (!this.blog_id && this.title) {
    this.blog_id =
      this.title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .substring(0, 60) +
      "-" +
      Date.now().toString(36).toUpperCase();
  }
  if (this.isModified("published") && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
    this.published_at = this.publishedAt.toISOString();
    this.draft = false;
  }
});

// Compound index for the most common list query: published blogs sorted by date
blogSchema.index({ published: 1, createdAt: -1 });

// Compound index for trending query: published blogs sorted by reads
blogSchema.index({ published: 1, "activity.total_reads": -1 });

// Compound index for "my blogs": filter by author + published, sorted by date
blogSchema.index({ author: 1, published: 1, createdAt: -1 });

// Compound index for category filter
blogSchema.index({ category: 1, published: 1, createdAt: -1 });

// Tags filter
blogSchema.index({ tags: 1, published: 1 });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
