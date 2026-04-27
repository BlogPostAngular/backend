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
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route   POST /v1/upload/image
// @desc    Upload an image to Cloudinary
// @access  Private
router.post("/image", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Allow callers to specify a subfolder, default to blog_images
    const folder = req.query.folder || "blog_images";

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
