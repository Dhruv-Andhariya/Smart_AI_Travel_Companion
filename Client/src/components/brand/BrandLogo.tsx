import { motion } from "framer-motion";
import { logoStroke } from "@/lib/brand";

type BrandLogoProps = {
  size?: number;
  animated?: boolean;
  theme?: "dark" | "light";
  showWordmark?: boolean;
};

export default function BrandLogo({ size = 44, animated = true, theme = "light", showWordmark = true }: BrandLogoProps) {
  const stroke = theme === "dark" ? "#F8FBFF" : "#0F172A";

  return (
    <div className="flex items-center gap-3">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="trip-ai-mark" x1="12" y1="12" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <motion.path
          d={logoStroke[0]}
          stroke="url(#trip-ai-mark)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        {logoStroke.slice(1).map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke={stroke}
            strokeOpacity={index === 0 ? 0.28 : 0.22}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.08 + index * 0.04 }}
          />
        ))}
        <motion.circle
          cx="43"
          cy="18"
          r="3.1"
          fill="#06B6D4"
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.95, ease: [0.34, 1.56, 0.64, 1] }}
        />
        <motion.circle
          cx="48"
          cy="28"
          r="2.1"
          fill="#8B5CF6"
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 1.04, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </motion.svg>
      {showWordmark ? (
        <motion.div
          initial={animated ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 1.05 }}
          className="leading-none"
        >
          <div className="flex items-start gap-1 font-display text-[1.1rem] font-bold tracking-[-0.04em] text-[var(--text-primary)] md:text-[1.25rem]">
            <span>Trip</span>
            <span className="relative -top-1 text-[0.72em] text-[var(--accent-violet)] shadow-[0_0_18px_rgba(139,92,246,0.28)]">
              AI
              <span className="absolute inset-0 -z-10 rounded-full bg-[rgba(6,182,212,0.1)] blur-md" />
            </span>
          </div>
          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.28em] text-[var(--text-tertiary)]">Intelligent travel routing</p>
        </motion.div>
      ) : null}
    </div>
  );
}