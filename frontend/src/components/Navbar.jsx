import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="navbar glass"
    >
      <Link to="/" className="logo">
        <Zap size={24} className="logo-icon" />
        <span>Career<span className="accent">Forge</span></span>
      </Link>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/templates" onClick={() => setOpen(false)}>Templates</Link>
        <Link to="/about" onClick={() => setOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="btn-ghost"><LayoutDashboard size={16}/> Dashboard</Link>
            <button onClick={() => { logout(); navigate("/"); }} className="btn-neon">
              <LogOut size={16}/> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/register" className="btn-neon">Get Started</Link>
          </>
        )}
      </div>

      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={26}/> : <Menu size={26}/>}
      </button>
    </motion.nav>
  );
}