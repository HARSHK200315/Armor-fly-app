const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  skills: [String],
  personality: String,
  podId: String,
  progressPoints: { type: Number, default: 0 },
  anonymousName: String,
  weeklyConnectionDate: Date,
  progress: [{
    message: String,
    thumbsUp: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("User", userSchema);
