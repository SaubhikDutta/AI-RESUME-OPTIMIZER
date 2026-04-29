const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Resume = require("../models/resume");
const PDFDocument = require("pdfkit");

// 🔥 IMPORT GROQ AI
const optimizeResumeWithAI = require("../services/groqService");


// ============================
// 📊 ATS SCORE FUNCTION
// ============================
function calculateATSScore(resumeText, jobDesc) {
  const resume = resumeText.toLowerCase();
  const jd = jobDesc.toLowerCase();

  const keywords = jd.match(/\b\w+\b/g) || [];
  const uniqueKeywords = [...new Set(keywords)];

  let matchCount = 0;

  uniqueKeywords.forEach((word) => {
    if (resume.includes(word)) matchCount++;
  });

  return uniqueKeywords.length === 0
    ? 0
    : Number(((matchCount / uniqueKeywords.length) * 100).toFixed(2));
}


// ============================
// 🚀 OPTIMIZE (AI + MISSING SKILLS)
// ============================
router.post("/optimize", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDesc, template } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    console.log("🚀 Running AI optimization...");

    // 🔥 AI OPTIMIZATION
    const optimizedText = await optimizeResumeWithAI(
      resumeText,
      jobDesc
    );

    // 🔥 ATS SCORE
    const score = calculateATSScore(optimizedText, jobDesc);

    // 🔥 MISSING SKILLS (NEW)
    const jdWords = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];
    const resumeWords = optimizedText.toLowerCase();

    const missingSkills = [...new Set(jdWords)].filter(
      (word) => !resumeWords.includes(word)
    ).slice(0, 10);

    res.json({
      optimizedText,
      score,
      missingSkills, // ✅ NEW FEATURE
      template: template || "simple",
    });

  } catch (err) {
    console.error("OPTIMIZE ERROR:", err);
    res.status(500).json({ msg: "AI optimization failed" });
  }
});


// ============================
// 💾 SAVE RESUME
// ============================
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { resumeText, score } = req.body;

    if (!resumeText || !score) {
      return res.status(400).json({ msg: "Missing data" });
    }

    console.log("💾 Saving for user:", req.user._id);

    const newResume = new Resume({
      userId: req.user._id,
      text: resumeText,
      atsScore: score,
    });

    await newResume.save();

    res.json({ msg: "Saved successfully" });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ msg: "Save failed" });
  }
});


// ============================
// 📥 GET USER RESUMES
// ============================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(resumes);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ msg: "Error fetching resumes" });
  }
});


// ============================
// ✏️ UPDATE (SMART EDIT)
// ============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { text, jobDesc } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "No text provided" });
    }

    let updatedText = text;
    let newScore = 0;

    // 🔥 IF jobDesc exists → re-run AI
    if (jobDesc) {
      console.log("🔁 Re-optimizing after edit...");
      updatedText = await optimizeResumeWithAI(text, jobDesc);
      newScore = calculateATSScore(updatedText, jobDesc);
    } else {
      newScore = calculateATSScore(text, text);
    }

    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        text: updatedText,
        atsScore: newScore,
      },
      { new: true }
    );

    res.json({
      msg: "Updated successfully",
      updated,
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
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
      userId: req.user._id,
    });

    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});


// ============================
// 📄 DOWNLOAD PDF
// ============================
router.post("/download", authMiddleware, async (req, res) => {
  console.log("🔥 API HIT");

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
      doc.fontSize(20).fillColor("#2563eb").text("Resume", { align: "center" });
      doc.moveDown();
    } else if (template === "professional") {
      doc.fontSize(22).text("PROFESSIONAL RESUME");
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
    } else {
      doc.fontSize(18).text("Resume");
      doc.moveDown();
    }

    doc.fontSize(12).fillColor("black").text(text);

    doc.end();

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ msg: "PDF failed" });
  }
});

module.exports = router;