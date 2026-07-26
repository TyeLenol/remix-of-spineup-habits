import { motion } from "motion/react";

type Composition = "screen1" | "screen2" | "screen3" | "screen4";

export function LivingBackground({ composition }: { composition: Composition }) {
  const config = COMPOSITIONS[composition];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: config.baseGradient }} />
      {config.blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: b.color,
            opacity: b.opacity,
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: 18 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {config.shapes.map((s, i) => (
        <motion.div
          key={`s-${i}`}
          className="absolute"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background: s.color,
            borderRadius: s.radius,
            transform: `rotate(${s.rotate}deg)`,
          }}
          animate={{ y: [0, -14, 0], rotate: [s.rotate, s.rotate + 18, s.rotate] }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const COMPOSITIONS: Record<Composition, {
  baseGradient: string;
  blobs: Array<{ x: string; y: string; size: string; color: string; opacity: number }>;
  shapes: Array<{ x: string; y: string; size: string; color: string; radius: string; rotate: number }>;
}> = {
  screen1: {
    baseGradient: "linear-gradient(180deg, var(--warm-bg), var(--warm-surface))",
    blobs: [
      { x: "-15%", y: "10%", size: "70vw", color: "var(--coral)", opacity: 0.55 },
      { x: "40%", y: "50%", size: "80vw", color: "var(--lavender)", opacity: 0.45 },
    ],
    shapes: [
      { x: "70%", y: "18%", size: "72px", color: "var(--sage)", radius: "28% 72% 30% 70%", rotate: 15 },
      { x: "12%", y: "62%", size: "56px", color: "var(--lavender-ink)", radius: "50%", rotate: 0 },
    ],
  },
  screen2: {
    baseGradient: "linear-gradient(180deg, var(--warm-surface), var(--warm-bg))",
    blobs: [
      { x: "55%", y: "60%", size: "85vw", color: "var(--coral)", opacity: 0.4 },
      { x: "-25%", y: "-15%", size: "60vw", color: "var(--sage)", opacity: 0.4 },
    ],
    shapes: [
      { x: "8%", y: "12%", size: "60px", color: "var(--lavender)", radius: "38% 62% 55% 45%", rotate: -12 },
      { x: "78%", y: "80%", size: "44px", color: "var(--sage-ink)", radius: "30%", rotate: 22 },
    ],
  },
  screen3: {
    baseGradient: "linear-gradient(180deg, var(--warm-bg), var(--warm-surface-high))",
    blobs: [
      { x: "-10%", y: "70%", size: "70vw", color: "var(--lavender)", opacity: 0.5 },
      { x: "60%", y: "-10%", size: "60vw", color: "var(--coral)", opacity: 0.45 },
    ],
    shapes: [
      { x: "78%", y: "58%", size: "50px", color: "var(--sage)", radius: "28% 72% 30% 70%", rotate: 8 },
      { x: "10%", y: "22%", size: "40px", color: "var(--coral-ink)", radius: "50%", rotate: 0 },
    ],
  },
  screen4: {
    baseGradient: "linear-gradient(180deg, var(--warm-surface), var(--warm-bg))",
    blobs: [
      { x: "20%", y: "40%", size: "80vw", color: "var(--sage)", opacity: 0.35 },
      { x: "-20%", y: "80%", size: "60vw", color: "var(--lavender)", opacity: 0.35 },
    ],
    shapes: [],
  },
};