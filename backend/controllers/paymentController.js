const Payment = require("../models/Payment");
const Registration = require("../models/Registration");
const path = require("path");

const uploadPaymentScreenshot = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId || !req.file) {
      return res.status(400).json({ message: "Payment ID and screenshot required" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const screenshotUrl = `/uploads/${req.file.filename}`;
    payment.screenshotUrl = screenshotUrl;
    await payment.save();

    res.json({
      message: "Screenshot uploaded. Waiting for admin approval.",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate("registrationId");

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .populate("userId", "email username")
      .populate("registrationId");

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadPaymentScreenshot,
  getPaymentsByUser,
  getAllPendingPayments,
};
