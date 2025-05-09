const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  verifyEmail,
  logout,
} = require("../controllers/authController");
const { reports, getUserReports } = require("../controllers/reportController");
const { myCircle } = require("../controllers/trustedCircle");
const { emergencyBtn } = require("../controllers/emergency");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verifyEmail", verifyEmail);
router.post("/reports", reports);
router.post("/myCircle", myCircle);
router.get("/getUserReports/:userId", getUserReports);
router.get("/logout", logout);
router.get("/emergencyBtn/:userId", emergencyBtn);

module.exports = router;
