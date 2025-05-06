const express = require("express");
const router = express.Router();
const { signup, login, verifyEmail } = require("../controllers/authController");
const { reports } = require("../controllers/reportController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verifyEmail", verifyEmail);
router.post("/reports", reports);

module.exports = router;
