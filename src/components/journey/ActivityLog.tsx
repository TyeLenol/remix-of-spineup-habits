import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarCheck, Dumbbell, Ruler } from "lucide-react";
import type { ActivityEntry, ActivityKind } from "@/lib/journey-store";

const FILTERS: Array<{ id: "all" | ActivityKind; label: string }> = [
  { id: "all", label: "All" },
  { id: "measurement", label: "Curve" },
  { id: "check-in", label: "Check-ins" },
  { id: "exercise", label: "Stretches" },
];

const ICON: Record<ActivityKind, React.ReactNode> = {
  measurement: <Ruler className="h-4 w-4" aria-hidden />,
  "check-in": <CalendarCheck className="h-4 w-4" aria-hidden />,
  exercise: <Dumbbell className="h-4 w-4" aria-hidden />,
};

const TONE: Record<ActivityKind, string> = {
  measurement: "bg-sage-container text-sage-ink",
  "check-in": "bg-coral-container text-coral-ink",
  exercise: "bg-warm-surface-high text-warm-ink-muted",
};

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<"all" | ActivityKind>("all");

  const shown = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.kind === filter)),
    [entries, filter],
  );

  return (
    <section aria-labelledby="log-heading">
      <h2 id="log-heading" className="font-serif text-xl font-black text-warm-ink">
        Activity log
      </h2>

      <div
        role="group"
        aria-label="Filter activity"
        className="mt-3 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => {
          const on = f.id === filter;
          return (
            <motion.button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.id)}
              whileTap={reduced ? undefined : { scale: 0.94 }}
              transition={{ type: "spring", stiffness: 560, damping: 26 }}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink ${
                on
                  ? "border-transparent bg-sage-ink text-warm-bg"
                  : "border-outline-variant bg-warm-surface text-warm-ink"
              }`}
            >
              {f.label}
            </motion.button>
          );
        })}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {`${shown.length} ${shown.length === 1 ? "entry" : "entries"} shown.`}
      </div>

      {shown.length === 0 ? (
        <p className="mt-4 rounded-[24px] border border-dashed border-outline px-5 py-6 text-sm font-medium text-warm-ink-muted">
          Nothing here yet. Daily check-ins, stretches and curve measurements all land in
          this timeline.
        </p>
      ) : (
        <ol className="relative mt-4 flex flex-col gap-3 pl-6">
          <span
            className="absolute left-[15px] top-2 bottom-2 w-[2px] rounded-full bg-outline-variant"
            aria-hidden
          />
          <AnimatePresence initial={false}>
            {shown.map((e, i) => (
              <motion.li
                key={e.id}
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={
                  reduced
                    ? { duration: 0.2 }
                    : {
                        type: "spring",
                        stiffness: 300,
                        damping: 26,
                        delay: Math.min(i, 8) * 0.03,
                      }
                }
                className="relative rounded-[24px] border border-outline-variant bg-warm-surface px-4 py-4"
              >
                <span
                  className={`absolute -left-6 top-4 grid h-8 w-8 place-items-center rounded-full ring-4 ring-warm-bg ${TONE[e.kind]}`}
                  aria-hidden
                >
                  {ICON[e.kind]}
                </span>
                <p className="text-xs font-bold uppercase tracking-wide text-warm-ink-muted">
                  {fmt(e.date)}
                </p>
                <p className="mt-0.5 font-serif text-lg font-black leading-tight text-warm-ink">
                  {e.title}
                </p>
                <p className="text-sm text-warm-ink-muted">{e.detail}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </section>
  );
}
