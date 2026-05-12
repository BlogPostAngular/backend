const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const auth = require("../middleware/auth");

// @route   POST /v1/users/register
// @desc    Register new user
// @access  Public
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account. Returns access & refresh tokens on success.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Server error
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    // Validate all required fields
    if (!username || !password || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, username, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { "personal_info.username": username },
        { "personal_info.email": email.toLowerCase() },
      ],
    });

    if (existingUser) {
      const field =
        existingUser.personal_info.username === username ? "Username" : "Email";
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // Create new user
    const user = new User({
      personal_info: {
        fullName: name,
        email: email.toLowerCase(),
        password,
        username,
        bio: "",
        profile_img: "",
      },
      social_links: {},
      account_info: { total_posts: 0, total_reads: 0 },
      google_auth: false,
      blogs: [],
    });

    await user.save();

    const access_token = generateAccessToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      data: { access_token, refresh_token, user: user.toJSON() },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      const field = error.keyPattern?.["personal_info.email"] ? "Email" : "Username";
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// @route   GET /v1/users/me
// @desc    Get current user profile
// @access  Private
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's full profile.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /v1/users/me
// @desc    Update current user profile
// @access  Private
/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     description: Update the authenticated user's personal info and social links. Cannot change password, email, or username through this endpoint.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put("/me", auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields
    if (updates.personal_info) {
      // Don't allow password update through this route
      delete updates.personal_info.password;
      delete updates.personal_info.email;
      delete updates.personal_info.username;

      Object.assign(user.personal_info, updates.personal_info);
    }

    if (updates.social_links) {
      Object.assign(user.social_links, updates.social_links);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during profile update",
    });
  }
});

module.exports = router;
