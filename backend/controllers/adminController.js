const Payment = require("../models/Payment");
const Registration = require("../models/Registration");
const Match = require("../models/Match");
const { getNextAvailableSlot } = require("../utils/slotAssignment");

const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await Payment.update(
      { status: "verified" },
      { where: { id: paymentId } }
    );

    // Approve registration and assign slot
    const registration = await Registration.findByPk(payment.registrationId);
    await Registration.update(
      { status: "approved" },
      { where: { id: payment.registrationId } }
    );

    // Get next available slot
    const match = await Match.findByPk(registration.matchId);
    const approvedRegs = await Registration.findAll({
      where: {
        matchId: registration.matchId,
        status: "approved",
      },
    });

    const nextSlot = getNextAvailableSlot(approvedRegs, match.maxTeams);
    if (nextSlot) {
      await Registration.update(
        { slotNumber: nextSlot },
        { where: { id: registration.id } }
      );
    }

    // Check if match is full
    const filledSlots = await Registration.count({
      where: {
        matchId: registration.matchId,
        status: "approved",
      },
    });

    if (filledSlots >= match.maxTeams) {
      await Match.update(
        { status: "registration_closed" },
        { where: { id: registration.matchId } }
      );
    }

    const updatedPayment = await Payment.findByPk(paymentId);
    const updatedReg = await Registration.findByPk(payment.registrationId);

    res.json({
      message: "Payment approved and slot assigned",
      payment: updatedPayment,
      registration: updatedReg,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectPayment = async (req, res) => {
  try {
    const { paymentId, rejectionReason } = req.body;

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await Payment.update(
      { status: "rejected", rejectionReason: rejectionReason || "No reason provided" },
      { where: { id: paymentId } }
    );

    // Reject registration
    const registration = await Registration.findByPk(payment.registrationId);
    await Registration.update(
      { status: "rejected" },
      { where: { id: payment.registrationId } }
    );

    const updatedPayment = await Payment.findByPk(paymentId);
    const updatedReg = await Registration.findByPk(payment.registrationId);

    res.json({
      message: "Payment rejected",
      payment: updatedPayment,
      registration: updatedReg,
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

    const registration = await Registration.findByPk(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.status !== "approved") {
      return res.status(400).json({ message: "Registration must be approved first" });
    }

    // Check if slot is available
    const existingSlot = await Registration.findOne({
      where: {
        matchId: registration.matchId,
        slotNumber,
        status: "approved",
        id: { $ne: registrationId },
      },
    });

    if (existingSlot) {
      return res.status(409).json({ message: "Slot already occupied" });
    }

    await Registration.update(
      { slotNumber },
      { where: { id: registrationId } }
    );

    const updatedReg = await Registration.findByPk(registrationId);

    res.json({
      message: "Slot assigned successfully",
      registration: updatedReg,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMatchSlots = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const registrations = await Registration.findAll({
      where: {
        matchId,
        status: "approved",
      },
      order: [["slotNumber", "ASC"]],
    });

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
