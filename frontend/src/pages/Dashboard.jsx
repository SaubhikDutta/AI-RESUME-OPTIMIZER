import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Award, Target, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import ATSScoreCard from "../components/ATSScoreCard";
import NeonButton from "../components/NeonButton";
import { useAuth } from "../context/AuthContext";
import { getMyResumes } from "../services/resumeService";

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyResumes().then(({data}) => setResumes(data)).finally(() => setLoading(false));
  }, []);

  const avgScore = resumes.length
    ? Math.round(resumes.reduce((a,b) => a+(b.atsScore||0), 0) / resumes.length) : 0;

  const stats = [
    { label: "Total Resumes", value: resumes.length, icon: FileText },
    { label: "Avg ATS Score", value: avgScore, icon: Award },
    { label: "Best Match", value: Math.max(0, ...resumes.map(r => r.matchPercent || 0)), icon: Target },
    { label: "This Month", value: resumes.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length, icon: TrendingUp },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <div className="dash-head">
            <div>
              <h1>Welcome back, <span className="accent">{user?.name?.split(" ")[0]} 👋</span></h1>
              <p className="muted">Here's your AI-powered resume insight.</p>
            </div>
            <Link to="/upload"><NeonButton><Plus size={16}/> New Resume</NeonButton></Link>
          </div>

          <div className="grid-4 stats-grid">
            {stats.map((s, i) => (
              <GlassCard key={i} delay={i*0.05} className="stat-card">
                <div className="icon-wrap"><s.icon size={20}/></div>
                <div>
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="dash-grid">
            <GlassCard className="dash-col">
              <h3>Performance Overview</h3>
              <div className="bar"><span>ATS Strength</span><div className="bar-track"><div className="bar-fill" style={{width:`${avgScore}%`}}></div></div><b>{avgScore}%</b></div>
              <div className="bar"><span>Skill Coverage</span><div className="bar-track"><div className="bar-fill" style={{width:"82%"}}></div></div><b>82%</b></div>
              <div className="bar"><span>Action Verbs</span><div className="bar-track"><div className="bar-fill" style={{width:"74%"}}></div></div><b>74%</b></div>
              <div className="bar"><span>Format Quality</span><div className="bar-track"><div className="bar-fill" style={{width:"90%"}}></div></div><b>90%</b></div>
            </GlassCard>
            <ATSScoreCard score={avgScore} label="Average ATS Score"/>
          </div>

          <GlassCard className="recent-section">
            <div className="row-between">
              <h3>Recent Resumes</h3>
              <Link to="/saved" className="view-all">View All →</Link>
            </div>
            {loading ? <p className="muted">Loading...</p> :
              resumes.length === 0 ? (
                <div className="empty-state">
                  <p>No resumes yet. Upload your first one!</p>
                  <Link to="/upload"><NeonButton>Upload Resume</NeonButton></Link>
                </div>
              ) : (
                <div className="recent-list">
                  {resumes.slice(0,4).map((r) => (
                    <div key={r._id} className="recent-row">
                      <FileText size={18} className="accent"/>
                      <div className="grow">
                        <strong>{r.title || "Untitled"}</strong>
                        <small className="muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                      </div>
                      <span className="badge">{r.atsScore}/100</span>
                    </div>
                  ))}
                </div>
              )}
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}