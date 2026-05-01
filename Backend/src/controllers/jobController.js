// controllers/jobController.js

// 🔥 SAFELY IMPORT MODEL (Crash-proof import)
const JobModel = require("../models/job");
const Job = JobModel.Job || JobModel;

// Controller to create a job (Restricted to Alumni and Admin)
const createJobController = async (req, res) => {
  try {
    // SECURITY CHECK: Block anyone who is not an alumni or admin
    if (req.user.role !== "alumni" && req.user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "Access Denied: Only Alumni can post jobs.",
      });
    }

    // EXTRACTION: 🔥 NAYA: 'postedBy' ko bhi yahan add kiya
    const { title, company, location, type, description, applyLink, postedBy } = req.body;
    
    // SAFE USER ID CHECK
    const createdBy = req.user._id || req.user.id; 

    // 🔥 FIX: Asli naam ensure kar rahe hain taaki blank na jaye
    const finalPostedBy = postedBy || (req.user.firstName ? `${req.user.firstName} ${req.user.lastName || ''}`.trim() : "Verified Alumni");

    // DATABASE SAVE
    const job = await Job.create({
      title,
      company,      
      location,     
      type,         
      description,
      applyLink,    
      postedBy: finalPostedBy, // 🔥 NAYA: Database mein Naam save hoga
      createdBy,
    });

    res.status(201).json({
      status: "success",
      data: {
        job,
      },
    });
  } catch (error) {
    console.error("Error during job creation:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      exactError: error.message // Debugging ke liye add kiya
    });
  }
};

// Controller to get all jobs
const getAllJobsController = async (req, res) => {
  try {
    // Added sorting so newest jobs show up first, and populated more user details
    const jobs = await Job.find()
      .populate("createdBy", "email role firstName lastName")
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      status: "success",
      data: {
        jobs,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Controller to delete a job (Admin super-power)
const deleteJobController = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ status: "fail", message: "Job not found." });
    }

    // SAFE USER ID CHECK
    const userId = req.user._id || req.user.id;

    // SECURITY CHECK: Only Admin can delete any job (or the original creator)
    if (req.user.role !== "admin" && job.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Access Denied: Only Admins can delete jobs.",
      });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      status: "success",
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createJobController,
  getAllJobsController,
  deleteJobController,
};
