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
      matchRounds = [
        {
          roundNum: 1,
          teamsSlots: maxTeams || 12,
          advancingTeams: 0,
          registrations: [],
        },
      ];
    }

    const match = await Match.create({
      name,
      type,
      entryFee,
      maxTeams: maxTeams || 12,
      rounds: matchRounds,
      startDate,
      endDate,
      createdBy: req.userId,
    });

    res.status(201).json({ message: "Match created", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.matchId);

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

    await Match.update(
      { status },
      { where: { id: req.params.matchId } }
    );

    const match = await Match.findByPk(req.params.matchId);
    res.json({ message: "Match status updated", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.createdBy !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Match.destroy({ where: { id: req.params.matchId } });
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

