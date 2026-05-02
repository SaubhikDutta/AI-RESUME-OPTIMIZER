const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Resume = require("../models/resume");

const PDFDocument = require("pdfkit");
const multer = require("multer");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const upload = multer();

// ============================
// 📊 ATS SCORE FUNCTION
// ============================
function calculateATSScore(resumeText, jobDesc) {
  if (!resumeText || !jobDesc) return 0;

  const resume = resumeText.toLowerCase();
  const jd = jobDesc.toLowerCase();

  const keywords = jd.match(/\b\w+\b/g) || [];
  const uniqueKeywords = [...new Set(keywords)];

  let matchCount = 0;

  uniqueKeywords.forEach((word) => {
    if (resume.includes(word)) matchCount++;
  });

  let score =
    uniqueKeywords.length === 0
      ? 0
      : (matchCount / uniqueKeywords.length) * 100;

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
    console.log("🔥 OPTIMIZE HIT");

    const { resumeText, jobDesc, template } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Provide Resume + Job Description" });
    }

    const score = calculateATSScore(resumeText, jobDesc);

    const jdWords = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = [...new Set(jdWords)].slice(0, 20);

    const optimizedText = `
${resumeText}

-----------------------------
🔧 OPTIMIZED VERSION
-----------------------------
• Added Keywords: ${uniqueWords.join(", ")}
• Improved formatting for ATS
• Structured for readability

🔹 Suggested Improvements:
- Add measurable achievements
- Include projects with results
- Highlight relevant skills
`;

    res.json({
      optimizedText,
      score,
      template: template || "simple",
    });

  } catch (err) {
    console.error("OPTIMIZE ERROR:", err);
    res.status(500).json({ msg: "Optimization failed" });
  }
});

// ============================
// 🎯 MATCH (FIXED)
// ============================
router.post("/match", authMiddleware, async (req, res) => {
  try {
    console.log("🎯 MATCH HIT");

    const { resumeText, jobDesc } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Provide resume + job description" });
    }

    const resumeWords = resumeText.toLowerCase().match(/\b\w+\b/g) || [];
    const jdWords = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];

    const uniqueJD = [...new Set(jdWords)];

    let matchCount = 0;

    uniqueJD.forEach((word) => {
      if (resumeWords.includes(word)) matchCount++;
    });

    const score =
      uniqueJD.length === 0
        ? 0
        : Number(((matchCount / uniqueJD.length) * 100).toFixed(2));

    res.json({
      matchScore: score,
      message: "Match calculated successfully",
    });

  } catch (err) {
    console.error("MATCH ERROR:", err);
    res.status(500).json({ msg: "Match failed" });
  }
});

// ============================
// 📤 UPLOAD PDF
// ============================
router.post("/upload-pdf", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    console.log("📤 UPLOAD HIT");

    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ msg: "Only PDF allowed" });
    }

    const tempPath = path.join(__dirname, "temp.pdf");
    const outputPath = path.join(__dirname, "output.txt");

    fs.writeFileSync(tempPath, req.file.buffer);

    exec(`pdftotext "${tempPath}" "${outputPath}"`, (err) => {
      try {
        let text = "";

        if (!err && fs.existsSync(outputPath)) {
          text = fs.readFileSync(outputPath, "utf-8");
          console.log("✅ Poppler success");
        }

        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        if (!text || text.trim().length < 20) {
          return res.status(400).json({ msg: "PDF has no readable text" });
        }

        res.json({ text });

      } catch (e) {
        console.error("FINAL ERROR:", e);
        res.status(500).json({ msg: "Parsing error" });
      }
    });

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ msg: "Resume parsing failed" });
  }
});

// ============================
// 💾 SAVE
// ============================
router.post("/save", authMiddleware, async (req, res) => {
  try {
    console.log("💾 SAVE HIT");

    const { text, atsScore } = req.body;

    if (!text) return res.status(400).json({ msg: "No resume text" });

    const newResume = new Resume({
      userId: req.user._id || req.user.id,
      text,
      atsScore: atsScore || 0,
    });

    await newResume.save();

    res.json({ msg: "Saved successfully" });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ msg: "Save failed" });
  }
});

// ============================
// 📥 GET MY RESUMES
// ============================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    console.log("📥 FETCH HIT");

    const resumes = await Resume.find({
      userId: req.user._id || req.user.id,
    }).sort({ createdAt: -1 });

    res.json(resumes);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ msg: "Fetch failed" });
  }
});

// ============================
// ✏️ UPDATE
// ============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    await Resume.findByIdAndUpdate(req.params.id, { text });

    res.json({ msg: "Updated successfully" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ msg: "Update failed" });
  }
});

// ============================
// 🗑 DELETE
// ============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

// ============================
// 📄 DOWNLOAD
// ============================
router.post("/download", authMiddleware, async (req, res) => {
  try {
    console.log("🔥 DOWNLOAD HIT");

    const { text, photo } = req.body;

    if (!text) return res.status(400).json({ msg: "No text provided" });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

    doc.pipe(res);

    doc.fontSize(16).text("Resume");
    doc.moveDown();

    if (photo) {
      try {
        const img = Buffer.from(photo, "base64");
        doc.image(img, 450, 50, { width: 80 });
      } catch {}
    }

    doc.fontSize(11).text(text);

    doc.end();

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ msg: "PDF generation failed" });
  }
});

module.exports = router;