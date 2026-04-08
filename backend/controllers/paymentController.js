const Payment = require("../models/Payment");
const Registration = require("../models/Registration");
const path = require("path");

const uploadPaymentScreenshot = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId || !req.file) {
      return res.status(400).json({ message: "Payment ID and screenshot required" });
    }

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const screenshotUrl = `/uploads/${req.file.filename}`;
    await Payment.update(
      { screenshotUrl },
      { where: { id: paymentId } }
    );

    const updatedPayment = await Payment.findByPk(paymentId);

    res.json({
      message: "Screenshot uploaded. Waiting for admin approval.",
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.userId },
    });

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { status: "pending" },
    });

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
