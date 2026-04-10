const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ADMIN_FIXED_EMAIL = process.env.ADMIN_FIXED_EMAIL || "mrx@gmail.com";
const ADMIN_FIXED_PASSWORD = process.env.ADMIN_FIXED_PASSWORD || "admin123";

const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminSignup = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (email !== ADMIN_FIXED_EMAIL) {
      return res.status(403).json({
        message: `Admin signup is restricted to ${ADMIN_FIXED_EMAIL}`,
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(ADMIN_FIXED_PASSWORD, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      role: "admin",
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin account created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Use admin login at /admin/login" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      if (email !== ADMIN_FIXED_EMAIL || password !== ADMIN_FIXED_PASSWORD) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const hashedPassword = await bcrypt.hash(ADMIN_FIXED_PASSWORD, 10);
      user = await User.create({
        email: ADMIN_FIXED_EMAIL,
        username: "Admin",
        password: hashedPassword,
        role: "admin",
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.role !== "admin") {
        if (email === ADMIN_FIXED_EMAIL && password === ADMIN_FIXED_PASSWORD) {
          await User.update(
            { role: "admin", password: await bcrypt.hash(ADMIN_FIXED_PASSWORD, 10) },
            { where: { id: user.id } }
          );
          user = await User.findByPk(user.id);
        } else {
          return res.status(403).json({ message: "Admin access required" });
        }
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, adminSignup, adminLogin };

