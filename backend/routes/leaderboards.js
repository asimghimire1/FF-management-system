const express = require("express");
const {
  uploadAndProcessLeaderboard,
  getLeaderboardByMatch,
  getLeaderboardById,
  updateLeaderboard,
} = require("../controllers/leaderboardController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  upload.single("leaderboardImage"),
  uploadAndProcessLeaderboard
);
router.get("/match/:matchId", getLeaderboardByMatch);
router.get("/:leaderboardId", getLeaderboardById);
router.put("/:leaderboardId", authMiddleware, adminMiddleware, updateLeaderboard);

module.exports = router;
