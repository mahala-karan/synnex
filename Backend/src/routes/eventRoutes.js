// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const {
  createEventController,
  getAllEventsController,
  deleteEventController, 
} = require("../controllers/eventController");

const checkAuth = require("../middlewares/checkAuth");

// Apply authentication middleware to all routes below this line
router.use(checkAuth);

router.post("/create", createEventController);
router.get("/all", getAllEventsController);

// NEW: Delete Route
router.delete("/delete/:id", deleteEventController);

module.exports = router;