import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Target, Zap, Shield, TrendingUp, Cpu, Brain, Award } from "lucide-react";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";

const features = [
  { icon: Brain, title: "AI Resume Analysis", desc: "Deep semantic parsing with intelligent insights." },
  { icon: Target, title: "ATS Optimization", desc: "Beat applicant tracking systems with precision." },
  { icon: Zap, title: "Instant Match Score", desc: "Real-time matching against any job description." },
  { icon: Shield, title: "Privacy First", desc: "Your data is encrypted and 100% secure." },
  { icon: TrendingUp, title: "Performance Analytics", desc: "Track resume performance with elegant charts." },
  { icon: Cpu, title: "Premium Templates", desc: "Five futuristic templates engineered for hiring success." },
];

const testimonials = [
  { name: "Sara K.", role: "Software Engineer at Google", quote: "Got 3x more callbacks within a week. CareerForge is unreal." },
  { name: "Daniel M.", role: "Product Manager", quote: "The ATS scoring is the most accurate I've ever seen." },
  { name: "Priya R.", role: "Data Scientist", quote: "Beautiful UI, brilliant AI. My resume passed every system." },
];

const faqs = [
  { q: "How does CareerForge analyze my resume?", a: "We use advanced NLP and ATS-aware algorithms to score keyword density, action verbs, structure, and job description alignment." },
  { q: "Is my data safe?", a: "Yes. JWT auth, bcrypt hashing, and zero-data retention on uploads. We never share your data." },
  { q: "Can I download my resume?", a: "Absolutely. Download pixel-perfect PDFs rendered via Headless Chrome." },
  { q: "What templates are available?", a: "Simple, Modern, Professional, Dark, and Futuristic — each ATS-friendly." },
];

const plans = [
  { name: "Free", price: "$0", features: ["1 Resume", "Basic ATS Score", "PDF Export"], highlight: false },
  { name: "Pro", price: "$12", features: ["Unlimited Resumes", "AI JD Match", "All Templates", "Cover Letters"], highlight: true },
  { name: "Enterprise", price: "Custom", features: ["Team seats", "API Access", "Priority Support"], highlight: false },
];

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* HERO */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge"><Sparkles size={14}/> AI-Powered Resume Intelligence</div>
          <h1 className="hero-title">
            Forge Your Career With <span className="gradient-text">AI Precision</span>
          </h1>
          <p className="hero-sub">
            CareerForge analyzes, optimizes, and tailors your resume to every job description — beating ATS systems and landing more interviews.
          </p>
          <div className="hero-cta">
            <Link to="/register"><NeonButton variant="primary">Get Started Free</NeonButton></Link>
            <Link to="/analyzer"><NeonButton variant="ghost">Analyze Resume →</NeonButton></Link>
          </div>
          <div className="hero-stats">
            <div><h3>98%</h3><p>ATS Pass Rate</p></div>
            <div><h3>3x</h3><p>More Callbacks</p></div>
            <div><h3>50K+</h3><p>Resumes Forged</p></div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="floating-resume glass">
            <div className="resume-header"><div className="line w60"></div><div className="line w40"></div></div>
            <div className="resume-body">
              <div className="line"></div><div className="line w80"></div>
              <div className="line w60"></div><div className="line"></div>
              <div className="line w90"></div>
            </div>
            <div className="ats-pill">ATS Score: <strong>94</strong></div>
          </div>
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="section-head">
          <span className="kicker">Features</span>
          <h2>Everything You Need to <span className="accent">Win</span></h2>
          <p>Premium intelligence engineered for modern job seekers.</p>
        </div>
        <div className="grid-3">
          {features.map((f, i) => (
            <GlassCard key={i} delay={i * 0.08} className="feature-card">
              <div className="icon-wrap"><f.icon size={26}/></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ATS SHOWCASE */}
      <section className="section showcase">
        <div className="showcase-grid">
          <div>
            <span className="kicker">ATS Engine</span>
            <h2>Beat the bots, <span className="accent">land the interview</span>.</h2>
            <p>Our scoring engine evaluates 8 dimensions of resume optimization in under a second.</p>
            <ul className="check-list">
              <li>✓ Keyword density and semantic match</li>
              <li>✓ Action verb optimization</li>
              <li>✓ Section structure validation</li>
              <li>✓ Length and readability scoring</li>
            </ul>
          </div>
          <GlassCard className="ats-showcase">
            <h4>Live ATS Analysis</h4>
            <div className="bar"><span>Skills Match</span><div className="bar-track"><div className="bar-fill" style={{width:"92%"}}></div></div><b>92%</b></div>
            <div className="bar"><span>Action Verbs</span><div className="bar-track"><div className="bar-fill" style={{width:"86%"}}></div></div><b>86%</b></div>
            <div className="bar"><span>Structure</span><div className="bar-track"><div className="bar-fill" style={{width:"100%"}}></div></div><b>100%</b></div>
            <div className="bar"><span>JD Match</span><div className="bar-track"><div className="bar-fill" style={{width:"78%"}}></div></div><b>78%</b></div>
          </GlassCard>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-head">
          <span className="kicker">Loved by Professionals</span>
          <h2>Real Results, <span className="accent">Real Stories</span></h2>
        </div>
        <div className="grid-3">
          {testimonials.map((t, i) => (
            <GlassCard key={i} delay={i*0.1}>
              <Award size={20} className="accent"/>
              <p className="quote">“{t.quote}”</p>
              <div className="who"><strong>{t.name}</strong><span>{t.role}</span></div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section">
        <div className="section-head">
          <span className="kicker">Pricing</span>
          <h2>Simple, <span className="accent">Transparent</span> Plans</h2>
        </div>
        <div className="grid-3">
          {plans.map((p, i) => (
            <GlassCard key={i} delay={i*0.1} className={`pricing-card ${p.highlight ? "highlight" : ""}`}>
              {p.highlight && <span className="ribbon">Most Popular</span>}
              <h3>{p.name}</h3>
              <div className="price">{p.price}<small>/mo</small></div>
              <ul>{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <NeonButton variant={p.highlight ? "primary" : "ghost"}>Choose {p.name}</NeonButton>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="section-head">
          <span className="kicker">FAQ</span>
          <h2>Questions? <span className="accent">We've got answers.</span></h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <GlassCard key={i} delay={i*0.05} className="faq-item">
              <h4>{f.q}</h4>
              <p>{f.a}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="section cta-section">
        <GlassCard className="cta-card">
          <h2>Ready to Forge Your Future?</h2>
          <p>Join 50,000+ professionals using CareerForge to land their dream jobs.</p>
          <Link to="/register"><NeonButton>Start Forging — It's Free</NeonButton></Link>
        </GlassCard>
      </section>
    </motion.div>
  );
}