const { PrismaClient } = require('@prisma/client');
const AppError = require('../error/AppError');
const prisma = new PrismaClient();

const getSecurityAgencies = async (req, res, next) => {
  try {
    const { state, type } = req.query;

    // Dropdown 1: Fetch list of states
    if (!state && !type) {
      const states = await prisma.securityAgency.findMany({
        distinct: ['state'],
        select: { state: true },
        orderBy: { state: 'asc' },
      });
      return res.status(200).json({
        message: 'States retrieved successfully',
        data: states.map(s => s.state),
      });
    }

    // Dropdown 2: Fetch agency types for the selected state
    if (state && !type) {
      const agencyTypes = await prisma.securityAgency.findMany({
        where: { state },
        distinct: ['type'],
        select: { type: true },
      });
      if (agencyTypes.length === 0) {
        return next(new AppError('No agencies found for this state', 404));
      }
      return res.status(200).json({
        message: 'Agency types retrieved successfully',
        data: agencyTypes.map(t => t.type),
      });
    }

    // Dropdown 3: Fetch agencies for the selected state and type
    if (state && type) {
      const agencies = await prisma.securityAgency.findMany({
        where: { state, type },
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
        orderBy: { name: 'asc' },
      });
      if (agencies.length === 0) {
        return next(new AppError('No agencies found for this state and type', 404));
      }
      return res.status(200).json({
        message: 'Agencies retrieved successfully',
        data: agencies,
      });
    }

    return next(new AppError('Invalid query parameters', 400));
  } catch (error) {
    next(error);
  }
};

module.exports = { getSecurityAgencies };