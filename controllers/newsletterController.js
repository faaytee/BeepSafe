const AppError = require("../error/AppError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { mail } = require("./sendMail");

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    // Check if the email is already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return next(new AppError("Email is already subscribed", 400));
    }

    // Store the subscription in the database
    await prisma.newsletterSubscriber.create({
      data: {
        email,
      },
    });

    // Send confirmation email to the user
    const emailSubject = "Subscription Confirmation";
    const htmlContent = `
      <p>Thank you for subscribing to our newsletter!</p>
      <p>You will start receiving updates from BeepSafeAbraham.</p>
      <p>Best regards,<br>BeepSafeAbraham Team</p>
    `;
    await mail(email, emailSubject, htmlContent);

    res.status(201).json({
      message: "You have successfully subscribed to the newsletter.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    // Find the subscriber and remove them
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!existingSubscriber) {
      return next(new AppError("Email is not subscribed", 404));
    }

    await prisma.newsletterSubscriber.delete({
      where: { email },
    });

    // Send unsubscription confirmation email
    const emailSubject = "Unsubscription Confirmation";
    const htmlContent = `<p>You have successfully unsubscribed from our newsletter.</p>`;
    await mail(email, emailSubject, htmlContent);

    res.status(200).json({
      message: "You have successfully unsubscribed from the newsletter.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { subscribe, unsubscribe };
