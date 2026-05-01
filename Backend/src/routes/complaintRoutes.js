const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaintModel");
const checkAuth = require("../middlewares/checkAuth");

// 🔥 User Complaint Submit Karega
router.post("/submit", checkAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    // SAFE ID FETCH
    const userId = req.user._id || req.user.id;

    const newComplaint = await Complaint.create({
      subject,
      message,
      raisedBy: userId
    });

    res.status(200).json({ success: true, data: newComplaint });
  } catch (error) {
    console.error("Complaint Error:", error);
    res.status(500).json({ success: false, message: "Failed to submit complaint" });
  }
});

// 🔥 Admin ke dekhne ke liye saari complaints
router.get("/all", checkAuth, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("raisedBy", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch complaints" });
  }
});

// ============================================
// 🔥 NAYI APIs: USER TRACKER KE LIYE 🔥
// ============================================

// 🔥 1. User ki sirf apni complaints fetch karna
router.get("/my-complaints", checkAuth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    // Sirf wahi complaint dhundho jo is user ne banayi hai
    const complaints = await Complaint.find({ raisedBy: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch your complaints" });
  }
});

// 🔥 2. User apni complaint delete kar sake
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete complaint" });
  }
});

module.exports = router;
