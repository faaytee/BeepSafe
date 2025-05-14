const { PrismaClient } = require("@prisma/client");
const AppError = require("../error/AppError");
const prisma = new PrismaClient();

const getSafeZoneMapData = async (req, res, next) => {
  try {
    const { id: userId } = req.user || {};
    const { latitude, longitude, days = 30 } = req.query; // Allow frontend to specify time window and user location

    if (!userId) {
      return next(new AppError("User ID not found in token", 401));
    }

    // Validate user location if provided
    if (latitude && (latitude < -90 || latitude > 90)) {
      return next(new AppError("Latitude must be between -90 and 90", 400));
    }
    if (longitude && (longitude < -180 || longitude > 180)) {
      return next(new AppError("Longitude must be between -180 and 180", 400));
    }

    // Fetch recent reports (default: last 30 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - Number(days));

    const reports = await prisma.report.findMany({
      where: {
        createdAt: { gte: recentDate },
        latitude: { not: null },
        longitude: { not: null },
      },
      orderBy: { createdAt: "desc" },
    });

    // Define unsafe zones based on reports
    const unsafeZones = reports.map(report => ({
      latitude: report.latitude,
      longitude: report.longitude,
      radius: 200, // Default radius for an unsafe zone (200 meters)
      title: report.title,
      description: report.description,
      createdAt: report.createdAt,
    }));

    // Define safe zones (simplified: areas far from incidents)
    let safeZones = [];
    if (unsafeZones.length === 0) {
      // If no incidents, mark a default area as safe (e.g., center of Lagos, Nigeria)
      safeZones = [
        {
          latitude: 6.5244,
          longitude: 3.3792,
          radius: 500,
          title: "Safe Area",
          description: "No recent incidents reported",
        },
      ];
    } else {
      // Find a safe area by offsetting the average coordinates of unsafe zones
      const avgLatitude = unsafeZones.reduce((sum, zone) => sum + zone.latitude, 0) / unsafeZones.length;
      const avgLongitude = unsafeZones.reduce((sum, zone) => sum + zone.longitude, 0) / unsafeZones.length;
      safeZones = [
        {
          latitude: avgLatitude + 0.05, // ~5.5km north
          longitude: avgLongitude + 0.05, // ~5.5km east
          radius: 500,
          title: "Safe Area",
          description: "No recent incidents reported nearby",
        },
      ];
    }

    // Check if the user is in a safe or unsafe zone (if location provided)
    let userStatus = null;
    if (latitude && longitude) {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371000; // Earth's radius in meters
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
      };

      // Check unsafe zones
      let isInUnsafeZone = false;
      let nearestUnsafeZone = null;
      for (const zone of unsafeZones) {
        const distance = calculateDistance(latitude, longitude, zone.latitude, zone.longitude);
        if (distance <= zone.radius) {
          isInUnsafeZone = true;
          nearestUnsafeZone = zone;
          break;
        }
      }

      // Check safe zones
      let isInSafeZone = false;
      let nearestSafeZone = null;
      for (const zone of safeZones) {
        const distance = calculateDistance(latitude, longitude, zone.latitude, zone.longitude);
        if (distance <= zone.radius) {
          isInSafeZone = true;
          nearestSafeZone = zone;
          break;
        }
      }

      userStatus = {
        isInSafeZone,
        isInUnsafeZone,
        nearestSafeZone,
        nearestUnsafeZone,
      };
    }

    res.status(200).json({
      message: "SafeZone map data retrieved successfully",
      data: {
        unsafeZones,
        safeZones,
        userStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSafeZoneMapData };