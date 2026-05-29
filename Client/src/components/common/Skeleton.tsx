export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-[var(--radius-lg)] bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.12),rgba(255,255,255,0.04))] ${className}`} />;
}