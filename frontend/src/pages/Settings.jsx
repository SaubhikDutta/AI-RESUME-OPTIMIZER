import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";

export default function Settings() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <h1><span className="accent">Settings</span></h1>
          <GlassCard>
            <h3>Preferences</h3>
            <div className="setting-row">
              <span>Dark Mode</span>
              <label className="switch"><input type="checkbox" defaultChecked/><span className="slider"></span></label>
            </div>
            <div className="setting-row">
              <span>Email Notifications</span>
              <label className="switch"><input type="checkbox"/><span className="slider"></span></label>
            </div>
            <div className="setting-row">
              <span>AI Auto-Optimize</span>
              <label className="switch"><input type="checkbox" defaultChecked/><span className="slider"></span></label>
            </div>
          </GlassCard>
          <GlassCard>
            <h3>Danger Zone</h3>
            <p className="muted">Permanently delete your account and all data.</p>
            <NeonButton variant="ghost">Delete Account</NeonButton>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}