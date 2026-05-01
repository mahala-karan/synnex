// Backend/src/controllers/meetingController.js
const mongoose = require("mongoose");

// Schema update: Agenda aur Creator Name ke sath
const meetingSchema = new mongoose.Schema({
  link: String,
  time: String,
  reason: String,      // 🔥 NAYA: Meeting ka Agenda/Reason
  creatorName: String, // 🔥 NAYA: Kis Alumni ne banaya
  hostRole: String,
  createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);

// 1. Link Save Karne Ki API (Alumni/Admin)
const saveMeetingLink = async (req, res) => {
  try {
    const { link, time, reason, creatorName, role } = req.body;
    
    // 🔥 AB DELETE NAHI KARENGE! Taaki Admin dashboard me saari purani meetings ki list/history dikhe.
    // await Meeting.deleteMany({}); 
    
    const newMeeting = await Meeting.create({ link, time, reason, creatorName, hostRole: role });
    res.status(200).json({ status: "success", data: newMeeting });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// 2. Link Get Karne Ki API (Students ke liye - Hamesha Latest wali dikhegi)
const getMeetingLink = async (req, res) => {
  try {
    const meeting = await Meeting.findOne().sort({ createdAt: -1 }); // Sabse nayi (latest) wali lao
    
    res.status(200).json({ 
      status: "success", 
      link: meeting ? meeting.link : "",
      time: meeting ? meeting.time : "",
      reason: meeting ? meeting.reason : "",
      creatorName: meeting ? meeting.creatorName : ""
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// 3. Admin ke liye saari history get karne ki API (Ye aage kaam aayegi)
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: meetings });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// 4. 🔥 NAYA: Meeting Delete Karne Ki API (Admin Panel ke liye)
const deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Niche export mein deleteMeeting add kar diya hai
module.exports = { saveMeetingLink, getMeetingLink, getAllMeetings, deleteMeeting };
