const AppError = require("../error/AppError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { mail } = require("./sendMail");

const emergencyBtn = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    const myCircle = await prisma.trustedCircle.findMany({
      where: { userId: Number(userId) },
    });

    if (myCircle.length === 0)
      return next(AppError("there is no trusted circle found", 400));

    const subject = "Emergency alert form Beebsafe";

    for (const eachPerson of myCircle) {
      const htmlContent = `dear ${user.firstName}, this is an emergency alert from ${eachPerson.firstName}, reach out to them immediately`;
      await mail(eachPerson.email, subject, htmlContent);
    }

    res.status(201).json({
      message: "emergency alert successfully sent",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { emergencyBtn };
