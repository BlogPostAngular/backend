const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");

// Seed data matching frontend MOCK_CATEGORIES
const SEED_CATEGORIES = [
  { name_en: "Programming", name_kh: "កម្មវិធី", ordering: 1 },
  { name_en: "Hollywood", name_kh: "ហូលីវូដ", ordering: 2 },
  { name_en: "Food", name_kh: "អាហារ", ordering: 3 },
  { name_en: "Future", name_kh: "អនាគត", ordering: 4 },
  { name_en: "Cooking", name_kh: "ធ្វើម្ហូប", ordering: 5 },
  { name_en: "Tech", name_kh: "បច្ចេកវិទ្យា", ordering: 6 },
  { name_en: "Travel", name_kh: "ការធ្វើដំណើរ", ordering: 7 },
];

// @route   GET /v1/categories
// @desc    Get all categories
// @access  Public
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
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ _deleted: false }).sort({
      ordering: 1,
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /v1/categories/:id
// @desc    Get single category
// @access  Public
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
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /v1/categories
// @desc    Create a category
// @access  Private
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
router.post("/", auth, async (req, res) => {
  try {
    const { name_en, name_kh, ordering, status } = req.body;
    if (!name_en || !name_kh) {
      return res.status(400).json({
        success: false,
        message: "name_en and name_kh are required",
      });
    }
    const category = new Category({ name_en, name_kh, ordering, status });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exists" });
    }
    console.error("Create category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /v1/categories/:id
// @desc    Update a category
// @access  Private
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
router.put("/:id", auth, async (req, res) => {
  try {
    const { name_en, name_kh, ordering, status, _active } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name_en, name_kh, ordering, status, _active },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /v1/categories/:id
// @desc    Soft-delete a category
// @access  Private
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
router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { _deleted: true, _active: false },
      { new: true }
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /v1/categories/seed
// @desc    Seed initial categories from mock data (run once)
// @access  Public (protect in production)
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
router.post("/seed", auth, async (req, res) => {
  try {
    const existing = await Category.countDocuments();
    if (existing > 0) {
      return res.status(200).json({
        success: true,
        message: `Categories already seeded (${existing} found). No changes made.`,
      });
    }
    const inserted = await Category.insertMany(SEED_CATEGORIES);
    res.status(201).json({
      success: true,
      message: `Seeded ${inserted.length} categories`,
      data: inserted,
    });
  } catch (error) {
    console.error("Seed categories error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
