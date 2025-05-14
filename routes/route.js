const express = require("express");
const router = express.Router();

//import controllers
const {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");
const { reports, getUserReports } = require("../controllers/reportController");
const { myCircle } = require("../controllers/trustedCircle");
const { emergencyBtn } = require("../controllers/emergency");
const { submitMessage } = require("../controllers/contactController");
const {
  subscribe,
  unsubscribe,
} = require("../controllers/newsletterController");
const { generateInvite } = require("../controllers/inviteController");
const { getSafeZoneMapData } = require("../controllers/safeZoneController");
const {
  getSecurityAgencies,
} = require("../controllers/securityAgencyController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/verifyEmail", verifyEmail);
router.post("/reset-password", resetPassword);
router.get("/reset-password", (req, res) => {
  const { token } = req.query;

  res.send(`
    <h3>Password Reset</h3>
    <form action="/api/reset-password" method="POST">
      <input type="hidden" name="token" value="${token}" />
      <input type="password" name="newPassword" placeholder="New password" required />
      <button type="submit">Reset Password</button>
    </form>
  `);
});

router.post("/reports", reports);
router.post("/myCircle", myCircle);
router.get("/getUserReports/:userId", getUserReports);
router.get("/logout", logout);
router.get("/emergencyBtn/:userId", emergencyBtn);
router.post("/contact", submitMessage);
router.post("/newsletter/unsubscribe", unsubscribe);
router.post("/newsletter/subscribe", subscribe);
router.post("/invite-friends", authenticateToken, generateInvite);
router.get("/safezones/map", authenticateToken, getSafeZoneMapData);
router.get("/security-agencies", authenticateToken, getSecurityAgencies);

module.exports = router;
