import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";

export default function About() {
  return (
    <motion.div className="page-wrap" initial={{opacity:0}} animate={{opacity:1}}>
      <div className="section-head">
        <span className="kicker">About</span>
        <h2>Why <span className="accent">CareerForge</span>?</h2>
      </div>
      <div className="grid-2">
        <GlassCard>
          <h3>Our Mission</h3>
          <p>Empower every professional with AI-driven tools to craft resumes that beat ATS bots and win human attention.</p>
        </GlassCard>
        <GlassCard>
          <h3>Our Engine</h3>
          <p>Built on MongoDB Atlas, Express orchestration, NLP analysis, and Puppeteer rendering — engineered for production-scale performance.</p>
        </GlassCard>
      </div>
    </motion.div>
  );
}