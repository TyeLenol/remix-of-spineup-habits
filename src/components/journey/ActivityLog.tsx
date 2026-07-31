import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarCheck, Dumbbell, NotebookPen, Ruler } from "lucide-react";
import type { ActivityEntry, ActivityKind } from "@/lib/journey-store";

const FILTERS: Array<{ id: "all" | ActivityKind; label: string }> = [
  { id: "all", label: "All" },
  { id: "exercise", label: "Exercises" },
  { id: "check-in", label: "Journal" },
  { id: "measurement", label: "Cobb angle" },
  { id: "appointment", label: "Appointments" },
];

const ICON: Record<ActivityKind, React.ReactNode> = {
  measurement: <Ruler className="h-4 w-4" aria-hidden />,
  "check-in": <NotebookPen className="h-4 w-4" aria-hidden />,
  exercise: <Dumbbell className="h-4 w-4" aria-hidden />,
  appointment: <CalendarCheck className="h-4 w-4" aria-hidden />,
};

const TONE: Record<ActivityKind, string> = {
  measurement: "bg-sage-container text-sage-ink",
  "check-in": "bg-coral-container text-coral-ink",
  exercise: "bg-sage-container text-sage-ink",
  appointment: "bg-warm-bg text-warm-ink-muted ring-1 ring-inset ring-outline",
};

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

function dayLabel(date: string) {
  const now = new Date();
  const today = iso(now);
  now.setDate(now.getDate() - 1);
  const yesterday = iso(now);
  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<"all" | ActivityKind>("all");

  const groups = useMemo(() => {
    const shown =
      filter === "all" ? entries : entries.filter((e) => e.kind === filter);
    const map = new Map<string, ActivityEntry[]>();
    for (const e of shown) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return { count: shown.length, days: [...map.entries()] };
  }, [entries, filter]);

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
              whileTap={reduced ? undefined : { scale: 0.94, borderRadius: 14 }}
              transition={{ type: "spring", stiffness: 560, damping: 26 }}
              className={`min-h-12 rounded-full border px-4 text-sm font-bold outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink ${
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
        {`${groups.count} ${groups.count === 1 ? "entry" : "entries"} shown.`}
      </div>

      {groups.count === 0 ? (
        <p className="mt-4 rounded-[24px] border border-dashed border-outline px-5 py-6 text-sm font-medium text-warm-ink-muted">
          Nothing here yet. Check-ins, stretches, appointments and curve measurements all
          land in this timeline.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-5">
          {groups.days.map(([date, list], gi) => (
            <div key={date}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-warm-ink-muted">
                {dayLabel(date)}
              </h3>
              <ol className="relative mt-2 flex flex-col gap-3 pl-10">
                <span
                  className="absolute left-[19px] top-2 bottom-2 w-[2px] rounded-full bg-outline-variant"
                  aria-hidden
                />
                <AnimatePresence initial={false}>
                  {list.map((e, i) => (
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
                              delay: Math.min(gi * 2 + i, 8) * 0.03,
                            }
                      }
                      className={`relative rounded-[12px] px-4 py-3 ${
                        e.kind === "appointment"
                          ? "border border-outline bg-transparent"
                          : "border border-outline-variant bg-warm-surface"
                      }`}
                    >
                      <span
                        className={`absolute -left-9 top-3 grid h-8 w-8 place-items-center rounded-full ring-4 ring-warm-bg ${TONE[e.kind]}`}
                        aria-hidden
                      >
                        {ICON[e.kind]}
                      </span>
                      <p className="font-serif text-base font-black leading-tight text-warm-ink">
                        {e.title}
                      </p>
                      <p className="text-sm text-warm-ink-muted">{e.detail}</p>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
