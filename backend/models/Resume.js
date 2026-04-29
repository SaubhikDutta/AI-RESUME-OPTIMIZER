const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  // ✅ FIXED: Proper ObjectId for user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ✅ Resume text (main content)
  text: {
    type: String,
    required: true,
  },

  // ✅ ATS Score
  atsScore: {
    type: Number,
    required: true,
  },

  // ✅ Optional but useful
  missingSkills: {
    type: [String],
    default: [],
  },

  // ✅ Timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);