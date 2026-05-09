import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";

const templates = [
  { id: "simple", name: "Simple", color: "#fff", desc: "Clean, minimalist single-column." },
  { id: "modern", name: "Modern", color: "#10b981", desc: "Modern emerald accents." },
  { id: "professional", name: "Professional", color: "#1e3a8a", desc: "Classic serif corporate." },
  { id: "dark", name: "Dark", color: "#0a0a0a", desc: "Sleek dark theme." },
  { id: "futuristic", name: "Futuristic", color: "#34d399", desc: "AI-inspired neon gradient." },
];

export default function Templates() {
  return (
    <motion.div className="page-wrap" initial={{opacity:0}} animate={{opacity:1}}>
      <div className="section-head">
        <span className="kicker">Templates</span>
        <h2>Premium <span className="accent">Resume Templates</span></h2>
        <p>All ATS-compatible. All beautifully crafted.</p>
      </div>
      <div className="grid-3">
        {templates.map((t,i) => (
          <GlassCard key={t.id} delay={i*0.08} className="template-card">
            <div className="template-preview" style={{background: t.color}}>
              <div className="preview-line w60" style={{background: t.id==="dark"||t.id==="futuristic"?"#10b981":"#333"}}></div>
              <div className="preview-line w40"></div>
              <div className="preview-line"></div>
              <div className="preview-line w80"></div>
              <div className="preview-line w70"></div>
              <div className="preview-line w50"></div>
            </div>
            <h3>{t.name}</h3>
            <p className="muted">{t.desc}</p>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}