const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const auth = require("../../middleware/auth");

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
router.post("/register", userController.registerUser);

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
router.get("/me", auth, userController.getCurrentUser);

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
router.put("/me", auth, userController.updateCurrentUser);

router.get("/", userController.searchUsers);
router.get("/:username", userController.getUserByUsername);

module.exports = router;
