const jwt = require("jsonwebtoken");
const AppError = require("../error/AppError");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Authentication token required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

module.exports = { authenticateToken };