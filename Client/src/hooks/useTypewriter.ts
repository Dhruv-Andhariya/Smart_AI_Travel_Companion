import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 18, pause = 900) {
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setIndex(0);
    setShowCursor(true);

    let timeoutId: number | undefined;

    const tick = () => {
      timeoutId = window.setTimeout(() => {
        setIndex((current) => {
          if (current >= text.length) {
            window.setTimeout(() => setShowCursor(false), pause);
            return current;
          }

          return current + 1;
        });

        if (timeoutId) {
          tick();
        }
      }, speed);
    };

    tick();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [text, speed, pause]);

  return {
    text: text.slice(0, index),
    isComplete: index >= text.length,
    showCursor,
  };
}