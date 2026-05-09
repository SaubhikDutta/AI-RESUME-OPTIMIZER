import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import ATSScoreCard from "../components/ATSScoreCard";
import { uploadPDF, saveResume } from "../services/resumeService";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return showToast("Select a PDF first", "error");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const response = await uploadPDF(fd);

console.log("UPLOAD RESPONSE:", response);

setResult(response.resume || response.data || response);
      showToast("Resume parsed successfully!", "success");
    } catch (e) {
      showToast(e.response?.data?.message || "Upload failed", "error");
    }
    setLoading(false);
  };

  const save = async () => {
    await saveResume({
      text: result.text,
      title: file.name.replace(".pdf",""),
      atsScore: result.analysis.atsScore,
      template: "modern",
      keywords: result.analysis.foundSkills,
      missingSkills: result.analysis.missingKeywords,
      suggestions: result.analysis.suggestions,
    });
    showToast("Saved!", "success");
    navigate("/saved");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <h1>Upload <span className="accent">Resume</span></h1>
          <p className="muted">Upload your PDF resume to instantly analyze and optimize it.</p>

          <GlassCard className="upload-zone">
            <label className="dropzone">
              <input type="file" accept="application/pdf" hidden
                onChange={(e) => setFile(e.target.files[0])}/>
              <UploadCloud size={48} className="accent"/>
              <h3>{file ? file.name : "Drop or click to upload PDF"}</h3>
              <p className="muted">Max 10MB · PDF format</p>
            </label>
            <NeonButton onClick={handleUpload} disabled={loading}>
              {loading ? "Analyzing..." : <>Analyze <ArrowRight size={16}/></>}
            </NeonButton>
          </GlassCard>

          {result && (
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="result-grid">
              <ATSScoreCard score={result.analysis.atsScore}/>
              <GlassCard className="dash-col">
                <h3>Analysis Breakdown</h3>
                <div className="bar"><span>Skills</span><div className="bar-track"><div className="bar-fill" style={{width:`${result.analysis.skillScore}%`}}></div></div><b>{result.analysis.skillScore}%</b></div>
                <div className="bar"><span>Action Verbs</span><div className="bar-track"><div className="bar-fill" style={{width:`${result.analysis.verbScore}%`}}></div></div><b>{result.analysis.verbScore}%</b></div>
                <div className="bar"><span>Length</span><div className="bar-track"><div className="bar-fill" style={{width:`${result.analysis.lengthScore}%`}}></div></div><b>{result.analysis.lengthScore}%</b></div>
                <div className="bar"><span>Sections</span><div className="bar-track"><div className="bar-fill" style={{width:`${result.analysis.sectionScore}%`}}></div></div><b>{result.analysis.sectionScore}%</b></div>
              </GlassCard>
              <GlassCard>
                <h3>AI Suggestions</h3>
                <ul className="check-list">
                  {result.analysis.suggestions.map((s,i) => <li key={i}>→ {s}</li>)}
                  {result.analysis.suggestions.length === 0 && <li>✓ Excellent! Your resume looks great.</li>}
                </ul>
                <NeonButton onClick={save}><FileText size={16}/> Save Resume</NeonButton>
              </GlassCard>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}