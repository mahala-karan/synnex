const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 mins auto-delete
  },
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP; // 🔥 Curly braces hata diye