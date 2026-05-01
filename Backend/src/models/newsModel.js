const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // Important, Notice, Event
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const News = mongoose.model("News", newsSchema);
module.exports = { News };