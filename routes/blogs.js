const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const auth = require("../middleware/auth");

// Seed data from frontend MOCK_ARTICLES
const SEED_BLOGS = [
  {
    blog_id: "Species-A-Flavorful-Dive-into-the-Biodiversity-BuffetlySYR0Z23fxJLWtJZ",
    title: "I am laughing 😂 Work & Daily Life Humor Memes",
    des: "😂 Work & Daily Life Humor Memes that touch on procrastination, awkward social interactions, the challenges of adulting. Lighthearted views on activities.",
    banner: "http://res.cloudinary.com/dhznzfwj5/image/upload/v1704712937/berwlhrsd",
    thumbnail: "https://images.unsplash.com/photo-1589652717406-1c69efaf1ff8?w=800",
    content: ["Welcome to the world of humor where daily life takes center stage"],
    tags: ["humor", "life", "memes"],
    activity: { total_likes: 0, total_comments: 16, total_reads: 55, total_parent_comments: 1 },
    draft: false,
    published: true,
    published_at: "2024-01-08T11:25:18.857+00:00",
    publishedAt: new Date("2024-01-08T11:25:18.857+00:00"),
    categoryName: "Programming",
  },
  {
    blog_id: "Meme-Culture-Social-Media",
    title: "Meme Culture Takes Over Social Media",
    des: "Quotes are memorable words from speeches or texts, often used for inspiration, wisdom, or to make a point.",
    banner: "http://res.cloudinary.com/dhznzfwj5/image/upload/v1704712937/berwlhrsd",
    thumbnail: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800",
    content: ["Meme culture has taken over social media..."],
    tags: ["meme", "culture", "social"],
    activity: { total_likes: 1, total_comments: 8, total_reads: 42, total_parent_comments: 0 },
    draft: false,
    published: true,
    published_at: "2024-01-08T11:25:18.857+00:00",
    publishedAt: new Date("2024-01-08T11:25:18.857+00:00"),
    categoryName: "Programming",
  },
  {
    blog_id: "Divine-Punish-Religious-Philosophy",
    title: "Devine Punish",
    des: "How a god punishes the person who blames intentionally for their selfishness.",
    banner: "http://res.cloudinary.com/dhznzfwj5/image/upload/v1704712937/berwlhrsd",
    thumbnail: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800",
    content: ["Exploring the concept of divine punishment..."],
    tags: ["philosophy", "religion", "ethics"],
    activity: { total_likes: 1, total_comments: 5, total_reads: 28, total_parent_comments: 0 },
    draft: false,
    published: true,
    published_at: "2024-07-20T10:30:00.000+00:00",
    publishedAt: new Date("2024-07-20T10:30:00.000+00:00"),
    categoryName: "Future",
  },
  {
    blog_id: "Tech-Trends-Future-Technology",
    title: "Tech Trends Shaping Our Future: A Closer Look at the Evolving...",
    des: "An in-depth analysis of emerging technologies that are revolutionizing our world, from AI to quantum computing.",
    banner: "http://res.cloudinary.com/dhznzfwj5/image/upload/v1704712937/berwlhrsd",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    content: ["Technology is evolving at an unprecedented pace..."],
    tags: ["technology", "AI", "future"],
    activity: { total_likes: 15, total_comments: 23, total_reads: 156, total_parent_comments: 5 },
    draft: false,
    published: true,
    published_at: "2025-01-09T08:00:00.000+00:00",
    publishedAt: new Date("2025-01-09T08:00:00.000+00:00"),
    categoryName: "Tech",
  },
  {
    blog_id: "Mohali-Birds-Park-Wildlife",
    title: "Mohali birds park",
    des: "Discover the amazing variety of birds at Mohali Birds Park, a sanctuary for bird lovers and nature enthusiasts.",
    banner: "http://res.cloudinary.com/dhznzfwj5/image/upload/v1704712937/berwlhrsd",
    thumbnail: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800",
    content: ["Mohali Birds Park is a haven for bird watchers..."],
    tags: ["wildlife", "birds", "nature"],
    activity: { total_likes: 8, total_comments: 12, total_reads: 89, total_parent_comments: 2 },
    draft: false,
    published: true,
    published_at: "2025-02-09T14:20:00.000+00:00",
    publishedAt: new Date("2025-02-09T14:20:00.000+00:00"),
    categoryName: "Travel",
  },
  {
    blog_id: "Culinary-Odyssey-Food-Culture",
    title: "A Culinary Odyssey: Exploring the World Through Food",
    des: "Join us on a gastronomic journey across continents as we explore diverse cuisines and their cultural significance.",
    banner: "http://res.cloudinary.com/dhznzfwj5/image/upload/v1704712937/berwlhrsd",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    content: ["Food is more than sustenance..."],
    tags: ["food", "culture", "travel"],
    activity: { total_likes: 22, total_comments: 18, total_reads: 134, total_parent_comments: 4 },
    draft: false,
    published: true,
    published_at: "2025-01-08T16:45:00.000+00:00",
    publishedAt: new Date("2025-01-08T16:45:00.000+00:00"),
    categoryName: "Food",
  },
  {
    blog_id: "Species-Biodiversity-Buffet",
    title: "Species : A Flavorful Dive into the Biodiversity Buffet",
    des: "Exploring the incredible diversity of life on Earth and why biodiversity matters for our future.",
    banner: "http://res.cloudinary.com/dhznzfwj5/image/upload/v1704712937/berwlhrsd",
    thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    content: ["Biodiversity is the foundation of ecosystem services..."],
    tags: ["biodiversity", "nature", "conservation"],
    activity: { total_likes: 12, total_comments: 9, total_reads: 67, total_parent_comments: 1 },
    draft: false,
    published: true,
    published_at: "2025-01-08T12:30:00.000+00:00",
    publishedAt: new Date("2025-01-08T12:30:00.000+00:00"),
    categoryName: "Future",
  },
];

// Helper: populate query
const BLOG_POPULATE = [
  {
    path: "author",
    select: "personal_info.fullName personal_info.username personal_info.profile_img",
  },
  { path: "category", select: "name_en name_kh status ordering _active" },
];

// @route   GET /v1/blogs
// @desc    Get all blogs (pagination + filters)
// @access  Public
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
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, published, author, tag, category, trending } = req.query;
    const query = {};

    if (published !== undefined) query.published = published === "true";
    if (author) query.author = author;
    if (tag) query.tags = tag;
    if (category) query.category = category;

    let sort = { createdAt: -1 };
    if (trending === "true") {
      sort = { "activity.total_reads": -1 };
    }

    const blogs = await Blog.find(query)
      .populate(BLOG_POPULATE)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        total: count,
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching blogs" });
  }
});

// @route   GET /v1/blogs/mine
// @desc    Get all blogs authored by the current user
// @access  Private
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
router.get("/mine", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, published } = req.query;
    const query = { author: req.userId };

    if (published !== undefined) query.published = published === "true";

    const blogs = await Blog.find(query)
      .populate(BLOG_POPULATE)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        total: count,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    console.error("Get my blogs error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching your blogs" });
  }
});

// @route   GET /v1/blogs/:id
// @desc    Get single blog by ID or blog_id slug
// @access  Public
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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let blog;

    // Try ObjectId first, then blog_id slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id).populate(BLOG_POPULATE);
    } else {
      blog = await Blog.findOne({ blog_id: id }).populate(BLOG_POPULATE);
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Increment read count atomically (prevents race conditions)
    await Blog.updateOne(
      { _id: blog._id },
      { $inc: { views: 1, "activity.total_reads": 1 } }
    );
    blog.views = (blog.views || 0) + 1;
    blog.activity.total_reads = (blog.activity.total_reads || 0) + 1;

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching blog" });
  }
});

// @route   POST /v1/blogs
// @desc    Create new blog
// @access  Private
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
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, des, tags, published, category, banner, thumbnail } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      des,
      author: req.userId,
      tags: tags || [],
      published: published || false,
      category: category || undefined,
      banner,
      thumbnail,
    });

    await blog.save();

    const User = require("../models/User");
    await User.findByIdAndUpdate(req.userId, {
      $push: { blogs: blog._id },
      $inc: { "account_info.total_posts": 1 },
    });

    const populatedBlog = await Blog.findById(blog._id).populate(BLOG_POPULATE);

    res.status(201).json({ success: true, data: populatedBlog });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ success: false, message: "Server error while creating blog" });
  }
});

// @route   PUT /v1/blogs/:id
// @desc    Update blog
// @access  Private (author only)
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
router.put("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this blog" });
    }

    const { title, content, des, tags, published, banner, thumbnail, category } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (des !== undefined) blog.des = des;
    if (banner !== undefined) blog.banner = banner;
    if (thumbnail !== undefined) blog.thumbnail = thumbnail;
    if (tags !== undefined) blog.tags = tags;
    if (category !== undefined) blog.category = category;
    if (published !== undefined) blog.published = published;

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id).populate(BLOG_POPULATE);
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ success: false, message: "Server error while updating blog" });
  }
});

// @route   DELETE /v1/blogs/:id
// @desc    Delete blog
// @access  Private (author only)
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
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();

    const User = require("../models/User");
    await User.findByIdAndUpdate(req.userId, {
      $pull: { blogs: blog._id },
      $inc: { "account_info.total_posts": -1 },
    });

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting blog" });
  }
});

// @route   POST /v1/blogs/seed
// @desc    Seed mock blog articles into DB (requires categories to be seeded first)
// @access  Public (run once)
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
router.post("/seed", auth, async (req, res) => {
  try {
    const existing = await Blog.countDocuments();
    if (existing > 0) {
      return res.status(200).json({
        success: true,
        message: `Blogs already seeded (${existing} found). No changes made.`,
      });
    }

    // Find a system user (first user in DB) to be author
    const User = require("../models/User");
    const systemUser = await User.findOne();
    if (!systemUser) {
      return res.status(400).json({
        success: false,
        message: "No users found. Please register at least one user first.",
      });
    }

    // Build category lookup map
    const categories = await Category.find();
    const catMap = {};
    categories.forEach((c) => (catMap[c.name_en] = c._id));

    const blogsToInsert = SEED_BLOGS.map(({ categoryName, ...blog }) => ({
      ...blog,
      author: systemUser._id,
      category: catMap[categoryName] || null,
    }));

    const inserted = await Blog.insertMany(blogsToInsert);

    res.status(201).json({
      success: true,
      message: `Seeded ${inserted.length} blog articles`,
    });
  } catch (error) {
    console.error("Seed blogs error:", error);
    res.status(500).json({ success: false, message: "Server error while seeding blogs" });
  }
});

module.exports = router;
