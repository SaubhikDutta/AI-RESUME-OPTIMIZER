const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Resume = require("../models/resume");

const PDFDocument = require("pdfkit");


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
    : ((matchCount / uniqueKeywords.length) * 100).toFixed(2);
}


// ============================
// 🔥 OPTIMIZE
// ============================
router.post("/optimize", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDesc, template } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const score = calculateATSScore(resumeText, jobDesc);

    const optimizedText =
      resumeText + "\n\n[Optimized based on job description]";

    res.json({
      score,
      optimizedText,
      template: template || "simple",
    });

  } catch (err) {
    console.error("OPTIMIZE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ============================
// 💾 SAVE RESUME
// ============================
router.post("/save", authMiddleware, async (req, res) => {
  try {
    console.log("💾 Saving for user:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { text, atsScore } = req.body;

    if (!text || !atsScore) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const newResume = new Resume({
      userId: req.user._id,   // ✅ FIXED (ObjectId)
      text: text,             // ✅ FIXED
      atsScore: atsScore,     // ✅ FIXED
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
    console.log("📥 Fetching for user:", req.user);

    const resumes = await Resume.find({
      userId: req.user._id   // ✅ FIXED FILTER
    }).sort({ createdAt: -1 });

    console.log("📦 Found resumes:", resumes.length);

    res.json(resumes);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ msg: "Error fetching resumes" });
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
      { _id: req.params.id, userId: req.user._id },
      { text },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Resume not found" });
    }

    res.json({ msg: "Updated successfully", updated });

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
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Resume not found" });
    }

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
  try {
    const { text, template } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "No text provided" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=resume.pdf"
    );

    doc.pipe(res);

    // TEMPLATE
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

    // CONTENT
    doc.fontSize(12).fillColor("black").text(text);

    doc.end();

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ msg: "PDF failed" });
  }
});

module.exports = router;