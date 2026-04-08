const Team = require("../models/Team");

const createTeam = async (req, res) => {
  try {
    const { name, players, leaderName } = req.body;

    if (!name || !leaderName) {
      return res.status(400).json({ message: "Team name and leader name required" });
    }

    const team = new Team({
      name,
      players: players || [],
      leaderName,
      createdBy: req.userId,
    });

    await team.save();
    res.status(201).json({ message: "Team created", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ createdBy: req.userId });
    res.json({ teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json({ team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, players, leaderName } = req.body;
    if (name) team.name = name;
    if (leaderName) team.leaderName = leaderName;
    if (players) team.players = players;

    await team.save();
    res.json({ message: "Team updated", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Team.findByIdAndDelete(req.params.teamId);
    res.json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
