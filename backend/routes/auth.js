const express = require("express");
const { signup, login, adminSignup, adminLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);

module.exports = router;
