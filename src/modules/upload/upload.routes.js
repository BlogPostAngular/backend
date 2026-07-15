const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("./upload.controller");
const auth = require("../../middleware/auth");

// Configure Multer (Memory Storage)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP, GIF) are allowed"), false);
    }
  },
});

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image
 *     description: Upload an image file to Cloudinary. Max 5MB.
 *     tags: [Upload]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *           default: blog_images
 *         description: Cloudinary folder name
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, WebP, GIF)
 *     responses:
 *       200:
 *         description: Image uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: No image provided
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Upload failed
 */
router.post("/image", auth, upload.single("image"), uploadController.uploadImage);

module.exports = router;
