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
      from: "beepsafecommunity@gmail.com",
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log(`email sent to: ${toEmail}`);
    console.log(`message id: ${info.messageId} `);
  } catch (error) {
    console.error(`error sending email to: ${toEmail}`, error);
    throw new Error(`failed to send email`);
  }
};
module.exports = { mail };
