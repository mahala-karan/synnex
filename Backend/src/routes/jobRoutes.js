// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  createJobController,
  getAllJobsController,
  deleteJobController, 
} = require("../controllers/jobController");

const checkAuth = require("../middlewares/checkAuth");

// Protected Routes
router.post("/create", checkAuth, createJobController);
router.get("/all", checkAuth, getAllJobsController);

// NEW: Delete Route
router.delete("/delete/:id", checkAuth, deleteJobController);

module.exports = router;