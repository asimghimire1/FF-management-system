require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");

// Import models to register associations
require("./models/index");

// Import routes
const authRoutes = require("./routes/auth");
const adminAuthRoutes = require("./routes/adminAuth");
const teamRoutes = require("./routes/teams");
const matchRoutes = require("./routes/matches");
const registrationRoutes = require("./routes/registrations");
const paymentRoutes = require("./routes/payments");
const leaderboardRoutes = require("./routes/leaderboards");
const adminRoutes = require("./routes/admin");

const app = express();

// Connect to SQLite database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});


