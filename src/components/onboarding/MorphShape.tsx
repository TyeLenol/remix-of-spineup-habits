import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { morphPath, wavyArcPath, flatArcPath } from "./morphShapes";

type Props = {
  /** 0 = blob, 1 = ring, 2 = burst, 3 = shield */
  index: number;
  fill: string;
  accent: string;
  /** ring progress 0..1, only rendered on the ring screen */
  progress?: number;
  overshoot?: boolean;
  size?: number;
};

export function MorphShape({ index, fill, accent, progress, overshoot = true, size = 300 }: Props) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(index);
  const d = useTransform(mv, (v) => morphPath(v));
  const first = useRef(true);

  useEffect(() => {
    if (reduced) {
      mv.set(index);
      return;
    }
    if (first.current) {
      first.current = false;
      mv.set(index);
      return;
    }
    const controls = animate(mv, index, {
      type: "spring",
      stiffness: overshoot ? 140 : 120,
      damping: overshoot ? 12 : 26,
      mass: 1,
    });
    return () => controls.stop();
  }, [index, overshoot, reduced, mv]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        aria-hidden
        initial={reduced ? { opacity: 0 } : false}
        animate={reduced ? { opacity: 1 } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.path d={d} fill={fill} fillRule="evenodd" />
        {progress !== undefined && (
          <WavyRingFill progress={progress} color={accent} overshoot={overshoot} />
        )}
      </motion.svg>
    </div>
  );
}

/** M3-Expressive wavy progress: rippled active arc + flat remaining track. */
function WavyRingFill({
  progress,
  color,
  overshoot,
}: {
  progress: number;
  color: string;
  overshoot: boolean;
}) {
  const reduced = useReducedMotion();
  const p = useMotionValue(reduced ? progress : 0);
  const phase = useMotionValue(0);

  const active = useTransform([p, phase], ([v, ph]) =>
    wavyArcPath(0, v as number, { phase: ph as number }),
  );
  const track = useTransform(p, (v) => flatArcPath(Math.min(v + 0.02, 1), 1));

  useEffect(() => {
    if (reduced) {
      p.set(progress);
      return;
    }
    const controls = animate(p, progress, {
      type: "spring",
      stiffness: overshoot ? 90 : 120,
      damping: overshoot ? 7.5 : 24,
      mass: 1,
      delay: 0.25,
    });
    return () => controls.stop();
  }, [progress, overshoot, reduced, p]);

  useAnimationFrame((t) => {
    if (reduced) return;
    phase.set((t / 1000) * 1.6);
  });

  return (
    <g fill="none" strokeLinecap="round">
      <motion.path
        d={track}
        stroke={color}
        strokeWidth={10}
        opacity={0.28}
        initial={reduced ? { opacity: 0 } : false}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 0.4 }}
      />
      <motion.path
        d={active}
        stroke={color}
        strokeWidth={14}
        initial={reduced ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </g>
  );
}

/** Slow, calm breathing loop — no spring, no overshoot. */
export function Breathing({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      animate={{ scale: [1, 1.055, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Odometer-style count-up with a spring scale-bounce on landing. */
export function CountUp({ to, color }: { to: number; color: string }) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);
  const scale = useMotionValue(1);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.2, 0, 0, 1],
      onUpdate: (v) => setValue(Math.round(v)),
      onComplete: () => {
        animate(scale, [1, 1.18, 1], { type: "spring", stiffness: 320, damping: 9 });
      },
    });
    return () => controls.stop();
  }, [to, reduced, scale]);

  return (
    <motion.span
      style={{ scale, color }}
      className="font-serif text-5xl font-black tabular-nums"
    >
      +{value}
    </motion.span>
  );
}
