import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarDays, ChevronDown, Flame, Activity } from "lucide-react";
import type { Appointment } from "@/lib/today-store";

export function DetailsPanel({
  completedToday,
  streak,
  appointment,
}: {
  completedToday: number;
  streak: number;
  appointment?: Appointment;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const days = appointment
    ? Math.max(
        0,
        Math.ceil(
          (new Date(appointment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  return (
    <section aria-labelledby="details-heading" className="pb-2">
      <h2 id="details-heading" className="sr-only">
        Today's details
      </h2>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-14 w-full items-center justify-between rounded-[24px] border border-outline-variant px-5 text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
      >
        <span className="font-semibold">Today's details</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 26 }}
          aria-hidden
        >
          <ChevronDown className="h-5 w-5 text-warm-ink-muted" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.35, ease: [0.05, 0.7, 0.1, 1] }}
            className="overflow-hidden"
          >
            <dl className="mt-2 grid grid-cols-2 gap-2">
              <Stat
                icon={<Activity className="h-4 w-4" aria-hidden />}
                label="Stretches today"
                value={String(completedToday)}
              />
              <Stat
                icon={<Flame className="h-4 w-4" aria-hidden />}
                label="Active streak"
                value={`${streak} ${streak === 1 ? "day" : "days"}`}
              />
            </dl>
            <div className="mt-2 flex items-center gap-3 rounded-[24px] border border-outline-variant px-5 py-4 text-warm-ink">
              <CalendarDays className="h-5 w-5 shrink-0 text-lavender-ink" aria-hidden />
              <p className="text-sm">
                {appointment
                  ? `${appointment.kind} with ${appointment.doctor} in ${days} ${days === 1 ? "day" : "days"}.`
                  : "No upcoming appointments saved yet."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-warm-surface px-4 py-4 text-warm-ink">
      <dt className="flex items-center gap-2 text-sm text-warm-ink-muted">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 font-serif text-2xl font-black tabular-nums">{value}</dd>
    </div>
  );
}
