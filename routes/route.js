const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { reports } = require("../controllers/reportController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/reports", reports);

module.exports = router;
