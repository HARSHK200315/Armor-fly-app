const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/create", async (req, res) => {
  try {
    const { skills, personality } = req.body;
    const anonymousName = "Falcon" + Math.floor(Math.random() * 1000);
    const user = await User.create({ skills, personality, anonymousName });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
