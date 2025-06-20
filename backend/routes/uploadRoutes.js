const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream({ resource_type: "image" }, async (error, result) => {
      if (error) return res.status(500).json({ error });

      // Save to user progress
      const { anonName } = req.body;
      const user = await User.findOne({ anonymousName: anonName });
      if (!user) return res.status(404).json({ error: "User not found" });

      user.progress.push({ message: "📸 Image uploaded", thumbsUp: 0, image: result.secure_url });
      await user.save();

      res.json({ success: true, url: result.secure_url, user });
    });

    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
