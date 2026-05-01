const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
// 🔥 NAYA: otpController import karna zaroori hai
const { sendOTP } = require("../controllers/otpController"); 

// 🔥 NAYA: OTP bhejne wala rasta
router.post("/send-otp", sendOTP);

// Ye tera purana wala route hai
router.post("/user", registerController);

module.exports = router;