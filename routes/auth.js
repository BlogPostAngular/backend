const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");
const auth = require("../middleware/auth");

// Google auth-library — lazy require so server starts even if not yet installed
let OAuth2Client;
try {
  const lib = require("google-auth-library");
  OAuth2Client = lib.OAuth2Client;
} catch {
  console.warn("⚠️  google-auth-library not installed — /v1/auth/google disabled");
}

// @route   POST /v1/auth/login
// @desc    Login user (username OR email)
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username/email and password",
      });
    }

    const user = await User.findOne({
      $or: [
        { "personal_info.username": username },
        { "personal_info.email": username.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Prevent password login for Google-only accounts
    if (user.google_auth && !user.personal_info.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const access_token = generateAccessToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      data: { access_token, refresh_token, user: user.toJSON() },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// @route   POST /v1/auth/google
// @desc    Google Sign-In / Sign-Up (verifies Google ID token)
// @access  Public
router.post("/google", async (req, res) => {
  if (!OAuth2Client) {
    return res.status(503).json({
      success: false,
      message: "Google authentication is not configured on this server.",
    });
  }

  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Google token is required" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: "Could not retrieve email from Google" });
    }

    // Find or create user
    let user = await User.findOne({ "personal_info.email": email.toLowerCase() });

    if (user) {
      // Existing user — mark as google_auth if not already
      if (!user.google_auth) {
        user.google_auth = true;
        await user.save();
      }
    } else {
      // New user — auto-generate username from email prefix
      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      let username = baseUsername;
      let suffix = 1;
      while (await User.findOne({ "personal_info.username": username })) {
        username = `${baseUsername}${suffix++}`;
      }

      user = new User({
        personal_info: {
          fullName: name || email.split("@")[0],
          email: email.toLowerCase(),
          password: `google_${googleId}_${Date.now()}`, // random un-guessable password
          username,
          profile_img: picture || "",
        },
        google_auth: true,
      });
      await user.save();
    }

    const access_token = generateAccessToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      data: { access_token, refresh_token, user: user.toJSON() },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
});

// @route   POST /v1/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post("/refresh-token", async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    const decoded = verifyRefreshToken(refresh_token);
    const access_token = generateAccessToken(decoded.userId);
    const new_refresh_token = generateRefreshToken(decoded.userId);

    res.status(200).json({
      success: true,
      data: { access_token, refresh_token: new_refresh_token },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    const isExpired = error.message === "Refresh token expired";
    res.status(isExpired ? 401 : 402).json({
      success: false,
      message: isExpired ? "Refresh token expired" : "Invalid refresh token",
    });
  }
});

// @route   POST /v1/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", auth, async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error during logout" });
  }
});

module.exports = router;
