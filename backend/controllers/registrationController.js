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

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      userId: req.userId,
      teamId,
      matchId,
    });

    if (existingReg) {
      return res.status(409).json({ message: "Already registered for this match" });
    }

    // Create registration and payment
    const registration = new Registration({
      userId: req.userId,
      teamId,
      matchId,
      roundNumber: roundNumber || 1,
      status: "pending",
    });

    await registration.save();

    const payment = new Payment({
      userId: req.userId,
      registrationId: registration._id,
      amount: match.entryFee,
      screenshotUrl: "",
      status: "pending",
    });

    await payment.save();

    registration.paymentId = payment._id;
    await registration.save();

    // Add to match registrations
    await Match.findByIdAndUpdate(matchId, {
      $push: { registrations: registration._id },
    });

    res.status(201).json({
      message: "Registration created. Please upload payment screenshot.",
      registration,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrationsByMatch = async (req, res) => {
  try {
    const registrations = await Registration.find({
      matchId: req.params.matchId,
    })
      .populate("userId", "email username")
      .populate("teamId")
      .populate("paymentId");

    res.json({ registrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.userId,
    })
      .populate("matchId")
      .populate("teamId")
      .populate("paymentId");

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
