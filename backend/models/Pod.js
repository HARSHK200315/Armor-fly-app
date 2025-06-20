const mongoose = require("mongoose");

const podSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  skill: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pod", podSchema);
