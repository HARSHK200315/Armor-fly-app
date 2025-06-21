const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { onlineUsers } = require("../server");

router.post("/match", async (req, res) => {
  try {
    const { anonName } = req.body;
    console.log("🔍 Match request from:", anonName);

    const user = await User.findOne({ anonymousName: anonName });
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const last = user.weeklyConnectionDate || new Date(0);
    const diff = (now - last) / (1000 * 60 * 60 * 24);

    if (diff < 7) {
      return res.status(403).json({ error: `You can connect again in ${Math.ceil(7 - diff)} days` });
    }

    const candidates = await User.find({
      skills: { $in: user.skills },
      personality: user.personality,
      anonymousName: { $ne: anonName },
    });

    // Filter only online users
    const { onlineUsers } = require("../server");
    const onlineMatches = candidates.filter((u) =>
      onlineUsers.has(u.anonymousName)
    );

    if (onlineMatches.length === 0)
      return res.status(404).json({ error: "No online match found" });

    const match = onlineMatches[Math.floor(Math.random() * onlineMatches.length)];

    user.weeklyConnectionDate = now;
    await user.save();

    res.json({ success: true, match: match.anonymousName });

  } catch (err) {
    console.error("❌ /match route error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
