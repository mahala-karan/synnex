// controllers/eventController.js

const EventModel = require("../models/eventModel");
const Event = EventModel.Event || EventModel;

// Controller to create an event (Restricted to Teacher, Faculty, Alumni, Admin)
const createEventController = async (req, res) => {
  try {
    const allowedRoles = ["teacher", "faculty", "alumni", "admin"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Access Denied: Only Teachers, Faculty, Alumni, and Admins can post events.",
      });
    }

    const { title, date, time, location, type, description } = req.body;
    
    let eventData = {
      title,
      date,
      time,
      location,
      type,
      description
    };

    // SAFE USER ID CHECK + CRASH PREVENTION
    let userId = req.user._id || req.user.id;
    if (userId) userId = String(userId);

    // 🔥 MAHA-MAGIC FIX: Strict 24-character hex check.
    // This prevents "master_admin_id" from crashing the database!
    if (userId && userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId)) {
        eventData.createdBy = userId;
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      exactError: error.message
    });
  }
};

// Controller to get all events
const getAllEventsController = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "firstName lastName role")
      .sort({ date: 1 }); 

    res.status(200).json({
      status: "success",
      data: { events },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Controller to delete an event (Admin super-power)
const deleteEventController = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found." });
    }

    let userId = String(req.user._id || req.user.id);

    // SECURITY CHECK: Only Admin or the original creator can delete
    if (req.user.role !== "admin" && event.createdBy && String(event.createdBy) !== userId) {
      return res.status(403).json({
        status: "fail",
        message: "Access Denied: Only Admins can delete events.",
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { 
  createEventController, 
  getAllEventsController,
  deleteEventController
};
