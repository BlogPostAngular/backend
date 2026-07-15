const Blog = require("./blog.model");
const Category = require("../categories/category.model");
const User = require("../users/user.model");

// Track likes: { blogId: Set<userId> } — persisted in a simple likes field on Blog
// For production, use a separate Like model. Here we use Blog.likes Set pattern via an array.
const Notification = require("../notifications/notification.model");

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

// Get all blogs (pagination + filters)
const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, published, author, tag, category, trending, query } = req.query;
    const queryObj = {};

    if (published !== undefined) queryObj.published = published === "true";
    if (author) queryObj.author = author;
    if (tag) queryObj.tags = tag;
    if (category) queryObj.category = category;

    // Full-text search on title and description
    if (query) {
      queryObj.$or = [
        { title: { $regex: query, $options: "i" } },
        { des: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ];
    }

    let sort = { createdAt: -1 };
    if (trending === "true") {
      sort = { "activity.total_reads": -1 };
    }

    const [blogs, count] = await Promise.all([
      Blog.find(queryObj)
        .populate(BLOG_POPULATE)
        .sort(sort)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .lean()
        .exec(),
      Blog.countDocuments(queryObj),
    ]);

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
};

// Get all blogs authored by current user
const getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, published } = req.query;
    const query = { author: req.userId };

    if (published !== undefined) query.published = published === "true";

    const [blogs, count] = await Promise.all([
      Blog.find(query)
        .populate(BLOG_POPULATE)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .lean()
        .exec(),
      Blog.countDocuments(query),
    ]);

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
};

// Get single blog by ID or slug
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id).populate(BLOG_POPULATE);
    } else {
      blog = await Blog.findOne({ blog_id: id }).populate(BLOG_POPULATE);
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

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
};

// Create a blog
const createBlog = async (req, res) => {
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
};

// Update a blog
const updateBlog = async (req, res) => {
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
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();

    await User.findByIdAndUpdate(req.userId, {
      $pull: { blogs: blog._id },
      $inc: { "account_info.total_posts": -1 },
    });

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting blog" });
  }
};

// Seed mock blogs
const seedBlogs = async (req, res) => {
  try {
    const existing = await Blog.countDocuments();
    if (existing > 0) {
      return res.status(200).json({
        success: true,
        message: `Blogs already seeded (${existing} found). No changes made.`,
      });
    }

    const systemUser = await User.findOne();
    if (!systemUser) {
      return res.status(400).json({
        success: false,
        message: "No users found. Please register at least one user first.",
      });
    }

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
};

// Toggle like / unlike on a blog post
const toggleLikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const existingLike = await Notification.findOne({
      type: "like",
      blog: blogId,
      user: userId,
    });

    if (existingLike) {
      // Unlike
      await Notification.deleteOne({ _id: existingLike._id });
      blog.activity.total_likes = Math.max(0, blog.activity.total_likes - 1);
      await blog.save();
      return res.status(200).json({ success: true, liked: false, total_likes: blog.activity.total_likes });
    } else {
      // Like
      const likeNotif = new Notification({
        type: "like",
        blog: blogId,
        user: userId,
        notification_for: blog.author,
      });
      await likeNotif.save();
      blog.activity.total_likes += 1;
      await blog.save();
      return res.status(200).json({ success: true, liked: true, total_likes: blog.activity.total_likes });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Check if current user liked this blog
const checkLikedBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId;

    const existingLike = await Notification.findOne({
      type: "like",
      blog: blogId,
      user: userId,
    });

    res.status(200).json({ success: true, liked: !!existingLike });
  } catch (error) {
    console.error("Check liked error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getBlogs,
  getMyBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  seedBlogs,
  toggleLike: toggleLikeBlog,
  checkLiked: checkLikedBlog,
};
