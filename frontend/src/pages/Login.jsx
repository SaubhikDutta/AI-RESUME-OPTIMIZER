import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import NeonButton from "../components/NeonButton";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast("Welcome back!", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed", "error");
    }
    setLoading(false);
  };

  return (
    <motion.div className="auth-page" initial={{opacity:0}} animate={{opacity:1}}>
      <motion.div className="auth-card glass-card"
        initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6}}>
        <Link to="/" className="logo big"><Zap size={28}/> Career<span className="accent">Forge</span></Link>
        <h2>Welcome Back</h2>
        <p className="muted">Login to access your AI workspace.</p>
        <form onSubmit={submit}>
          <div className="input-group">
            <Mail size={16}/>
            <input type="email" placeholder="Email" required
              value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}/>
          </div>
          <div className="input-group">
            <Lock size={16}/>
            <input type="password" placeholder="Password" required
              value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}/>
          </div>
          <NeonButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </NeonButton>
        </form>
        <p className="auth-link">No account? <Link to="/register">Register</Link></p>
      </motion.div>
    </motion.div>
  );
}