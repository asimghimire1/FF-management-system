const Leaderboard = require("../models/Leaderboard");
const Match = require("../models/Match");
const Team = require("../models/Team");
const { processLeaderboardImage } = require("../utils/ocr");
const { calculatePrizes, calculateTotalPoints } = require("../utils/prizeCalculator");

const uploadAndProcessLeaderboard = async (req, res) => {
  try {
    const { matchId, roundNumber } = req.body;

    if (!matchId || !req.file) {
      return res.status(400).json({ message: "Match ID and image required" });
    }

    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Process image with OCR
    const leaderboardData = await processLeaderboardImage(req.file.path);

    // Calculate prizes
    const totalAmount = match.maxTeams * match.entryFee;
    const { prizePool, platformFee, prizes } = calculatePrizes(totalAmount);

    // Add points to each entry
    const entriesWithPoints = leaderboardData.map((entry) => ({
      ...entry,
      points: calculateTotalPoints(entry.kills, entry.placement, match.maxTeams),
    }));

    // Create leaderboard document
    const leaderboard = await Leaderboard.create({
      matchId,
      roundNumber: roundNumber || 1,
      entries: entriesWithPoints,
      prizeDistribution: prizes,
      totalPrizePool: prizePool,
      platformFee,
    });

    res.status(201).json({
      message: "Leaderboard processed successfully",
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboardByMatch = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findOne({
      where: { matchId: req.params.matchId },
      order: [["createdAt", "DESC"]],
    });

    if (!leaderboard) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboardById = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findByPk(req.params.leaderboardId);

    if (!leaderboard) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaderboard = async (req, res) => {
  try {
    const { entries, roundNumber, prizeDistribution } = req.body;
    const leaderboard = await Leaderboard.findByPk(req.params.leaderboardId);

    if (!leaderboard) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }

    const updates = {};
    if (Array.isArray(entries)) {
      updates.entries = entries;
    }
    if (typeof roundNumber === "number") {
      updates.roundNumber = roundNumber;
    }
    if (prizeDistribution && typeof prizeDistribution === "object") {
      updates.prizeDistribution = prizeDistribution;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid leaderboard fields provided" });
    }

    await Leaderboard.update(updates, { where: { id: req.params.leaderboardId } });
    const updated = await Leaderboard.findByPk(req.params.leaderboardId);

    res.json({ message: "Leaderboard updated", leaderboard: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAndProcessLeaderboard,
  getLeaderboardByMatch,
  getLeaderboardById,
  updateLeaderboard,
};
