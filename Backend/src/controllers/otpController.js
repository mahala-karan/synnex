const OTP = require("../models/otpModel"); 
const axios = require("axios");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("👉 STEP 1: Request received for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1. Generate 4-digit random OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Database operations: Purane OTPs delete karke naya save karo
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: generatedOtp });
    console.log("👉 STEP 2: DB work done. OTP saved in database.");

    console.log("👉 STEP 3: Sending email via Brevo API...");
    
    // 3. Brevo API Payload
    // EMAIL_USER: Tera verified Gmail jo Brevo par as a sender registered hai
    // BREVO_API_KEY: Jo tune Brevo dashboard se generate ki hai
    const emailData = {
      sender: {
        name: "Synnex Admin",
        email: process.env.EMAIL_USER 
      },
      to: [
        { email: email }
      ],
      subject: "Synnex - Registration OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Welcome to Synnex!</h2>
          <p>Verify your email to complete registration.</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${generatedOtp}</span>
          </div>
          <p style="margin-top: 20px; color: #777; font-size: 12px;">This OTP is valid for 5 minutes.</p>
        </div>
      `
    };

    // Axios configuration with API Key
    const config = {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    };

    // HTTP POST request to Brevo API
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, config);
    
    if (response.status === 201 || response.status === 200) {
      console.log("👉 STEP 4: Email sent successfully via API!");
      res.status(200).json({ success: true, message: "OTP sent successfully to your email!" });
    } else {
      throw new Error("Brevo API responded with status: " + response.status);
    }

  } catch (error) {
    // Detailed error logging for debugging
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("❌ OTP Send Error Detail:", errorMsg);
    
    res.status(500).json({ 
      message: "Failed to send OTP. Please check your email configuration.", 
      errorDetail: errorMsg 
    });
  }
};

module.exports = { sendOTP };