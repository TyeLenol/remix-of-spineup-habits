import { motion, useReducedMotion } from "motion/react";
import { Activity, CalendarCheck, Flame, Ruler } from "lucide-react";

export function JourneyStats({
  measurements,
  checkIns,
  stretches,
  streak,
}: {
  measurements: number;
  checkIns: number;
  stretches: number;
  streak: number;
}) {
  const items = [
    {
      icon: <Flame className="h-4 w-4" aria-hidden />,
      label: "Active streak",
      value: `${streak}d`,
      tone: "coral" as const,
    },
    {
      icon: <CalendarCheck className="h-4 w-4" aria-hidden />,
      label: "Check-ins",
      value: String(checkIns),
      tone: "plain" as const,
    },
    {
      icon: <Activity className="h-4 w-4" aria-hidden />,
      label: "Stretches",
      value: String(stretches),
      tone: "plain" as const,
    },
    {
      icon: <Ruler className="h-4 w-4" aria-hidden />,
      label: "Measurements",
      value: String(measurements),
      tone: "plain" as const,
    },
  ];

  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Journey totals
      </h2>
      <dl className="grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0.3 }
                : { type: "spring", stiffness: 260, damping: 24, delay: i * 0.04 }
            }
            className={`rounded-[24px] px-4 py-4 ${
              it.tone === "coral"
                ? "bg-coral-container text-warm-ink"
                : "border border-outline-variant bg-warm-surface text-warm-ink"
            }`}
          >
            <dt
              className={`flex items-center gap-2 text-sm ${
                it.tone === "coral" ? "text-coral-ink" : "text-warm-ink-muted"
              }`}
            >
              {it.icon}
              {it.label}
            </dt>
            <dd className="mt-1 font-serif text-2xl font-black tabular-nums">{it.value}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
