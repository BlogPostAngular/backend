const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Whitelist the folder — ignore anything not in the allowed list
    const requestedFolder = req.query.folder || "blog_images";
    const ALLOWED_FOLDERS = ["blog_images", "avatars", "banners"];
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
};

module.exports = {
  uploadImage,
};
