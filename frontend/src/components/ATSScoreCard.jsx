import { motion } from "framer-motion";

export default function ATSScoreCard({ score = 0, label = "ATS Score" }) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="ats-card glass-card">
      <svg width="180" height="180" className="ats-svg">
        <circle cx="90" cy="90" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none"/>
        <motion.circle
          cx="90" cy="90" r={radius} stroke={color} strokeWidth="12" fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center", filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x="90" y="95" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="700">{score}</text>
        <text x="90" y="115" textAnchor="middle" fill="#10b981" fontSize="12">/ 100</text>
      </svg>
      <h4>{label}</h4>
    </div>
  );
}