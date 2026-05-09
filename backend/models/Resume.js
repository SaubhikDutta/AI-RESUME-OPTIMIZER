import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Resume" },
    text: { type: String, required: true },
    template: {
      type: String,
      enum: ["simple", "modern", "professional", "dark", "futuristic"],
      default: "modern",
    },
    atsScore: { type: Number, default: 0 },
    keywords: [{ type: String }],
    missingSkills: [{ type: String }],
    suggestions: [{ type: String }],
    jobDescription: { type: String, default: "" },
    matchPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);