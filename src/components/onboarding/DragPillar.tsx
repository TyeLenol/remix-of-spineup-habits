import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Spry } from "./Spry";
import { useHaptics } from "./useHaptics";
import { KeycapButton } from "./KeycapButton";

export function DragPillar({ onComplete }: { onComplete: () => void }) {
  const pillarRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [ariaVal, setAriaVal] = useState(0);
  const haptics = useHaptics();

  const fillPct = useTransform(progress, (v) => `${v * 100}%`);
  const knobBottom = useTransform(progress, (v) => `calc(${v * 100}% - 30px)`);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      setAriaVal(Math.round(v * 100));
      if (v >= 0.999 && !done) {
        setDone(true);
        haptics.success();
        setTimeout(onComplete, 900);
      }
    });
    return unsub;
  }, [progress, done, onComplete, haptics]);

  const setFromPointer = (clientY: number) => {
    const el = pillarRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = 1 - Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    progress.set(p);
  };

  const tapFill = () => {
    if (done) return;
    animate(progress, 1, { duration: 0.7, ease: "easeOut" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (done) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      progress.set(Math.min(1, progress.get() + 0.1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      progress.set(Math.max(0, progress.get() - 0.1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tapFill();
    }
  };

  return (
    <div className="flex h-full items-end justify-between gap-6">
      <div className="flex flex-col items-start gap-3 pb-4">
        <motion.p
          animate={{ opacity: done ? 0 : 1 }}
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--warm-ink-muted)" }}
        >
          Drag up to log <span aria-hidden>↑</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
          className="font-serif text-2xl font-black italic"
          style={{ color: "var(--sage-ink)" }}
        >
          STREAK +1!
        </motion.p>
        <KeycapButton tone="surface" onClick={tapFill} aria-label="Tap to log instead of dragging">
          Tap to log
        </KeycapButton>
      </div>

      <div
        ref={pillarRef}
        role="slider"
        tabIndex={0}
        aria-label="Log progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ariaVal}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          setDragging(true);
          setFromPointer(e.clientY);
        }}
        onPointerMove={(e) => {
          if (dragging) setFromPointer(e.clientY);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        className="relative h-[420px] w-16 touch-none overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-4"
        style={{ background: "var(--warm-surface-high)", border: "2px solid var(--md-outline-variant)" }}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{ height: fillPct, background: "var(--coral)" }}
          aria-hidden
        />
        {[0.2, 0.4, 0.6, 0.8].map((t) => (
          <span
            key={t}
            className="absolute left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full"
            style={{ bottom: `${t * 100}%`, background: "oklch(1 0 0 / 0.5)" }}
            aria-hidden
          />
        ))}
        <motion.div
          className="absolute left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full shadow-lg"
          style={{ bottom: knobBottom, background: "var(--warm-bg)", border: "2px solid var(--md-outline-variant)" }}
        >
          <Spry pose={dragging ? "dragging" : done ? "excited" : "idle"} size={54} />
        </motion.div>
      </div>
    </div>
  );
}