require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookiesParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const router = require("./src/routes");

// 1. IMPORT CONTROLLERS & MODELS
const { saveMeetingLink, getMeetingLink } = require('./src/controllers/meetingController');
const User = require("./src/models/user"); // 🔥 Maine curly braces hata diye aur path theek kar diya 

// MODELS IMPORT
let Job, Event, News, Feedback;

try { 
    const EventModel = require("./src/models/eventModel");
    Event = EventModel.Event || EventModel; 
} catch (e) { console.log("Event model check kar bhai!"); }

try { 
    const JobModel = require("./src/models/job");
    Job = JobModel.Job || JobModel; 
} catch (e) { console.log("Job model check kar bhai!"); }

try { 
    const NewsModel = require("./src/models/newsModel");
    News = NewsModel.News || NewsModel; 
} catch (e) { console.log("News model check kar bhai!"); }

try { 
    Feedback = require("./src/models/feedbackModel"); 
} catch (e) { console.log("Feedback model abhi missing hai!"); }

// ============================================================
// 🚀 CORS CONFIGURATION
// ============================================================
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); 
    }
    next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(`${__dirname}/public`));
app.use(cookiesParser());

// MEETING ROUTES
app.post('/api/meeting', saveMeetingLink);
app.get('/api/meeting', getMeetingLink);

// ============================================================
// 🕵️‍♂️ ADMIN PANEL APIs 
// ============================================================

app.get('/api/admin/all-users', async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); 
    res.status(200).json(users);
  } catch (error) { 
    console.error("🔥 ASLI ERROR FETCHING USERS:", error.message);
    res.status(500).json({ message: "Error fetching users", asliError: error.message }); 
  }
});

app.delete('/api/admin/user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) { res.status(500).json({ message: "Failed to delete user" }); }
});

// 🔥 NAYA 1: APPROVE USER ROUTE 🔥
app.put('/api/admin/user/:id/approve', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id, 
        { isApproved: true }, 
        { new: true }
      );
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User approved successfully!", user });
    } catch (error) { 
      res.status(500).json({ message: "Failed to approve user", error: error.message }); 
    }
});

app.put('/api/admin/reset-password/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const defaultPassword = "synnex123";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        
        await User.updateOne({ _id: user._id }, { password: hashedPassword });
        res.status(200).json({ message: `Password reset successfully to: ${defaultPassword}` });
    } catch (error) {
        res.status(500).json({ message: "Failed to reset password" });
    }
});

app.get('/api/admin/all-jobs', async (req, res) => {
  try {
    if (!Job) return res.status(200).json([]); 
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) { res.status(500).json({ message: "Failed to fetch jobs" }); }
});

app.put('/api/admin/job/:id/:action', async (req, res) => {
    try {
        if (!Job) return res.status(400).json({ message: "Job model not found" });
        if (req.params.action === 'delete') {
            await Job.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Job deleted" });
        }
        res.status(400).json({ message: "Action not supported yet" });
    } catch (error) { res.status(500).json({ message: "Failed to process job action" }); }
});

app.get('/api/admin/all-events', async (req, res) => {
  try {
    if (!Event) return res.status(200).json([]);
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) { res.status(500).json({ message: "Failed to fetch events" }); }
});

app.post('/api/admin/event', async (req, res) => {
    try {
        if (!Event) return res.status(400).json({ message: "Event model not found" });
        const eventData = req.body;
        eventData.createdBy = new mongoose.Types.ObjectId("000000000000000000000000"); 
        if(!eventData.time) eventData.time = "10:00 AM"; 
        if(!eventData.type) eventData.type = "Offline";
        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) { res.status(500).json({ message: "Failed to create event" }); }
});

app.delete('/api/admin/event/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted" });
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// ============================================================
// 🔥 BULLETPROOF EVENT REGISTRATION APIs 
// ============================================================

app.post('/api/events/register/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: "User ID missing!" });

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { attendees: userId } },
            { new: true, strict: false } 
        );
        
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Registration successful!", event });
    } catch (error) {
        res.status(500).json({ message: "Failed to register" });
    }
});

app.get('/api/admin/event-attendees/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).lean();
        if (!event) return res.status(404).json({ message: "Event not found" });
        
        const attendeesArray = event.attendees || [];
        if (attendeesArray.length === 0) return res.status(200).json([]);

        const db = mongoose.connection.db;
        const queryIds = [];
        
        attendeesArray.forEach(id => {
            if (id) {
                queryIds.push(id.toString());
                if (mongoose.isValidObjectId(id.toString())) {
                    queryIds.push(new mongoose.Types.ObjectId(id.toString()));
                }
            }
        });

        const alumnisData = await db.collection('alumnis').find({ _id: { $in: queryIds } }).toArray();
        const usersData = await db.collection('users').find({ _id: { $in: queryIds } }).toArray();

        const allData = [...alumnisData, ...usersData];
        const validAttendeesList = [];
        const ghostIdsToRemove = []; 

        attendeesArray.forEach(rawId => {
            const strId = rawId.toString();
            const foundUser = allData.find(u => u._id.toString() === strId);

            if (foundUser) {
                validAttendeesList.push({
                    _id: strId,
                    firstName: foundUser.firstName || foundUser.name || "User",
                    lastName: foundUser.lastName || "",
                    email: foundUser.email || "No Email",
                    role: foundUser.role || "User"
                });
            } else {
                ghostIdsToRemove.push(rawId); 
            }
        });

        // 🔥 Backend auto-deletes the invalid "ghost" users immediately
        if (ghostIdsToRemove.length > 0) {
            await Event.findByIdAndUpdate(req.params.id, {
                $pull: { attendees: { $in: ghostIdsToRemove } }
            });
        }

        // Only valid data is returned to the frontend
        res.status(200).json(validAttendeesList); 
    } catch (error) {
        console.error("CRITICAL ERROR FETCHING:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.delete('/api/admin/event/:eventId/attendee/:userId', async (req, res) => {
    try {
        const { eventId, userId } = req.params;
        let objectId = null;
        if (mongoose.isValidObjectId(userId)) {
            objectId = new mongoose.Types.ObjectId(userId);
        }

        const event = await Event.findByIdAndUpdate(
            eventId,
            { 
                $pull: { 
                    attendees: { 
                        $in: objectId ? [userId, objectId, userId.toString()] : [userId, userId.toString()] 
                    } 
                } 
            },
            { new: true }
        );

        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "User removed from event successfully!", event });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove attendee" });
    }
});
// ============================================================

app.get('/api/admin/all-news', async (req, res) => {
    try {
        if (!News) return res.status(200).json([]);
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) { res.status(500).json({ message: "Error fetching news" }); }
});

app.post('/api/admin/news', async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const newNotice = new News({ title, content, type, createdBy: new mongoose.Types.ObjectId("000000000000000000000000") });
        await newNotice.save();
        res.status(201).json(newNotice);
    } catch (error) { res.status(500).json({ message: "Failed to publish notice" }); }
});

// 🔥 NAYA 2: DELETE NEWS ROUTE 🔥
app.delete('/api/admin/news/:id', async (req, res) => {
    try {
        if (!News) return res.status(400).json({ message: "News model not found" });
        await News.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) { 
        res.status(500).json({ message: "Error deleting notice" }); 
    }
});

app.get('/api/admin/all-feedback', async (req, res) => {
    try {
        if (!Feedback) return res.status(200).json([]);
        const feedbacks = await Feedback.find().populate("userId", "firstName lastName email");
        res.status(200).json(feedbacks);
    } catch (error) { res.status(500).json({ message: "Error fetching feedback" }); }
});

app.post('/api/admin/bulk-import', async (req, res) => {
    res.status(200).json({ message: "Import functionality ready to be implemented with Multer!" });
});

app.put('/api/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        if (!userId || !currentPassword || !newPassword) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await User.updateOne({ _id: user._id }, { password: hashedPassword });
        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/api/reset-password-direct', async (req, res) => {
    try {
        const { email, secretAnswer, newPassword } = req.body;
        if (!email || !secretAnswer || !newPassword) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found with this email" });

        const storedAnswer = user.secretAnswer || "mumbai"; 
        if (storedAnswer.toLowerCase() !== secretAnswer.toLowerCase()) return res.status(401).json({ message: "Incorrect Security Answer!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await User.updateOne({ _id: user._id }, { password: hashedPassword });
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.use("/api", router);
app.use("/", router); 

app.get("/", (req, res) => {
    res.send("Synnex Backend is up and running smoothly! 🚀");
});

const PORT = process.env.PORT || 4000;

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}
connectDB();
app.listen(PORT, function () { console.log("Server is running on port : ", PORT); });

module.exports = app;