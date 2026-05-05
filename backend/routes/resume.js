const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const authMiddleware = require("../middleware/authMiddleware");
const Resume = require("../models/resume");

const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const puppeteer = require("puppeteer");

const upload = multer();

/* ================= CLEAN TEXT ================= */
function cleanText(text) {
  return text
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/* ================= ATS SCORE ================= */
function calculateATSScore(resumeText, jobDesc) {
  if (!resumeText || !jobDesc) return 0;

  const resume = resumeText.toLowerCase();
  const jd = jobDesc.toLowerCase();

  const jdWords = jd.match(/\b\w+\b/g) || [];
  const unique = [...new Set(jdWords)];

  let keywordMatch = 0;
  unique.forEach((word) => {
    if (resume.includes(word)) keywordMatch++;
  });

  const keywordScore = (keywordMatch / unique.length) * 60;

  const skills = [
    "python","machine learning","data science","deep learning",
    "sql","nlp","tensorflow","pytorch","statistics"
  ];

  let skillMatch = 0;
  skills.forEach((skill) => {
    if (resume.includes(skill) && jd.includes(skill)) skillMatch++;
  });

  const skillScore = (skillMatch / skills.length) * 30;
  const lengthScore = Math.min(resume.length / 1000, 1) * 10;

  return Math.round(keywordScore + skillScore + lengthScore);
}

/* ================= OPTIMIZE ================= */
router.post("/optimize", authMiddleware, async (req, res) => {
  try {
    let { resumeText, jobDesc, template } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Provide Resume + JD" });
    }

    resumeText = cleanText(resumeText);
    jobDesc = cleanText(jobDesc);

    const score = calculateATSScore(resumeText, jobDesc);

    const jdWords = jobDesc.match(/\b\w+\b/g) || [];
    const keywords = [...new Set(jdWords)].slice(0, 15);

    const optimizedText = `
${resumeText}

===== KEYWORDS =====
${keywords.join(", ")}

===== IMPROVEMENTS =====
- Add measurable achievements
- Use strong action verbs
- Highlight key technical skills
- Add projects with results
`;

    res.json({ optimizedText, score, template: template || "simple" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Optimization failed" });
  }
});

/* ================= MATCH ================= */
router.post("/match", authMiddleware, async (req, res) => {
  try {
    let { resumeText, jobDesc } = req.body;

    if (!resumeText || !jobDesc) {
      return res.status(400).json({ msg: "Resume + JD required" });
    }

    const clean = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

    const resume = clean(resumeText);
    const jd = clean(jobDesc);

    const jdSkills = [
      "machine learning","data science","deep learning","python",
      "java","c++","sql","nlp","tensorflow","pytorch",
      "statistics","pandas","numpy","node","express","api","system design"
    ];

    let matched = [];
    let missing = [];

    jdSkills.forEach((skill) => {
      if (jd.includes(skill)) {
        if (resume.includes(skill)) matched.push(skill);
        else missing.push(skill);
      }
    });

    const score = Number((matched.length / jdSkills.length) * 100).toFixed(2);

    let recommendations = [];

    try {
      const response = await axios.get(
        "https://remotive.com/api/remote-jobs?search=software"
      );

      recommendations = response.data.jobs.slice(0, 5).map((job) => ({
        title: job.title,
        company: job.company_name,
        chance: (Math.random() * 40 + 60).toFixed(1),
      }));
    } catch {
      recommendations = [
        { title: "ML Engineer", company: "Google", chance: "80" },
        { title: "Data Scientist", company: "Amazon", chance: "75" },
      ];
    }

    res.json({
      matchScore: score,
      matchedSkills: matched,
      missingSkills: missing,
      recommendations,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Match failed" });
  }
});

/* ================= PDF UPLOAD ================= */
router.post("/upload-pdf", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const tempPath = path.join(__dirname, "temp.pdf");
    const outputPath = path.join(__dirname, "output.txt");

    fs.writeFileSync(tempPath, req.file.buffer);

    exec(`pdftotext "${tempPath}" "${outputPath}"`, () => {
      let text = "";

      if (fs.existsSync(outputPath)) {
        text = fs.readFileSync(outputPath, "utf-8");
        text = cleanText(text);
      }

      fs.unlinkSync(tempPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

      if (!text) return res.status(400).json({ msg: "Parsing failed" });

      res.json({ text });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upload error" });
  }
});

/* ================= PDF DOWNLOAD (FIXED) ================= */
router.post("/download", authMiddleware, async (req, res) => {
  try {
    const { text, template, photo } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Resume text required" });
    }

    // ===== NAME EXTRACTION =====
    let name = "Your Name";
    const firstLine = text.split("\n")[0];
    if (firstLine && firstLine.length < 40) {
      name = firstLine;
    }

    // ===== LOAD TEMPLATE =====
    const filePath = path.join(
      __dirname,
      `../templates/${template || "simple"}.html`
    );
    let html = fs.readFileSync(filePath, "utf-8");

    // ===== CLEAN TEXT =====
    let cleanedText = text.split("===== KEYWORDS =====")[0];
    cleanedText = cleanedText.split("===== IMPROVEMENTS =====")[0];

    let lines = cleanedText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 3 && l.length < 120);

    // ===== REMOVE DUPLICATES =====
    const seen = new Set();
    lines = lines.filter((l) => {
      const key = l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // ===== SECTIONS =====
    let contact = [];
    let skills = [];
    let experience = [];
    let projects = [];
    let education = [];

    // ===== CLASSIFICATION =====
    lines.forEach((line) => {
      const l = line.toLowerCase();

      if (l.includes("@") || l.includes("phone") || l.includes("linkedin")) {
        contact.push(line);
        return;
      }

      if (
        l.includes("university") ||
        l.includes("college") ||
        l.includes("b.tech")
      ) {
        education.push(line);
        return;
      }

      if (
        l.includes("project") ||
        l.includes("built") ||
        l.includes("developed")
      ) {
        projects.push(line);
        return;
      }

      if (
        l.includes("intern") ||
        l.includes("experience") ||
        l.includes("worked")
      ) {
        experience.push(line);
        return;
      }

      if (
        l.includes("python") ||
        l.includes("java") ||
        l.includes("sql") ||
        l.includes("machine learning")
      ) {
        skills.push(line);
        return;
      }
    });

    // ===== LIMIT CONTENT =====
    contact = contact.slice(0, 3);
    skills = skills.slice(0, 6);
    experience = experience.slice(0, 4);
    projects = projects.slice(0, 4);
    education = education.slice(0, 2);

    const list = (arr) => arr.map((i) => `<li>${i}</li>`).join("");

    // ===== LEFT SIDE =====
    const leftContent = `
      <h3>Contact</h3>
      <ul>${list(contact)}</ul>
    `;

    // ===== RIGHT SIDE =====
    const rightContent = `
      <h2>Profile</h2>
      <p>Aspiring Software Engineer with strong fundamentals in Data Science, Machine Learning, and backend development.</p>

      <h2>Skills</h2>
      <ul>${list(skills)}</ul>

      <h2>Experience</h2>
      <ul>${list(experience)}</ul>

      <h2>Projects</h2>
      <ul>${list(projects)}</ul>

      <h2>Education</h2>
      <ul>${list(education)}</ul>
    `;

    // ===== FINAL HTML INJECTION =====
    html = html
      .replace(/{{name}}/g, name)
      .replace(/{{left}}/g, leftContent)
      .replace(/{{right}}/g, rightContent)
      .replace(/{{photo}}/g, photo || "");

    // ===== PDF GENERATION =====
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "PDF generation failed" });
  }
});

module.exports = router;