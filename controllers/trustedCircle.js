const AppError = require("../error/AppError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const myCircle = async (req, res, next) => {
  try {
    const { userId, firstName, lastName, phoneNumber, email } = req.body;
    if (!firstName || !lastName || !phoneNumber || !email) {
      return next(AppError("all fields are required", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    const addCircle = await prisma.trustedCircle.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        email,
        user: { connect: { id: userId } },
      },
    });
    console.log(typeof addCircle.phoneNumber);
    res.status(201).json({
      message: "circle successfully created",
      data: {
        firstName: addCircle.firstName,
        lastName: addCircle.lastName,
        email: addCircle.email,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { myCircle };
