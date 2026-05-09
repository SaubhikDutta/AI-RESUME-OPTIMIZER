import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import ATSScoreCard from "../components/ATSScoreCard";
import { analyzeResume } from "../services/resumeService";
import { useToast } from "../context/ToastContext";

export default function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const run = async () => {
    if (text.trim().length < 50) return showToast("Paste your full resume text", "error");
    setLoading(true);
    try {
      const { data } = await analyzeResume({ text });
      setResult(data);
    } catch { showToast("Analysis failed", "error"); }
    setLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <h1>ATS <span className="accent">Analyzer</span></h1>
          <p className="muted">Paste your resume text for an instant ATS audit.</p>

          <GlassCard>
            <textarea className="big-textarea" rows={12}
              placeholder="Paste your full resume text here..."
              value={text} onChange={(e) => setText(e.target.value)}/>
            <NeonButton onClick={run} disabled={loading}>
              {loading ? "Analyzing..." : "Run ATS Analysis"}
            </NeonButton>
          </GlassCard>

          {result && (
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="result-grid">
              <ATSScoreCard score={result.atsScore}/>
              <GlassCard>
                <h3>Skill Coverage</h3>
                <div className="chip-row">
                  {result.foundSkills.map((s) => <span key={s} className="chip success">{s}</span>)}
                  {result.foundSkills.length === 0 && <p className="muted">No technical skills detected.</p>}
                </div>
              </GlassCard>
              <GlassCard>
                <h3>Suggestions</h3>
                <ul className="check-list">
                  {result.suggestions.map((s,i) => <li key={i}>→ {s}</li>)}
                </ul>
              </GlassCard>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}