const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  // 👤 User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 📄 Resume text
  text: {
    type: String,
    required: true,
  },

  // 📊 ATS Score
  atsScore: {
    type: Number,
    required: true,
  },

  // 🧠 Missing skills (optional feature)
  missingSkills: {
    type: [String],
    default: [],
  },

  // 🕒 Created timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);