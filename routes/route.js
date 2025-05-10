const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const reportController = require("../controllers/reportController");
const newsletterController = require("../controllers/newsletterController"); 
const contactController = require("../controllers/contactController");
const inviteController = require("../controllers/inviteController"); // Add this
const { authenticateToken } = require("../middleware/authmiddleware"); // Add this
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

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verifyEmail", authController.verifyEmail);
router.post("/reports", reportController.reports);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', (req, res) => {
    const { token } = req.query;
  
    // You can redirect to your frontend (if you have one)
    res.send(`
      <h3>Password Reset</h3>
      <form action="/api/reset-password" method="POST">
        <input type="hidden" name="token" value="${token}" />
        <input type="password" name="newPassword" placeholder="New password" required />
        <button type="submit">Reset Password</button>
      </form>
    `);
  });

  /** DO THIS FOR FRONTEND INTEGRATION
   * router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  res.redirect(`http://your-frontend.com/reset-password?token=${token}`);
});
   * 
   * 
   */
router.post("/newsletter/subscribe", newsletterController.subscribe);
router.post("/newsletter/unsubscribe", newsletterController.unsubscribe);
router.post("/contact", contactController.submitMessage);
router.post("/invite-friends", authenticateToken, inviteController.generateInvite);



module.exports = router;