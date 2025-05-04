const { PrismaClient } = require("@prisma/client");
const AppError = require("../error/AppError");
const { json } = require("express");
const prisma = new PrismaClient();

const reports = async (req, res, next) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return next(new AppError("all fields are required", 400));
    }
    const addReport = await prisma.report.create({
      data: {
        title,
        description,
        location,
      },
    });

    res.status(201).json({
      message: "report saved successfully",
      user: {
        title: addReport.title,
        description: addReport.description,
        location: addReport.location,
        createdAt: addReport.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { reports };
