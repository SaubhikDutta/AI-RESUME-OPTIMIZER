const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ==============================
// 🔐 PROTECT MIDDLEWARE
// ==============================
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET || "secret123"
    );

    req.userId = decoded.id;
    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// ==============================
// 🧾 REGISTER
// ==============================
router.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
    });

    res.json({ msg: "User registered" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Register failed" });
  }
});

// ==============================
// 🔑 LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // ✅ TOKEN FIX
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
});

// ==============================
// 👤 GET USER (PROTECTED)
// ==============================
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user" });
  }
});

module.exports = router;