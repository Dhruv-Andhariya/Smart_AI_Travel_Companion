import { useEffect, useRef } from "react";

type Point = { x: number; y: number; vx: number; vy: number; r: number };

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const points: Point[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      points.length = 0;
      const count = Math.min(120, Math.max(54, Math.floor(window.innerWidth / 12)));
      for (let index = 0; index < count; index += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 2.8 + 1.1,
        });
      }
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255,247,216,0.08)";
      context.fillRect(0, 0, width, height);

      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        context.beginPath();
        const hue = (point.x / width) * 360;
        context.fillStyle = `hsla(${hue}, 85%, 60%, 0.9)`;
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();
      }

      for (let index = 0; index < points.length; index += 1) {
        const current = points[index];
        for (let neighborIndex = index + 1; neighborIndex < points.length; neighborIndex += 1) {
          const neighbor = points[neighborIndex];
          const distance = Math.hypot(current.x - neighbor.x, current.y - neighbor.y);
          if (distance < 180 * window.devicePixelRatio) {
            const alpha = 0.28 - distance / (180 * window.devicePixelRatio) * 0.22;
            context.strokeStyle = `rgba(139,92,246,${Math.max(0.02, alpha)})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(current.x, current.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.stroke();
          }
        }
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-100 mix-blend-multiply" aria-hidden="true" />;
}