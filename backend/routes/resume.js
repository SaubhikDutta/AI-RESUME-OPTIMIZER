import express from "express";
import {
  uploadPDF, saveResume, getMyResumes, updateResume, deleteResume,
  analyzeResume, matchResume, optimize, downloadPDF
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post("/upload-pdf", protect, upload.single("resume"), uploadPDF);
router.post("/save", protect, saveResume);
router.get("/my", protect, getMyResumes);
router.put("/:id", protect, updateResume);
router.delete("/:id", protect, deleteResume);
router.post("/analyze", protect, analyzeResume);
router.post("/match", protect, matchResume);
router.post("/optimize", protect, optimize);
router.post("/download", protect, downloadPDF);
export default router;