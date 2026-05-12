const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const auth = require("../middleware/auth");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Allowed Cloudinary folders — prevents users from uploading to arbitrary paths
const ALLOWED_FOLDERS = ["blog_images", "avatars", "banners"];

// @route   POST /v1/upload/image
// @desc    Upload an image to Cloudinary
// @access  Private
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
router.post("/image", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Whitelist the folder — ignore anything not in the allowed list
    const requestedFolder = req.query.folder || "blog_images";
    const folder = ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : "blog_images";

    // Upload to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ success: false, message: "Image upload failed" });
        }
        res.status(200).json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Write file buffer to the stream
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload",
    });
  }
});

module.exports = router;
