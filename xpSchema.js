const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
  userId: String,
  name: String,
  xp: Number,
  level: Number,
});

module.exports = mongoose.model("xps", xpSchema);
