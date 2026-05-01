// models/job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {        // 🔥 Frontend se aane wala company name
      type: String,
      required: true,
    },
    location: {       // 🔥 Frontend se aane wali location
      type: String,
    },
    type: {           // 🔥 Frontend se aane wala job type
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    applyLink: {      // 🔥 NAYA: Ye rasta khol diya apply link ke liye!
      type: String,
      required: true,
    },
    vacancy: {
      type: Number,
      default: 1,     // 🔥 'required: true' hata diya taaki crash na ho, aur default 1 set kar diya
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = { Job };