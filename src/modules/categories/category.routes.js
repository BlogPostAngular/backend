const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const auth = require("../../middleware/auth");

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all non-deleted categories sorted by ordering.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Category list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/", categoryController.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Category already exists
 */
router.post("/", auth, categoryController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put("/:id", auth, categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Soft-delete a category
 *     description: Sets _deleted=true and _active=false. Does not remove from database.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete("/:id", auth, categoryController.deleteCategory);

/**
 * @swagger
 * /categories/seed:
 *   post:
 *     summary: Seed initial categories
 *     description: Insert sample categories. Skips if categories already exist.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Categories seeded
 *       200:
 *         description: Categories already exist
 */
router.post("/seed", auth, categoryController.seedCategories);

module.exports = router;
