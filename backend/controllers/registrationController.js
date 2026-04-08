const Registration = require("../models/Registration");
const Payment = require("../models/Payment");
const Match = require("../models/Match");
const { getNextAvailableSlot } = require("../utils/slotAssignment");

const registerForMatch = async (req, res) => {
  try {
    const { teamId, matchId, roundNumber } = req.body;

    if (!teamId || !matchId) {
      return res.status(400).json({ message: "Team ID and Match ID required" });
    }

    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      where: {
        userId: req.userId,
        teamId,
        matchId,
      },
    });

    if (existingReg) {
      return res.status(409).json({ message: "Already registered for this match" });
    }

    // Create registration and payment
    const registration = await Registration.create({
      userId: req.userId,
      teamId,
      matchId,
      roundNumber: roundNumber || 1,
      status: "pending",
    });

    const payment = await Payment.create({
      userId: req.userId,
      registrationId: registration.id,
      amount: match.entryFee,
      screenshotUrl: "",
      status: "pending",
    });

    await Registration.update(
      { paymentId: payment.id },
      { where: { id: registration.id } }
    );

    res.status(201).json({
      message: "Registration created. Please upload payment screenshot.",
      registration,
      paymentId: payment.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrationsByMatch = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { matchId: req.params.matchId },
    });

    res.json({ registrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { userId: req.userId },
    });

    res.json({ registrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerForMatch,
  getRegistrationsByMatch,
  getMyRegistrations,
};
