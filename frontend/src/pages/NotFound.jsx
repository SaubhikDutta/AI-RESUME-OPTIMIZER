import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import NeonButton from "../components/NeonButton";

export default function NotFound() {
  return (
    <motion.div className="notfound" initial={{opacity:0}} animate={{opacity:1}}>
      <h1 className="big404">404</h1>
      <p>This page doesn't exist in our forge.</p>
      <Link to="/"><NeonButton>Back to Home</NeonButton></Link>
    </motion.div>
  );
}