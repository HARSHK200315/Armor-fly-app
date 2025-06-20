const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/match", async (req, res) => {
  const { anonName } = req.body;

  const user = await User.findOne({ anonymousName: anonName });
  if (!user) return res.status(404).json({ error: "User not found" });

  const now = new Date();
  const last = user.weeklyConnectionDate || new Date(0);
  const diff = (now - last) / (1000 * 60 * 60 * 24); // in days

  if (diff < 7) {
    return res.status(403).json({ error: `You can connect again in ${Math.ceil(7 - diff)} days` });
  }

  const candidates = await User.find({
    skills: { $in: user.skills },
    personality: user.personality,
    anonymousName: { $ne: anonName },
  });

  if (candidates.length === 0) return res.status(404).json({ error: "No match found" });

  const match = candidates[Math.floor(Math.random() * candidates.length)];

  user.weeklyConnectionDate = now;
  await user.save();

  res.json({ success: true, match: match.anonymousName });
});

module.exports = router;
