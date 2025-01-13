const nodemailer = require("nodemailer");

const admin_otp_email = async (recipientEmail, subject, emailContent) => {
  
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.smtp_email,
        pass: process.env.smtp_pass,
      },
    });

    const data = {
        from: process.env.smtp_email,
        to: recipientEmail,
        subject:subject,
        html: emailContent,
      }
      
    await transporter.sendMail(data);

  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = admin_otp_email;
