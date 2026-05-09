import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <h1>My <span className="accent">Profile</span></h1>
          <GlassCard className="profile-card">
            <div className="avatar"><User size={40}/></div>
            <h2>{user?.name}</h2>
            <p className="muted">{user?.email}</p>
            <span className="badge">{user?.plan?.toUpperCase()} PLAN</span>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}