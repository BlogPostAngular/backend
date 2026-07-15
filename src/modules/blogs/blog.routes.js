const express = require("express");
const router = express.Router();
const blogController = require("./blog.controller");
const commentController = require("../comments/comment.controller");
const auth = require("../../middleware/auth");

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve a paginated list of blogs with optional filters.
 *     tags: [Blogs]
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
 *         name: published
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author ObjectId
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ObjectId
 *       - in: query
 *         name: trending
 *         schema:
 *           type: boolean
 *         description: Sort by total reads if true
 *     responses:
 *       200:
 *         description: Blog list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogListResponse'
 *       500:
 *         description: Server error
 */
router.get("/", blogController.getBlogs);

/**
 * @swagger
 * /blogs/mine:
 *   get:
 *     summary: Get my blogs
 *     description: Retrieve all blogs authored by the authenticated user.
 *     tags: [Blogs]
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
 *           default: 20
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: User's blog list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/mine", auth, blogController.getMyBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a single blog
 *     description: Retrieve a blog by its MongoDB ObjectId or slug. Increments the read counter.
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId or blog_id slug
 *     responses:
 *       200:
 *         description: Blog detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */
router.get("/:id", blogController.getBlogById);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog post. The authenticated user becomes the author.
 *     tags: [Blogs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogRequest'
 *     responses:
 *       201:
 *         description: Blog created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, blogController.createBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     description: Update a blog post. Only the original author can update.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBlogRequest'
 *     responses:
 *       200:
 *         description: Blog updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Blog not found
 */
router.put("/:id", auth, blogController.updateBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     description: Permanently delete a blog post. Only the original author can delete.
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
 *         description: Blog deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Blog not found
 */
router.delete("/:id", auth, blogController.deleteBlog);

/**
 * @swagger
 * /blogs/seed:
 *   post:
 *     summary: Seed mock blog articles
 *     description: |
 *       Insert sample blog articles into the database.
 *       Requires at least one user and seeded categories.
 *       Skips if blogs already exist.
 *     tags: [Blogs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Blogs seeded
 *       200:
 *         description: Blogs already exist
 *       400:
 *         description: No users found
 */
router.post("/seed", auth, blogController.seedBlogs);

// Like / unlike a blog
router.post("/:id/like", auth, blogController.toggleLike);

// Check if current user liked a blog
router.get("/:id/liked", auth, blogController.checkLiked);

// Get comments for a blog
router.get("/:id/comments", commentController.getBlogComments);

// Add a comment to a blog
router.post("/:id/comments", auth, commentController.addComment);

module.exports = router;
