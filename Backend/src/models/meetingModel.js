const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  link: { type: String, required: true },
  hostRole: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;