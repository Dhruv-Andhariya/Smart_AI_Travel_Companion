export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[var(--bg-glass)] py-10 backdrop-blur-xl">
      <div className="container-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl text-[var(--text-primary)]">Trip AI</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Cinematic travel planning for modern teams and solo explorers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
          <span>Designed for premium travel workflows</span>
          <span>•</span>
          <span>React + Vite + Framer Motion</span>
          <span>•</span>
          <span>Accessible and responsive</span>
        </div>
      </div>
    </footer>
  );
}