import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import NeonButton from "../components/NeonButton";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      showToast("Account created! 🚀", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(
   err.response?.data?.message || "Registration failed",
   "error"
);
    }
    setLoading(false);
  };

  return (
    <motion.div className="auth-page" initial={{opacity:0}} animate={{opacity:1}}>
      <motion.div className="auth-card glass-card"
        initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6}}>
        <Link to="/" className="logo big"><Zap size={28}/> Career<span className="accent">Forge</span></Link>
        <h2>Create Account</h2>
        <p className="muted">Forge your career in less than 60 seconds.</p>
        <form onSubmit={submit}>
          <div className="input-group">
            <User size={16}/>
            <input type="text" placeholder="Full Name" required
              value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}/>
          </div>
          <div className="input-group">
            <Mail size={16}/>
            <input type="email" placeholder="Email" required
              value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}/>
          </div>
          <div className="input-group">
            <Lock size={16}/>
            <input type="password" placeholder="Password (min 6)" required minLength={6}
              value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}/>
          </div>
          <NeonButton type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </NeonButton>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </motion.div>
    </motion.div>
  );
}