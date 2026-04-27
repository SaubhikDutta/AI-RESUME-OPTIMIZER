const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load env
dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== DATABASE =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// ===== ROUTES =====
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ===== SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});