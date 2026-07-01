import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";

export default function Contact() {
  return (
    <motion.div className="page-wrap" initial={{opacity:0}} animate={{opacity:1}}>
      <div className="section-head">
        <span className="kicker">Contact</span>
        <h2>Let's <span className="accent">Talk</span></h2>
      </div>
      <div className="grid-2">
        <GlassCard>
          <h3>Reach Us</h3>
          <p><Mail size={16}/> support@careerforge.ai</p>
          <p><Phone size={16}/> +1 (555) 010-2024</p>
          <p><MapPin size={16}/> Remote-first, global team</p>
        </GlassCard>
        <GlassCard>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group"><input placeholder="Name"/></div>
            <div className="input-group"><input placeholder="Email"/></div>
            <div className="input-group"><textarea rows={4} placeholder="Message"/></div>
            <NeonButton type="submit">Send Message</NeonButton>
          </form>
        </GlassCard>
      </div>
    </motion.div>
  );

}

