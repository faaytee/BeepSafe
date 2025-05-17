require("dotenv").config();
const nodemailer = require("nodemailer");

const mail = async function (toEmail, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "beepsafecommunity@gmail.com",
      to: toEmail,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Email sent to: ${toEmail} — Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(` Failed to send email to ${toEmail}:, error`);
    throw error; // Let the calling controller handle the error
  }
};

module.exports = { mail };
