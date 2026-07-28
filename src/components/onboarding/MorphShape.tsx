import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { morphPath } from "./morphShapes";

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
          <RingFill progress={progress} color={accent} overshoot={overshoot} />
        )}
      </motion.svg>
    </div>
  );
}

function RingFill({
  progress,
  color,
  overshoot,
}: {
  progress: number;
  color: string;
  overshoot: boolean;
}) {
  const reduced = useReducedMotion();
  const R = 63.5;
  const C = 2 * Math.PI * R;
  const mv = useMotionValue(reduced ? progress : 0);
  const offset = useTransform(mv, (v) => C * (1 - v));

  useEffect(() => {
    if (reduced) {
      mv.set(progress);
      return;
    }
    const controls = animate(mv, progress, {
      type: "spring",
      stiffness: overshoot ? 90 : 120,
      damping: overshoot ? 7.5 : 24,
      mass: 1,
      delay: 0.25,
    });
    return () => controls.stop();
  }, [progress, overshoot, reduced, mv]);

  return (
    <motion.circle
      cx={100}
      cy={100}
      r={R}
      fill="none"
      stroke={color}
      strokeWidth={16}
      strokeLinecap="round"
      strokeDasharray={C}
      style={{ strokeDashoffset: offset }}
      transform="rotate(-90 100 100)"
      initial={reduced ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    />
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
