const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
  userId: String,
  name: String,
  xp: Number,
});

module.exports = mongoose.model("xps", xpSchema);
