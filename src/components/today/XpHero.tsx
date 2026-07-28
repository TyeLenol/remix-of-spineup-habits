import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { flatArcPath, wavyArcPath } from "@/components/onboarding/morphShapes";

/**
 * M3 Expressive wavy level arc. The arc springs to the level progress with a
 * slight overshoot; under reduced motion it renders statically.
 */
export function XpHero({
  level,
  title,
  into,
  needed,
  progress,
  totalXp,
  dailyXp,
  dailyGoal,
}: {
  level: number;
  title: string;
  into: number;
  needed: number;
  progress: number;
  totalXp: number;
  dailyXp: number;
  dailyGoal: number;
}) {
  const reduced = useReducedMotion();
  const p = useMotionValue(reduced ? progress : 0);
  const active = useTransform(p, (v) => v < 0.006 ? "" : wavyArcPath(0, v, { R: 70, amp: 4 }));
  const dailyPct = Math.min(1, dailyGoal ? dailyXp / dailyGoal : 0);

  useEffect(() => {
    if (reduced) {
      p.set(progress);
      return;
    }
    const controls = animate(p, progress, {
      type: "spring",
      stiffness: 90,
      damping: 9,
      delay: 0.15,
    });
    return () => controls.stop();
  }, [progress, reduced, p]);

  return (
    <section
      aria-labelledby="xp-heading"
      className="rounded-[28px] bg-sage-container p-5 text-on-sage"
    >
      <div className="flex items-center gap-5">
        <div
          className="relative h-[104px] w-[104px] shrink-0"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={needed}
          aria-valuenow={into}
          aria-valuetext={`${into} of ${needed} XP toward level ${level + 1}`}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-0" aria-hidden>
            <path
              d={flatArcPath(0, 0.999, 100, 100, 70)}
              fill="none"
              stroke="currentColor"
              strokeWidth={12}
              strokeLinecap="round"
              opacity={0.22}
            />
            <motion.path
              d={active}
              fill="none"
              stroke="var(--sage-ink)"
              strokeWidth={16}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl font-black leading-none">{level}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
              level
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <h2 id="xp-heading" className="font-serif text-2xl font-black leading-tight">
            {title}
          </h2>
          <p className="mt-1 text-sm font-medium opacity-90">
            {into} / {needed} XP to level {level + 1}
          </p>
          <p className="text-sm opacity-80">{totalXp} XP earned all time</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between text-sm font-semibold">
          <span>Today's goal</span>
          <span className="tabular-nums">
            {dailyXp} / {dailyGoal} XP
          </span>
        </div>
        <div
          className="mt-2 h-3 overflow-hidden rounded-full bg-on-sage/15"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={dailyGoal}
          aria-valuenow={dailyXp}
          aria-valuetext={`${dailyXp} of ${dailyGoal} daily XP earned`}
        >
          <motion.div
            className="h-full rounded-full bg-sage-ink"
            initial={reduced ? { width: `${dailyPct * 100}%` } : { width: 0 }}
            animate={{ width: `${dailyPct * 100}%` }}
            transition={
              reduced
                ? { duration: 0.3 }
                : { type: "spring", stiffness: 120, damping: 18, delay: 0.2 }
            }
          />
        </div>
      </div>
    </section>
  );
}
