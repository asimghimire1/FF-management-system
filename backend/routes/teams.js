const express = require("express");
const {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, createTeam);
router.get("/my-teams", authMiddleware, getMyTeams);
router.get("/:teamId", getTeamById);
router.put("/:teamId", authMiddleware, updateTeam);
router.delete("/:teamId", authMiddleware, deleteTeam);

module.exports = router;
