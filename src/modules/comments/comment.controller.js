const Comment = require("./comment.model");
const Blog = require("../blogs/blog.model");
const Notification = require("../notifications/notification.model");

const COMMENT_POPULATE = {
  path: "commented_by",
  select: "personal_info.fullName personal_info.username personal_info.profile_img",
};

// GET /v1/blogs/:id/comments?skip=N
const getBlogComments = async (req, res) => {
  try {
    const { id } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const limit = 10;

    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id).select("_id");
    } else {
      blog = await Blog.findOne({ blog_id: id }).select("_id");
    }
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const [comments, total] = await Promise.all([
      Comment.find({ blog_id: blog._id, isReply: false })
        .populate(COMMENT_POPULATE)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ blog_id: blog._id, isReply: false }),
    ]);

    res.json({
      success: true,
      data: { comments, total, hasMore: skip + comments.length < total },
    });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /v1/blogs/:id/comments
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, replyingTo } = req.body;

    if (!comment?.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id).select("_id author");
    } else {
      blog = await Blog.findOne({ blog_id: id }).select("_id author");
    }
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const isReply = !!replyingTo;
    const newComment = await Comment.create({
      blog_id: blog._id,
      blog_author: blog.author,
      comment: comment.trim(),
      commented_by: req.userId,
      parent: replyingTo || null,
      isReply,
    });

    let notifiedUserId = blog.author; // default: notify the blog author

    if (isReply) {
      const parentComment = await Comment.findByIdAndUpdate(replyingTo, { $push: { children: newComment._id } });
      // For replies, notify the author of the parent comment instead
      if (parentComment) {
        notifiedUserId = parentComment.commented_by;
      }
    }

    await Blog.findByIdAndUpdate(blog._id, {
      $inc: {
        "activity.total_comments": 1,
        ...(isReply ? {} : { "activity.total_parent_comments": 1 }),
      },
    });

    // Create notification (comment or reply) — skip if user is notifying themselves
    if (req.userId !== notifiedUserId?.toString()) {
      const notifObj = {
        type: isReply ? "reply" : "comment",
        blog: blog._id,
        notification_for: notifiedUserId,
        user: req.userId,
        comment: newComment._id,
      };
      if (isReply) {
        notifObj.replied_on_comment = replyingTo;
      }
      await Notification.create(notifObj);
    }

    const populated = await newComment.populate(COMMENT_POPULATE);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /v1/comments/:id/replies?skip=N
const getReplies = async (req, res) => {
  try {
    const { id } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const limit = 5;

    const [replies, total] = await Promise.all([
      Comment.find({ parent: id, isReply: true })
        .populate(COMMENT_POPULATE)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ parent: id, isReply: true }),
    ]);

    res.json({
      success: true,
      data: { comments: replies, total, hasMore: skip + replies.length < total },
    });
  } catch (err) {
    console.error("Get replies error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /v1/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    const isOwner = comment.commented_by.toString() === req.userId;
    const blog = await Blog.findById(comment.blog_id).select("author");
    const isBlogAuthor = blog && blog.author.toString() === req.userId;

    if (!isOwner && !isBlogAuthor) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (comment.isReply && comment.parent) {
      await Comment.findByIdAndUpdate(comment.parent, { $pull: { children: comment._id } });
    }

    const decrementAmount = comment.isReply ? 1 : 1 + (comment.children?.length || 0);
    await Blog.findByIdAndUpdate(comment.blog_id, {
      $inc: {
        "activity.total_comments": -decrementAmount,
        ...(comment.isReply ? {} : { "activity.total_parent_comments": -1 }),
      },
    });

    if (!comment.isReply && comment.children?.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.children } });
      // Clean up notifications for all child replies
      await Notification.deleteMany({ comment: { $in: comment.children } });
    }
    await comment.deleteOne();

    // Clean up notifications referencing this comment
    await Notification.deleteMany({ comment: comment._id });
    // Unset reply reference on any notification that pointed to this as a reply
    await Notification.updateMany({ reply: comment._id }, { $unset: { reply: 1 } });

    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getBlogComments, addComment, getReplies, deleteComment };
