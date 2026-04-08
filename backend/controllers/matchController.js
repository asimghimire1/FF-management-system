const Match = require("../models/Match");

const createMatch = async (req, res) => {
  try {
    const { name, type, entryFee, maxTeams, rounds, startDate, endDate } = req.body;

    if (!name || !type || !entryFee) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["scrim", "tournament"].includes(type)) {
      return res.status(400).json({ message: "Invalid match type" });
    }

    let matchRounds = [];
    if (type === "tournament" && rounds && Array.isArray(rounds)) {
      matchRounds = rounds;
    } else if (type === "scrim") {
      // For scrims, create a single round
      matchRounds = [
        {
          roundNum: 1,
          teamsSlots: maxTeams || 12,
          advancingTeams: 0, // No advancement in scrims
          registrations: [],
        },
      ];
    }

    const match = new Match({
      name,
      type,
      entryFee,
      maxTeams: maxTeams || 12,
      rounds: matchRounds,
      startDate,
      endDate,
      createdBy: req.userId,
    });

    await match.save();
    res.status(201).json({ message: "Match created", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId)
      .populate("registrations")
      .populate("leaderboards");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({ match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["registration_open", "registration_closed", "ongoing", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const match = await Match.findByIdAndUpdate(
      req.params.matchId,
      { status },
      { new: true }
    );

    res.json({ message: "Match status updated", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Match.findByIdAndDelete(req.params.matchId);
    res.json({ message: "Match deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMatch,
  getAllMatches,
  getMatchById,
  updateMatchStatus,
  deleteMatch,
};
