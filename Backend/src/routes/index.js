const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const loginRoute = require("./loginRoute");
const alumniListRoute = require("./alumniListRoute");
const jobRoutes = require("./jobRoutes");
const eventRoutes = require("./eventRoutes");
const newsRoutes = require("./newsRoutes"); 
const adminRoute = require("./adminRoute");
const chatRoute = require("./chatRoute");
const meetingRoutes = require("./meetingRoute");
const complaintRoutes = require("./complaintRoutes"); 

// 🔥 FIX 1: Controller ko import karna zaroori hai, warna server crash hoga!
const { sendMailController } = require("../controllers/emailController");

router.use("/register", registerRoute);
router.use("/events", eventRoutes); 
router.use("/auth", loginRoute);
router.use("/alumni", alumniListRoute);
router.use("/jobs", jobRoutes);
router.use("/news", newsRoutes);
router.use("/admin", adminRoute);
router.use("/chat", chatRoute);
router.use("/meeting", meetingRoutes);

// 🔥 FIX 2: Complaints route ko connect kiya
router.use("/complaints", complaintRoutes);

// 🔥 FIX 3: Email Route (Ab sendMailController define ho chuka hai, toh error nahi aayega)
router.post('/send-mail', sendMailController);

module.exports = router;
