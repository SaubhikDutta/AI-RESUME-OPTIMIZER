import Resume from "../models/Resume.js";
import { parsePDF } from "../utils/pdfParser.js";
import { analyzeATS } from "../utils/atsAnalyzer.js";
import { optimizeResume } from "../utils/resumeOptimizer.js";
import { generateResumePDF } from "../utils/pdfGenerator.js";
import fs from "fs";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    console.log("Uploaded File:", req.file);
    console.log(req.file);

    const filePath = req.file.path;

    // Parse PDF
    const text = await parsePDF(filePath);

    // Analyze ATS
    const analysis = analyzeATS(text);

    // DON'T DELETE FILE YET
    // fs.unlinkSync(filePath);

    res.json({
      text,
      analysis,
    });

  } catch (e) {
    console.log(e);

    res.status(500).json({
      message: e.message,
    });
  }
};

export const saveResume = async (req, res) => {
  try {
    const { text, title, template, atsScore, jobDescription, matchPercent, keywords, missingSkills, suggestions } = req.body;
    const resume = await Resume.create({
      user: req.user._id,
      text, title, template, atsScore,
      jobDescription, matchPercent, keywords, missingSkills, suggestions,
    });
    res.status(201).json(resume);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const getMyResumes = async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(resumes);
};

export const updateResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Not found" });
  if (resume.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });
  Object.assign(resume, req.body);
  await resume.save();
  res.json(resume);
};

export const deleteResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Not found" });
  if (resume.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });
  await resume.deleteOne();
  res.json({ message: "Deleted" });
};

export const analyzeResume = async (req, res) => {
  const { text, jobDescription } = req.body;
  const analysis = analyzeATS(text, jobDescription);
  res.json(analysis);
};

export const matchResume = async (req, res) => {
  const { text, jobDescription } = req.body;
  if (!jobDescription) return res.status(400).json({ message: "JD required" });
  const analysis = analyzeATS(text, jobDescription);
  res.json(analysis);
};

export const optimize = async (req, res) => {
  const { text, jobDescription } = req.body;
  const result = optimizeResume(text, jobDescription);
  const analysis = analyzeATS(result.optimizedText, jobDescription);
  res.json({ ...result, analysis });
};

export const downloadPDF = async (req, res) => {
  try {
    const { text, template = "modern" } = req.body;

    const pdfBuffer = await generateResumePDF(template, {
  text,
});

    res.set({
  "Content-Type": "application/pdf",
  "Content-Disposition": "attachment; filename=careerforge_resume.pdf",
  "Content-Length": pdfBuffer.length,
});

return res.end(pdfBuffer);

  } catch (error) {
    console.log(error);

   return res.status(500).json({
      message: "PDF generation failed",
    });
  }
};