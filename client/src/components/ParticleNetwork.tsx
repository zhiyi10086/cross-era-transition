/**
 * 《跨时代过渡》· Canvas 粒子网络
 * 设计提醒：拖动不是装饰。用户向右拖动时，粒子频率、流线亮度和网格连接都会被显著加速，
 * 以可见方式证明从中心化到网络的进度由用户参与推动。
 */
import { useEffect, useRef } from "react";

type ParticleNetworkProps = { progress: number; motionBoost: number };
type Point = { x: number; y: number };

const particleSeeds = Array.from({ length: 82 }, (_, index) => ({
  x: ((index * 47 + 19) % 97) / 100,
  y: ((index * 29 + 37) % 89) / 100,
  radius: 1.1 + ((index * 13) % 13) / 10,
  phase: index * 0.63,
  cluster: index % 4,
}));

const clusterAnchors: Point[] = [
  { x: 0.3, y: 0.32 },
  { x: 0.7, y: 0.31 },
  { x: 0.44, y: 0.7 },
  { x: 0.77, y: 0.7 },
];

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const ease = (value: number) => value * value * (3 - 2 * value);

function getPoint(seed: (typeof particleSeeds)[number], progress: number, clock: number): Point {
  const centralToMulti = ease(Math.min(progress / 34, 1));
  const multiToOpen = ease(Math.max(0, Math.min((progress - 34) / 66, 1)));
  const anchor = clusterAnchors[seed.cluster];
  const multiX = anchor.x + (seed.x - 0.5) * 0.22;
  const multiY = anchor.y + (seed.y - 0.5) * 0.2;
  const drift = Math.sin(clock * 0.00055 + seed.phase) * (0.004 + multiToOpen * 0.005);
  return {
    x: lerp(lerp(0.5, multiX, centralToMulti), seed.x, multiToOpen) + drift,
    y: lerp(lerp(0.5, multiY, centralToMulti), seed.y, multiToOpen) + Math.cos(clock * 0.00046 + seed.phase) * 0.004,
  };
}

export function ParticleNetwork({ progress, motionBoost }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const speed = 1 + motionBoost * 4.2;
      const clock = time * speed;
      context.clearRect(0, 0, width, height);
      const current = particleSeeds.map((seed) => {
        const point = getPoint(seed, progress, clock);
        return { ...seed, x: point.x * width, y: point.y * height };
      });
      const openNetwork = Math.max(0, Math.min((progress - 42) / 58, 1));
      const multiNetwork = Math.max(0, Math.min(progress / 55, 1));
      const maxDistance = lerp(54, 94, openNetwork);

      context.lineWidth = 0.7 + motionBoost * 0.7;
      for (let index = 0; index < current.length; index += 1) {
        for (let neighbor = index + 1; neighbor < current.length; neighbor += 1) {
          const point = current[index];
          const other = current[neighbor];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < maxDistance && (openNetwork > 0.35 || point.cluster === other.cluster || index % 7 === 0)) {
            const alpha = (1 - distance / maxDistance) * (0.08 + openNetwork * 0.25 + multiNetwork * 0.08 + motionBoost * 0.22);
            context.strokeStyle = `rgba(${progress > 66 ? "85, 235, 219" : "178, 164, 255"}, ${alpha})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const coreRadius = lerp(20, 6, Math.min(progress / 34, 1));
      const coreGradient = context.createRadialGradient(centerX, centerY, 1, centerX, centerY, coreRadius * (4 + motionBoost * 2));
      coreGradient.addColorStop(0, "rgba(232,255,255,.95)");
      coreGradient.addColorStop(0.2, "rgba(87,229,219,.6)");
      coreGradient.addColorStop(1, "rgba(87,229,219,0)");
      context.fillStyle = coreGradient;
      context.beginPath();
      context.arc(centerX, centerY, coreRadius * (1 + Math.sin(clock * 0.003) * (0.08 + motionBoost * 0.18)), 0, Math.PI * 2);
      context.fill();

      current.forEach((point) => {
        const scale = 0.85 + Math.sin(clock * 0.002 + point.phase) * (0.22 + motionBoost * 0.2);
        context.fillStyle = progress > 66 ? "rgba(111,248,235,.92)" : "rgba(198,190,255,.85)";
        context.beginPath();
        context.arc(point.x, point.y, point.radius * scale, 0, Math.PI * 2);
        context.fill();
      });
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    frame = window.requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [motionBoost, progress]);

  return <canvas ref={canvasRef} className="particle-network-canvas" data-motion-boost={motionBoost.toFixed(2)} aria-hidden="true" />;
}
