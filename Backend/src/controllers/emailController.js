const nodemailer = require("nodemailer");

const sendMailController = async (req, res) => {
  try {
    const { to, subject, message, from } = req.body;

    // 🔥 SECURITY CHECK: Kya Render ko passwords mil rahe hain?
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
        console.log("🚨 ALARM: Render Environment variables missing!");
        return res.status(500).json({ 
            status: "error", 
            message: "SMTP Credentials missing in backend.",
            errorDetails: "BREVO_SMTP_USER is undefined" 
        });
    }

    // 1. Postman Setup
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 2525, 
      secure: false, 
      auth: {
        user: process.env.BREVO_SMTP_USER, // Yahan a7c57... wala login id aayega (Render se)
        pass: process.env.BREVO_SMTP_PASS, // Yahan lamba wala password aayega (Render se)
      },
    });

    // 2. Email Format
    const mailOptions = {
      // 🔥🔥🔥 SABSE BADA FIX YAHAN HAI 🔥🔥🔥
      // Yahan hardcode karna zaroori hai tera verified email
      from: `"Synnex Portal" <sjogesh680@gmail.com>`, 
      replyTo: from, // Jisko reply milega
      to: to,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">New Message from Synnex Alumni Connect</h2>
          <p><strong>From:</strong> ${from}</p>
          <hr/>
          <p style="font-size: 16px; color: #555;">${message}</p>
          <br/>
          <p style="font-size: 12px; color: #999;">Please reply directly to this email to contact the sender.</p>
        </div>
      `,
    };

    // 3. Email bhej do
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID: ", info.messageId);

    res.status(200).json({ status: "success", message: "Email sent successfully!" });
  } catch (error) {
    console.error("🔥 Error sending email:", error);
    res.status(500).json({ 
        status: "error", 
        message: "Failed to send email.", 
        errorDetails: error.message 
    });
  }
};

module.exports = { sendMailController };