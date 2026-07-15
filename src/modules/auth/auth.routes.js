const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const auth = require("../../middleware/auth");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate with username/email and password. Returns access & refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing fields or Google-only account
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Google Sign-In / Sign-Up
 *     description: Authenticate or create a new account using a Google ID token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleAuthRequest'
 *     responses:
 *       200:
 *         description: Google auth successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing token or email
 *       401:
 *         description: Invalid Google token
 *       503:
 *         description: Google auth not configured on server
 */
router.post("/google", authController.googleAuth);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Exchange a valid refresh token for a new access token and refresh token pair.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenRefreshResponse'
 *       400:
 *         description: Missing refresh token
 *       401:
 *         description: Refresh token expired
 *       402:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate the current session (client should discard tokens).
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", auth, authController.logout);

module.exports = router;
