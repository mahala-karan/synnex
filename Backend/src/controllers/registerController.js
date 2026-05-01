const  User  = require("../models/user");
const  OTP  = require("../models/otpModel"); // 🔥 NAYA: OTP model import kiya

const registerController = async (req, res) => {
  try {
    const {
      email, password, startYear, endYear,
      degree, branch, rollNumber, firstName,
      lastName, role, secretAnswer, otp // 🔥 NAYA: yahan otp receive kiya
    } = req.body;

    const userRole = role.toLowerCase();
    console.log("Processing registration for role:", userRole);

    // 1. SECURITY FIX: Block admin registration via public route
    if (userRole === "admin") {
        return res.status(403).json({
            status: "fail",
            message: "Admin registration is not allowed via this route.",
        });
    }

    // 🔥==============================================🔥
    // 2. OTP VERIFICATION LOGIC (NAYA)
    // 🔥==============================================🔥
    if (!otp) {
      return res.status(400).json({
        status: "fail",
        message: "OTP is required for registration.",
      });
    }

    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expired OTP. Please check your email and try again.",
      });
    }
    // 🔥==============================================🔥

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already registered.",
      });
    }

    // 4. CUSTOM LOGIC: Handle years and approval based on role
    let finalStartYear = startYear;
    let finalEndYear = endYear;
    let approvalStatus = false; // Default to false so Admin has to approve students/alumni

    if (userRole === "student") {
      finalEndYear = ""; // Students only need start year
    } else if (userRole === "teacher") {
      finalStartYear = ""; // Teachers don't need years
      finalEndYear = "";
      approvalStatus = true; // Auto-approve teachers
    }

    // 5. Create the unified User
    const newUser = await User.create({
      email,
      password,
      role: userRole,
      isApproved: approvalStatus, 
      firstName,
      lastName,
      startYear: finalStartYear,  
      endYear: finalEndYear,      
      degree,
      branch,
      rollNumber,
      secretAnswer: secretAnswer ? secretAnswer.toLowerCase() : "mumbai"
    });

    // 🔥 NAYA: User successfully ban gaya, ab OTP ko database se uda do
    await OTP.deleteMany({ email });

    // 6. Send Success Response (Dynamic message based on approval status)
    const successMessage = approvalStatus 
        ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully!`
        : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully! Please wait for Admin approval.`;

    res.status(201).json({
      status: "success",
      message: successMessage,
      data: { user: newUser },
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = registerController;