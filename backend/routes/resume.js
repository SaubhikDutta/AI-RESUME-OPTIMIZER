const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Resume = require("../models/resume");
const PDFDocument = require("pdfkit");

const { optimizeResumeWithAI } = require("../services/groqService");


// ============================
// 📊 ATS SCORE (FIXED)
// ============================
function calculateATSScore(resumeText, jobDesc) {
  const stopWords = ["the", "a", "is", "in", "and", "of", "to"];

  const jdWords = (jobDesc.toLowerCase().match(/\b\w+\b/g) || [])
    .filter((w) => !stopWords.includes(w));

  const resume = resumeText.toLowerCase();
  const unique = [...new Set(jdWords)];

  let match = 0;

  unique.forEach((word) => {
    if (resume.includes(word)) match++;
  });

  let score = unique.length === 0 ? 0 : (match / unique.length) * 100;

  // penalties (realistic)
  if (resumeText.length < 300) score -= 10;
  if (!resume.includes("project")) score -= 5;
  if (!resume.includes("experience")) score -= 5;

  return Math.max(10, Math.min(Number(score.toFixed(2)), 95));
}


// ============================
// 🚀 OPTIMIZE
// ============================
router.post("/optimize", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDesc, template } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    console.log("🚀 Running AI optimization...");

    const optimizedText = await optimizeResumeWithAI(resumeText, jobDesc);

    const score = calculateATSScore(optimizedText, jobDesc);

    const jdWords = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];
    const resumeWords = optimizedText.toLowerCase();

    const missingSkills = [...new Set(jdWords)]
      .filter((word) => !resumeWords.includes(word))
      .slice(0, 10);

    res.json({
      optimizedText,
      score,
      missingSkills,
      template: template || "simple",
    });

  } catch (err) {
    console.error("❌ OPTIMIZE ERROR:", err);
    res.status(500).json({ msg: "AI optimization failed" });
  }
});


// ============================
// 💾 SAVE (FIXED PROPERLY)
// ============================
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { text, jobDesc } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Text is required" });
    }

    // 🔥 ALWAYS calculate from backend (never trust frontend)
    const atsScore = calculateATSScore(text, jobDesc || "");

    const newResume = new Resume({
      userId: req.user.id || req.user._id, // flexible fix
      text,
      atsScore,
    });

    await newResume.save();

    console.log("✅ Saved:", newResume._id);

    res.json({ msg: "Saved successfully" });

  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({ msg: "Save failed" });
  }
});


// ============================
// 📥 GET MY RESUMES
// ============================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user.id || req.user._id,
    }).sort({ createdAt: -1 });

    res.json(resumes);

  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    res.status(500).json({ msg: "Fetch error" });
  }
});


// ============================
// ✏️ UPDATE
// ============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "No text provided" });
    }

    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id || req.user._id },
      { text },
      { new: true }
    );

    res.json({ msg: "Updated successfully", updated });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ msg: "Update failed" });
  }
});


// ============================
// ❌ DELETE
// ============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id || req.user._id,
    });

    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});


// ============================
// 🎯 JOB MATCH (UPGRADED)
// ============================
router.post("/match", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDesc } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const score = calculateATSScore(resumeText, jobDesc);

    const jdWords = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];
    const resumeWords = resumeText.toLowerCase();

    const missingSkills = [...new Set(jdWords)]
      .filter((word) => !resumeWords.includes(word))
      .slice(0, 10);

    let roles = [];

    if (resumeWords.includes("react") || resumeWords.includes("frontend"))
      roles.push("Frontend Developer");

    if (resumeWords.includes("node") || resumeWords.includes("backend"))
      roles.push("Backend Developer");

    if (resumeWords.includes("mongodb") || resumeWords.includes("api"))
      roles.push("Full Stack Developer");

    if (resumeWords.includes("python") || resumeWords.includes("data"))
      roles.push("Data Analyst");

    if (roles.length === 0) roles.push("Software Developer");

    let message =
      score >= 75
        ? "Strong Match"
        : score >= 45
        ? "Moderate Match"
        : "Low Match";

    res.json({
      matchScore: score,
      message,
      roles,
      missingSkills,
    });

  } catch (err) {
    console.error("❌ MATCH ERROR:", err);
    res.status(500).json({ msg: "Match failed" });
  }
});


// ============================
// 📄 DOWNLOAD PDF
// ============================
router.post("/download", authMiddleware, async (req, res) => {
  try {
    const { text, template } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "No text provided" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

    doc.pipe(res);

    if (template === "modern") {
      doc.fontSize(20).fillColor("#2563eb").text("Modern Resume", { align: "center" });
    } else if (template === "professional") {
      doc.fontSize(16).text("Professional Resume");
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    } else {
      doc.fontSize(14).text("Simple Resume");
    }

    doc.moveDown();
    doc.fillColor("black").text(text);

    doc.end();

  } catch (err) {
    console.error("❌ PDF ERROR:", err);
    res.status(500).json({ msg: "PDF failed" });
  }
});

module.exports = router;