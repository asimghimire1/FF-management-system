const express = require("express");
const {
  approvePayment,
  rejectPayment,
  assignSlot,
  getMatchSlots,
} = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.patch(
  "/payments/approve",
  authMiddleware,
  adminMiddleware,
  approvePayment
);
router.patch(
  "/payments/reject",
  authMiddleware,
  adminMiddleware,
  rejectPayment
);
router.patch(
  "/slots/assign",
  authMiddleware,
  adminMiddleware,
  assignSlot
);
router.get(
  "/slots/:matchId",
  authMiddleware,
  adminMiddleware,
  getMatchSlots
);

module.exports = router;
