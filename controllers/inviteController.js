const AppError = require("../error/AppError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");

const generateInvite = async (req, res, next) => {
  try {
    // Get the authenticated user from the middleware
    const { id } = req.user || {};

    // Validate id
    if (!id) {
      return next(new AppError("User ID not found in token", 401));
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Generate a unique invite code
    const rawCode = crypto.randomBytes(16).toString("hex"); // 32-character random string
    const encryptedCode = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(rawCode)
      .digest("hex"); // Encrypt the code using HMAC-SHA256

    console.log("Generated encrypted code:", encryptedCode); // Debug: Log the code
    console.log("User ID:", user.id); // Debug: Log the user ID

    // Store the invite in the database
    const invite = await prisma.invite.create({
      data: {
        code: encryptedCode,
        userId: user.id,
      },
    });

    console.log("Invite created in database:", invite); // Debug: Log the created invite

    // Generate the invite link
    const inviteLink = `https://beepsafe.com?inviteCode=${encryptedCode}`;

    // Friendly message
    const friendlyMessage =
      "Kindly click this link to know more about BeepSafe and how you can help keep your loved ones and community safe at all times.";

    res.status(200).json({
      message: "Invite link generated successfully",
      inviteLink,
      friendlyMessage,
    });
  } catch (error) {
    console.error("Error in generateInvite:", error); // Debug: Log any errors
    next(error);
  }
};

module.exports = { generateInvite };