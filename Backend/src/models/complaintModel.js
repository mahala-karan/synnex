const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "Pending" } // Admin check karega isko
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
