const express = require("express");
const {
  createMatch,
  getAllMatches,
  getMatchById,
  updateMatchStatus,
  deleteMatch,
} = require("../controllers/matchController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createMatch);
router.get("/", getAllMatches);
router.get("/:matchId", getMatchById);
router.patch("/:matchId/status", authMiddleware, adminMiddleware, updateMatchStatus);
router.delete("/:matchId", authMiddleware, adminMiddleware, deleteMatch);

module.exports = router;
