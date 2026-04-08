const Payment = require("../models/Payment");
const Registration = require("../models/Registration");
const Match = require("../models/Match");
const { getNextAvailableSlot } = require("../utils/slotAssignment");

const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "verified";
    await payment.save();

    // Approve registration and assign slot
    const registration = await Registration.findById(payment.registrationId);
    registration.status = "approved";

    // Get next available slot
    const match = await Match.findById(registration.matchId);
    const approvedRegs = await Registration.find({
      matchId: registration.matchId,
      status: "approved",
    });

    const nextSlot = getNextAvailableSlot(approvedRegs, match.maxTeams);
    if (nextSlot) {
      registration.slotNumber = nextSlot;
    }

    await registration.save();

    // Check if match is full (12 slots filled)
    const filledSlots = await Registration.countDocuments({
      matchId: registration.matchId,
      status: "approved",
    });

    if (filledSlots >= match.maxTeams) {
      await Match.findByIdAndUpdate(registration.matchId, {
        status: "registration_closed",
      });
    }

    res.json({
      message: "Payment approved and slot assigned",
      payment,
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectPayment = async (req, res) => {
  try {
    const { paymentId, rejectionReason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "rejected";
    payment.rejectionReason = rejectionReason || "No reason provided";
    await payment.save();

    // Reject registration
    const registration = await Registration.findById(payment.registrationId);
    registration.status = "rejected";
    await registration.save();

    res.json({
      message: "Payment rejected",
      payment,
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignSlot = async (req, res) => {
  try {
    const { registrationId, slotNumber } = req.body;

    if (!registrationId || !slotNumber) {
      return res.status(400).json({ message: "Registration ID and slot number required" });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.status !== "approved") {
      return res.status(400).json({ message: "Registration must be approved first" });
    }

    // Check if slot is available
    const existingSlot = await Registration.findOne({
      matchId: registration.matchId,
      slotNumber,
      status: "approved",
      _id: { $ne: registrationId },
    });

    if (existingSlot) {
      return res.status(409).json({ message: "Slot already occupied" });
    }

    registration.slotNumber = slotNumber;
    await registration.save();

    res.json({
      message: "Slot assigned successfully",
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMatchSlots = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const registrations = await Registration.find({
      matchId,
      status: "approved",
    })
      .populate("teamId")
      .sort({ slotNumber: 1 });

    const slots = [];
    for (let i = 1; i <= match.maxTeams; i++) {
      const registration = registrations.find((r) => r.slotNumber === i);
      slots.push({
        slotNumber: i,
        registration: registration || null,
      });
    }

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  approvePayment,
  rejectPayment,
  assignSlot,
  getMatchSlots,
};
