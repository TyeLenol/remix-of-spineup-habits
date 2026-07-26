import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useHaptics } from "./useHaptics";

export function ChargeHoldButton({ onComplete }: { onComplete: () => void }) {
  const fill = useMotionValue(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const haptics = useHaptics();

  const width = useTransform(fill, (v) => `${v * 100}%`);

  useEffect(() => {
    if (done) return;
    controlsRef.current?.stop();
    controlsRef.current = animate(fill, holding ? 1 : 0, {
      duration: holding ? 1.2 : 0.4,
      ease: holding ? "easeOut" : "easeIn",
      onComplete: () => {
        if (holding && fill.get() >= 0.999 && !done) {
          setDone(true);
          haptics.success();
          setTimeout(onComplete, 350);
        }
      },
    });
  }, [holding, done, fill, onComplete, haptics]);

  const trigger = () => {
    if (done) return;
    setDone(true);
    animate(fill, 1, { duration: 0.4, ease: "easeOut" });
    haptics.success();
    setTimeout(onComplete, 400);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--warm-ink-muted)" }}>
        Press and hold to start
      </p>
      <div className="relative">
        <div className="absolute inset-0 rounded-full" style={{ background: "var(--sage-ink)", transform: "translateY(6px)" }} aria-hidden />
        <motion.button
          type="button"
          onPointerDown={() => setHolding(true)}
          onPointerUp={() => setHolding(false)}
          onPointerLeave={() => setHolding(false)}
          onPointerCancel={() => setHolding(false)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              trigger();
            }
          }}
          whileTap={{ y: 4 }}
          className="relative flex min-h-16 min-w-[220px] items-center justify-center overflow-hidden rounded-full px-10 text-lg font-black tracking-wide focus-visible:outline-none focus-visible:ring-4"
          style={{ background: "var(--warm-surface-high)", color: "var(--warm-ink)" }}
          aria-label="Charge up to continue. Press and hold, or activate to skip the hold."
        >
          <motion.span
            className="absolute inset-y-0 left-0"
            style={{ width, background: "var(--sage)" }}
            aria-hidden
          />
          <span className="relative flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
            </svg>
            READY
          </span>
        </motion.button>
      </div>
      <button
        type="button"
        onClick={trigger}
        className="rounded text-xs font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2"
        style={{ color: "var(--warm-ink-muted)" }}
      >
        or tap to continue
      </button>
    </div>
  );
}