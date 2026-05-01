const mongoose = require("mongoose");
// 🔥 1. IMPORT BCRYPTJS HERE
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["alumni", "admin", "college", "student", "teacher"], 
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false, // 🔥 CHANGED: Default is false so admin has to approve students/alumni
  },
  
  // Fields coming from the Frontend Register form
  firstName: { type: String },
  lastName: { type: String },
  startYear: { type: String },
  endYear: { type: String },
  degree: { type: String },
  branch: { type: String },
  rollNumber: { type: String },

  // 🔥 Security Question for Password Reset
  secretAnswer: {
    type: String,
    required: true,
    default: "mumbai" // Failsafe default for existing users in the DB
  }

}, { timestamps: true }); 

// =================================================================
// 🔥 2. PRE-SAVE HOOK TO HASH THE PASSWORD
// =================================================================
UserSchema.pre("save", async function (next) {
  // If password is not modified (like in a profile update), skip
  if (!this.isModified("password")) {
    return next();
  }

  // If a new password is being created, hash it
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User ;