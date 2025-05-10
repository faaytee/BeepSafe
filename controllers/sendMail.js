require("dotenv").config();
const nodemailer = require("nodemailer");

const mail = async function (toEmail, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER, // Use the MAIL_USER from .env instead of hardcoding
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log(`Email sent to: ${toEmail}`);
    console.log(`Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to: ${toEmail}`, error);
    throw new Error(`Failed to send email: ${error.message}`); // Include the error message for better debugging
  }
};

module.exports = { mail };