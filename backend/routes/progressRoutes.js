const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Add progress update
router.post("/update", async (req, res) => {
  const { anonName, message } = req.body;
  try {
    const user = await User.findOne({ anonymousName: anonName });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.progress.push({ message });
    user.progressPoints += 5;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add thumbs up
router.post("/thumb", async (req, res) => {
  const { anonName, index } = req.body;
  try {
    const user = await User.findOne({ anonymousName: anonName });
    if (!user || !user.progress[index]) return res.status(404).json({ error: "Progress not found" });

    user.progress[index].thumbsUp += 1;
    user.progressPoints += 2;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
