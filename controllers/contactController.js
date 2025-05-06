const AppError = require("../error/AppError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { mail } = require("./sendMail");

const submitMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !phoneNumber || !subject || !message) {
      return next(new AppError("All fields are required", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s-]+$/;
    if (!phoneRegex.test(phoneNumber) || phoneNumber.length < 7) {
      return next(new AppError("Invalid phone number format", 400));
    }

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      subject.trim() === "" || // Add subject to trim check
      message.trim() === "" ||
      phoneNumber.trim() === ""
    ) {
      return next(new AppError("Fields cannot be empty", 400));
    }

    // Store the message in the database
    await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        subject, // Include subject in the data
        message,
      },
    });

    // Send confirmation email to the user
    const emailSubject = "Thank You for Contacting Us";
    const htmlContent = `
      <p>Dear ${firstName} ${lastName},</p>
      <p>Thank you for reaching out to us! We have received your message:</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p>We will get back to you as soon as possible via email (${email}) or phone (${phoneNumber}).</p>
      <p>Best regards,<br>BeepSafeAbraham Team</p>
    `;
    await mail(email, emailSubject, htmlContent);

    // Send notification email to admin
    const adminEmail = "thewordinab@gmail.com"; // Replace with your admin email
    const adminSubject = "New Contact Form Submission";
    const adminHtmlContent = `
      <p>A new message has been submitted via the contact form:</p>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;
    await mail(adminEmail, adminSubject, adminHtmlContent);

    res.status(201).json({
      message: "Message submitted successfully! We’ll get back to you soon.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { submitMessage };