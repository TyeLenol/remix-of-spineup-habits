import { motion, useReducedMotion } from "motion/react";
import { painSeries } from "@/lib/journey-store";
import type { TodayState } from "@/lib/today-store";

const W = 320;
const H = 90;

export function PainTrendCard({ today }: { today: TodayState }) {
  const reduced = useReducedMotion();
  const days = painSeries(today, 14);
  const logged = days.filter((d) => d.pain !== null) as Array<{
    date: string;
    pain: number;
  }>;
  const avg =
    logged.length > 0
      ? Math.round((logged.reduce((s, d) => s + d.pain, 0) / logged.length) * 10) / 10
      : null;

  const barW = W / days.length;

  return (
    <section
      aria-labelledby="pain-heading"
      className="rounded-[28px] border border-outline-variant bg-warm-surface p-5 text-warm-ink"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="pain-heading" className="font-serif text-xl font-black">
          Pain, last 14 days
        </h2>
        <p className="text-sm font-bold tabular-nums text-coral-ink">
          {avg === null ? "No data" : `avg ${avg}/10`}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full"
        role="img"
        aria-label={
          logged.length === 0
            ? "No pain scores logged in the last 14 days."
            : `Daily pain scores: ${logged
                .map(
                  (d) =>
                    `${new Date(`${d.date}T00:00:00`).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })} ${d.pain} out of 10`,
                )
                .join(", ")}`
        }
      >
        <line
          x1={0}
          x2={W}
          y1={H - 10}
          y2={H - 10}
          stroke="var(--md-outline-variant)"
          strokeWidth={2}
        />
        {days.map((d, i) => {
          const h = d.pain === null ? 4 : 6 + (d.pain / 10) * (H - 24);
          return (
            <motion.rect
              key={d.date}
              x={i * barW + barW * 0.22}
              width={barW * 0.56}
              rx={barW * 0.28}
              y={H - 10 - h}
              height={h}
              fill={d.pain === null ? "var(--md-outline-variant)" : "var(--coral)"}
              initial={reduced ? { opacity: 0 } : { scaleY: 0 }}
              animate={reduced ? { opacity: 1 } : { scaleY: 1 }}
              style={{ originY: 1, transformBox: "fill-box" }}
              transition={
                reduced
                  ? { duration: 0.3 }
                  : { type: "spring", stiffness: 320, damping: 20, delay: i * 0.025 }
              }
            />
          );
        })}
      </svg>
      <p className="mt-1 text-xs font-medium text-warm-ink-muted">
        Faded bars are days without a check-in.
      </p>
    </section>
  );
}
