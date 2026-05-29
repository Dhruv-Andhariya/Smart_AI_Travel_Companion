import { motion } from "framer-motion";
import { useState } from "react";

type MagneticButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

export default function MagneticButton({ children, onClick, variant = "primary", className = "", type = "button" }: MagneticButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const base =
    variant === "primary"
      ? "bg-[linear-gradient(135deg,rgba(10,38,75,0.96),rgba(18,61,114,0.92))] text-[rgba(255,255,255,0.98)] shadow-[0_12px_30px_rgba(10,38,75,0.26)] ring-1 ring-[rgba(255,255,255,0.28)]"
      : variant === "secondary"
        ? "border border-[var(--border-soft)] bg-[var(--bg-glass)] text-[var(--text-primary)]"
        : "text-[var(--text-primary)]";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
        setOffset({ x: (event.clientX - rect.left - rect.width / 2) / 10, y: (event.clientY - rect.top - rect.height / 2) / 10 });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      whileTap={{ scale: 0.98 }}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-[var(--dur-fast)] ${base} ${className}`}
    >
      {children}
    </motion.button>
  );
}