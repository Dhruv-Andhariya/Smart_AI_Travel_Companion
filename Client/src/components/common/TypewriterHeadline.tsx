import { useMemo } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";

type TypewriterHeadlineProps = {
  words: string[];
  label?: string;
};

export default function TypewriterHeadline({ words, label = "AI-powered trip planning" }: TypewriterHeadlineProps) {
  const phrase = useMemo(() => words.join(" • "), [words]);
  const { text, showCursor } = useTypewriter(phrase, 18, 1100);

  return (
    <div className="space-y-4 text-center">
      <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">{label}</p>
      <h1 className="font-display text-5xl font-semibold tracking-[-0.06em] text-[var(--text-primary)] md:text-7xl">
        <span className="text-[rgba(10,38,75,0.96)]">{text}</span>
        <span className={`type-cursor ml-1 text-[var(--accent-cyan)] ${showCursor ? "opacity-100" : "opacity-0"}`}>|</span>
      </h1>
    </div>
  );
}