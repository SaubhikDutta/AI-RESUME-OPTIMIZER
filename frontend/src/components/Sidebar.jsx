import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Upload, FileSearch, Target, FileEdit,
  FolderOpen, Layout, User, Settings
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Resume", icon: Upload },
  { to: "/analyzer", label: "ATS Analyzer", icon: FileSearch },
  { to: "/ats-match", label: "Job Match", icon: Target },
  { to: "/editor", label: "Resume Editor", icon: FileEdit },
  { to: "/saved", label: "Saved Resumes", icon: FolderOpen },
  { to: "/templates", label: "Templates", icon: Layout },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar glass"
    >
      <div className="sidebar-header">
        <span className="dot pulse"></span>
        <h3>Workspace</h3>
      </div>
      <nav>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({isActive}) => `side-link ${isActive ? "active" : ""}`}>
            <Icon size={18}/> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}