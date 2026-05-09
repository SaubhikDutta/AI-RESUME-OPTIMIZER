import { Zap, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="logo"><Zap size={22}/><span>Career<span className="accent">Forge</span></span></div>
          <p className="muted">Forge Your Career With AI Precision.</p>
        </div>
        <div>
          <h5>Product</h5>
          <a href="/templates">Templates</a><a href="/analyzer">ATS Analyzer</a><a href="/ats-match">JD Match</a>
        </div>
        <div>
          <h5>Company</h5>
          <a href="/about">About</a><a href="/contact">Contact</a>
        </div>
        <div>
          <h5>Connect</h5>
          <div className="socials">
            <a href="#"><Github size={18}/></a>
            <a href="#"><Twitter size={18}/></a>
            <a href="#"><Linkedin size={18}/></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} CareerForge. All rights reserved.</div>
    </footer>
  );
}