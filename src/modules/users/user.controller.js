const User = require("./user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/tokenUtils");

// Register a new user
const registerUser = async (req, res) => {
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
};

// Get current user profile
const getCurrentUser = async (req, res) => {
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
};

// Update current user profile
const updateCurrentUser = async (req, res) => {
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
};

// Get public profile by username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ "personal_info.username": username })
      .select("-personal_info.password -google_auth")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const users = await User.find({
      $or: [
        { "personal_info.username": { $regex: query, $options: "i" } },
        { "personal_info.fullName": { $regex: query, $options: "i" } }
      ]
    })
      .select("personal_info.fullName personal_info.username personal_info.profile_img account_info")
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  registerUser,
  getCurrentUser,
  updateCurrentUser,
  getUserByUsername,
  searchUsers,
};
