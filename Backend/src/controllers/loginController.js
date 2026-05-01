const User = require("../models/user"); // 🔥 FIX: Yahan se curly braces hata diye!
const jwt = require("jsonwebtoken");
// 🔥 NAYA: bcryptjs import kiya
const bcrypt = require("bcryptjs");

const loginController = async (req, res) => {
  try {
    let { email, password, role } = req.body;
    console.log("Login Attempt:", req.body);

    // 🔥==================================================🔥
    // 🕵️‍♂️ MASTER ADMIN BYPASS (HQ Control Panel)
    // 🔥==================================================🔥
    if (role === "admin") {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const token = jwt.sign(
          { id: "master_admin_id", role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie("jwt", token, {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
          secure: true,      
          sameSite: "none",  
        });

        return res.status(200).json({
          status: "success",
          user: {
            _id: "master_admin_id", 
            firstName: "Master",
            lastName: "Admin",
            email: email,
            role: "admin",
            isApproved: true,
          },
        });
      } else {
        return res.status(401).json({
          status: "fail",
          message: "Access Denied. Invalid HQ Credentials.",
        });
      }
    }
    // 🔥==================================================🔥

    // =======================================================
    // 🧑‍🎓 STANDARD USERS (Student, Alumni, Teacher)
    // =======================================================
    
    if (role === "faculty") role = "teacher";

    const user = await User.findOne({
      email: email,
    });

    // 1. User existence check
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found with this email",
      });
    }

    // 2. Role verification
    if (user.role !== role && !(user.role === 'faculty' && role === 'teacher')) {
        return res.status(401).json({
            status: "fail",
            message: `Account exists, but not as a ${role}. Please select the correct role.`,
        });
    }

    // 3. Approval Check
    if (user.isApproved === false) {
      return res.status(403).json({
        status: "fail",
        message: "Account not approved. Please contact the administrator for assistance.",
      });
    }

    // 4. 🔥 NAYA: Password Check using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password",
      });
    }

    // 5. Token Generation
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 6. Standard User Cookie Configuration
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,      
      sameSite: "none",  
    });

    // 7. Success Response
    res.status(200).json({
      status: "success",
      user: user, 
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
        status: "error",
        message: "Server encountered an error during login"
    });
  }
};

module.exports = loginController;