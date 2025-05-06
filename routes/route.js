const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const reportController = require("../controllers/reportController");

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


module.exports = router;