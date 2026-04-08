const express = require("express");
const {
  uploadPaymentScreenshot,
  getPaymentsByUser,
  getAllPendingPayments,
} = require("../controllers/paymentController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("screenshot"),
  uploadPaymentScreenshot
);
router.get("/my-payments", authMiddleware, getPaymentsByUser);
router.get("/admin/pending", authMiddleware, adminMiddleware, getAllPendingPayments);

module.exports = router;
