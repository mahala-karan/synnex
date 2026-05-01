const express = require("express");
const router = express.Router();
const { User } = require("../models/user"); 
const Feedback = require("../models/feedbackModel");

// 🔥 NAYA: Complaint Model ko import kiya
const Complaint = require("../models/complaintModel");

// 🔥 APPROVE USER API 🔥
router.put("/user/:userId/approve", async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: `${updatedUser.firstName} has been approved!`,
      user: updatedUser 
    });

  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Failed to approve user" });
  }
});

// 🔥 Saara Feedback Get Karne Ki API Admin Ke Liye 🔥
router.get("/all-feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 }); 

    res.status(200).json({ data: feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

// 🔥 NAYA: Saari Complaints Get Karne Ki API Admin Ke Liye 🔥
router.get("/all-complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("raisedBy", "firstName lastName email") // Jisne complaint ki uski detail aayegi
      .sort({ createdAt: -1 }); // Latest complaint sabse upar

    res.status(200).json({ data: complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// 🔥 Bulletproof Feedback Save Karne Ki API 🔥
router.post("/submit-feedback", async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    // Safely data prepare kar rahe hain (taaki crash na ho)
    let feedbackData = { message: message };
    
    // Sirf tabhi userId save karenge jab wo sahi format mein ho (24 letters ki MongoDB ID)
    if (userId && typeof userId === 'string' && userId.length === 24) {
        feedbackData.userId = userId;
    }

    // Naya feedback save kar rahe hain
    const newFeedback = await Feedback.create(feedbackData);
    
    res.status(200).json({ success: true, message: "Feedback saved", data: newFeedback });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ 
      message: "Failed to submit feedback",
      exactError: error.message 
    });
  }
});

// ========================================================
// 🔥 NAYI APIs: COMPLAINT KO RESOLVE AUR DELETE KARNE KI 🔥
// ========================================================

// 🔥 MARK COMPLAINT AS SOLVED 🔥
router.put("/complaint/:id/resolve", async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedComplaint });
  } catch (error) {
    console.error("Resolve error:", error);
    res.status(500).json({ message: "Failed to resolve complaint" });
  }
});

// 🔥 DELETE COMPLAINT 🔥
router.delete("/complaint/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete complaint" });
  }
});

module.exports = router;
