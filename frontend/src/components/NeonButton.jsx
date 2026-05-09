import { motion } from "framer-motion";

export default function NeonButton({ children, onClick, type = "button", variant = "primary", ...rest }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      type={type}
      onClick={onClick}
      className={`neon-btn neon-${variant}`}
      {...rest}
    >
      <span>{children}</span>
    </motion.button>
  );
}