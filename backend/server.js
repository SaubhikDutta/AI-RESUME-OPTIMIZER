const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());

// 🔥 IMPORTANT (fix for large uploads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ======================
// DATABASE
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ Mongo Error:", err);
    process.exit(1);
  });

// ======================
// ROUTES
// ======================
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});