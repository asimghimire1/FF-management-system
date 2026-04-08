const express = require("express");
const {
  registerForMatch,
  getRegistrationsByMatch,
  getMyRegistrations,
} = require("../controllers/registrationController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, registerForMatch);
router.get("/match/:matchId", authMiddleware, adminMiddleware, getRegistrationsByMatch);
router.get("/my-registrations", authMiddleware, getMyRegistrations);

module.exports = router;
