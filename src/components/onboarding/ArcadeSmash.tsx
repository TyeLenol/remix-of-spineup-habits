import { motion, useMotionValue, animate } from "motion/react";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { Spry } from "./Spry";
import { useHaptics } from "./useHaptics";

export function ArcadeSmash({ onComplete }: { onComplete: () => void }) {
  const [fired, setFired] = useState(false);
  const [xp, setXp] = useState(0);
  const value = useMotionValue(0);
  const haptics = useHaptics();

  useEffect(() => {
    if (!fired) return;
    const controls = animate(value, 150, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setXp(Math.round(v)),
      onComplete: () => {
        haptics.success();
        setTimeout(onComplete, 700);
      },
    });
    return () => controls.stop();
  }, [fired, value, onComplete, haptics]);

  const fire = () => {
    if (fired) return;
    setFired(true);
    haptics.tick();
  };

  const confetti = Array.from({ length: 14 });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <Spry pose={fired ? "excited" : "idle"} size={180} />
        {fired &&
          confetti.map((_, i) => {
            const angle = (i / confetti.length) * Math.PI * 2;
            const dist = 120 + Math.random() * 40;
            const colors = ["var(--sage)", "var(--coral)", "var(--lavender)"];
            const shapes = ["50%", "20%", "0"];
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-3 w-3"
                style={{
                  background: colors[i % colors.length],
                  borderRadius: shapes[i % shapes.length],
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: 0,
                  scale: 0.4,
                  rotate: 360,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            );
          })}
      </div>

      <motion.div
        animate={fired ? { boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 40px var(--sage)", "0 0 0 rgba(0,0,0,0)"] } : {}}
        transition={{ duration: 0.8 }}
        className="rounded-2xl px-6 py-3 font-mono text-3xl font-black tabular-nums"
        style={{
          background: "var(--warm-ink)",
          color: "var(--sage)",
          letterSpacing: "0.15em",
          border: "2px solid var(--sage-ink)",
        }}
        aria-live="polite"
      >
        {String(xp).padStart(4, "0")} XP
      </motion.div>

      <div className="relative">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ background: "var(--lavender-ink)", transform: "translateY(8px)" }}
          aria-hidden
        />
        <motion.button
          type="button"
          onClick={fire}
          whileTap={{ y: 8 }}
          disabled={fired}
          aria-label="Log brace time and earn XP"
          className="relative flex min-h-16 min-w-[260px] items-center justify-center gap-3 rounded-3xl px-8 text-lg font-black tracking-wide focus-visible:outline-none focus-visible:ring-4"
          style={{ background: "var(--lavender)", color: "var(--on-lavender)" }}
        >
          <Activity className="h-6 w-6" strokeWidth={3} />
          LOG BRACE TIME
        </motion.button>
      </div>
    </div>
  );
}