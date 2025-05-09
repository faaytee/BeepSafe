const { PrismaClient } = require("@prisma/client");
const AppError = require("../error/AppError");
const { json } = require("express");
const prisma = new PrismaClient();

const reports = async (req, res, next) => {
  try {
    const { userId, title, description, location } = req.body;

    if (!userId || !title || !description || !location) {
      return next(new AppError("all fields are required", 400));
    }
    const addReport = await prisma.report.create({
      data: {
        title,
        description,
        location,
        user: { connect: { id: userId } },
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

const getUserReports = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const reports = await prisma.report.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    if (reports.length === 0) {
      return next(AppError("no reports found for this user", 400));
    }

    res.status(200).json({
      message: "reports sucessfully retrieved",
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { reports, getUserReports };
