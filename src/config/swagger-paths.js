/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Tags
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comment and reply management
 *   - name: Notifications
 *     description: User notification management
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMMENTS
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * @swagger
 * /blogs/{id}/comments:
 *   get:
 *     summary: Get comments for a blog
 *     description: Returns paginated top-level comments for a blog identified by ObjectId or slug.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ObjectId or blog_id slug
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of comments to skip (for pagination)
 *     responses:
 *       200:
 *         description: Comment list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Add a comment or reply to a blog
 *     description: |
 *       Adds a new top-level comment, or a reply to an existing comment.
 *       Set replyingTo to the parent comment ObjectId to post a reply.
 *       A notification is automatically created for the blog author (comment) or parent comment author (reply).
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ObjectId or blog_id slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCommentRequest'
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Comment text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /comments/{id}/replies:
 *   get:
 *     summary: Get replies for a comment
 *     description: Returns paginated replies for a given parent comment ObjectId.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent comment ObjectId
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of replies to skip (for pagination)
 *     responses:
 *       200:
 *         description: Reply list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 */

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: |
 *       Deletes a comment and all its children (for top-level comments).
 *       Only the comment author or the blog author can delete.
 *       Related notifications are also cleaned up automatically.
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ObjectId
 *     responses:
 *       200:
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Comment not found
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * NOTIFICATIONS
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications (paginated)
 *     description: |
 *       Returns paginated notifications for the authenticated user.
 *       Supports filtering by type (like, comment, reply, or all).
 *       Fetched notifications are automatically marked as seen.
 *       Populated fields: blog (title, blog_id), user (name, avatar), comment, reply, replied_on_comment.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [all, like, comment, reply]
 *           default: all
 *         description: Filter notifications by type
 *     responses:
 *       200:
 *         description: Notification list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/count:
 *   get:
 *     summary: Get unseen notification count
 *     description: Returns the total number of unseen notifications for the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Unseen count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/new:
 *   get:
 *     summary: Check if new notifications exist
 *     description: |
 *       Lightweight check - returns hasNew true if the user has at least one unseen notification.
 *       Use this to poll for the notification badge without fetching the full list.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: New notification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 hasNew:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOGS - additional endpoints (Like / Liked)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * @swagger
 * /blogs/{id}/like:
 *   post:
 *     summary: Toggle like or unlike on a blog
 *     description: |
 *       Likes the blog if the user has not liked it yet, or unlikes it if they have.
 *       A notification is automatically created for the blog author on like, and deleted on unlike.
 *     tags: [Blogs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ObjectId
 *     responses:
 *       200:
 *         description: Like toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 liked:
 *                   type: boolean
 *                   example: true
 *                 total_likes:
 *                   type: integer
 *                   example: 42
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /blogs/{id}/liked:
 *   get:
 *     summary: Check if the current user liked a blog
 *     description: Returns whether the authenticated user has already liked the specified blog.
 *     tags: [Blogs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ObjectId
 *     responses:
 *       200:
 *         description: Like status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 liked:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized
 */

