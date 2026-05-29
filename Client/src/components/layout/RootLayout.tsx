import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function RootLayout() {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("tripai-theme", "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-80" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-[rgba(139,92,246,0.14)] blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6rem] top-36 h-96 w-96 rounded-full bg-[rgba(6,182,212,0.12)] blur-3xl"
        animate={{ x: [0, -16, 0], y: [0, 14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed bottom-5 left-5 z-50 rounded-full border border-[var(--border-soft)] bg-[var(--bg-glass)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-xl transition-transform duration-[var(--dur-base)] hover:-translate-y-0.5"
      >
        {theme === "dark" ? "Light" : "Dark"} mode
      </button>
      <Outlet />
    </div>
  );
}