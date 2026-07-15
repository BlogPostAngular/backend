const express = require("express");
const router = express.Router();
const commentController = require("./comment.controller");
const auth = require("../../middleware/auth");

// GET /v1/comments/:id/replies
router.get("/:id/replies", commentController.getReplies);

// DELETE /v1/comments/:id
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;
