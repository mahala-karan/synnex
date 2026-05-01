const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  // NEW: Time field added
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  // NEW: Type field added (Online / Offline)
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure your User model is named exactly "User"
    required: true,
  },
}, { timestamps: true }); // timestamps: true se createdAt aur updatedAt automatically save honge!

const Event = mongoose.model("Event", eventSchema);

// FIXED EXPORT: Ab tera controller bina kisi error ke isko import kar payega
module.exports = { Event };