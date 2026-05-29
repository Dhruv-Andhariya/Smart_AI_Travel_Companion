export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const staggerStrong = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 0px rgba(139,92,246,0)",
      "0 0 24px rgba(139,92,246,0.4)",
      "0 0 0px rgba(139,92,246,0)",
    ],
    transition: { duration: 2.5, repeat: Infinity },
  },
};

export const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.01 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

export const floatingOrb = (delay = 0) => ({
  animate: {
    y: [0, -18, 0],
    x: [0, 6, 0],
    scale: [1, 1.04, 1],
    transition: {
      duration: 10 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  },
});

export const routeDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
  },
};