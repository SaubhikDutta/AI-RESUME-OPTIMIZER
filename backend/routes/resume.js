const express = require("express");
const router = express.Router();
const multer = require("multer");

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ===== IMPORTS =====
const { rewriteResume } = require("../services/llm");
const { generatePDF } = require("../services/pdf");
const Resume = require("../models/Resume");

// ===== ATS SCORE =====
function calculateATSScore(resumeText, jobDesc) {
  const resume = resumeText.toLowerCase();
  const job = jobDesc.toLowerCase();

  const keywords = job.match(/[a-zA-Z]{3,}/g) || [];
  const uniqueKeywords = [...new Set(keywords)];

  let matchCount = 0;

  uniqueKeywords.forEach((word) => {
    if (resume.includes(word)) matchCount++;
  });

  return ((matchCount / uniqueKeywords.length) * 100).toFixed(2);
}

// ===== OPTIMIZE ROUTE =====
router.post("/optimize", upload.single("photo"), async (req, res) => {
  try {
    const { resumeText, jobDesc } = req.body;
    const photoPath = req.file ? req.file.path : null;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ error: "Missing data" });
    }

    // AI CALL
    const aiResponse = await rewriteResume(resumeText, jobDesc);

    let optimized;
    try {
      optimized = JSON.parse(aiResponse);
    } catch (err) {
      console.error("JSON Parse Error:", aiResponse);
      return res.status(500).json({ error: "Invalid AI response" });
    }

    // attach photo
    optimized.photo = photoPath;

    const score = calculateATSScore(resumeText, jobDesc);

    res.json({
      success: true,
      data: optimized,
      atsScore: score,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ===== DOWNLOAD PDF ROUTE (FIXED) =====
router.post("/download", upload.single("photo"), async (req, res) => {
  try {
    const data = JSON.parse(req.body.optimized);
    const template = req.body.template || "modern";

    // attach photo if uploaded
    if (req.file) {
      data.photo = req.file.path;
    }

    const pdf = await generatePDF(data, template);

    // ✅ IMPORTANT HEADERS
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdf.length,
    });

    return res.end(pdf); // ✅ return prevents duplicate send
  } catch (err) {
    console.error("PDF ERROR:", err);
    return res.status(500).send("PDF generation failed");
  }
});

// ===== SAVE ROUTE =====
router.post("/save", async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
});

module.exports = router;