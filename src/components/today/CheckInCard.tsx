import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, NotebookPen } from "lucide-react";
import { MOODS, type CheckIn } from "@/lib/today-store";

export function CheckInCard({ checkIn }: { checkIn?: CheckIn }) {
  const reduced = useReducedMotion();
  const mood = checkIn ? MOODS.find((m) => m.id === checkIn.mood) : undefined;
  const summary = checkIn
    ? [
        `Pain ${checkIn.pain}/10`,
        mood?.label,
        checkIn.braceHours !== undefined ? `Brace ${checkIn.braceHours}h` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "Not logged yet";

  return (
    <section aria-labelledby="checkin-heading">
      <h2 id="checkin-heading" className="sr-only">
        Daily check-in
      </h2>
      <motion.div
        whileTap={reduced ? undefined : { scale: 0.98, borderRadius: 20 }}
        whileHover={reduced ? undefined : { scale: 1.008 }}
        transition={{ type: "spring", stiffness: 560, damping: 26 }}
        className="rounded-[28px]"
      >
        <Link
          to="/today/check-in"
          className="flex min-h-16 items-center gap-4 rounded-[28px] border border-outline-variant bg-warm-surface px-5 py-4 text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-lavender-ink"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lavender-container text-lavender-ink"
            aria-hidden
          >
            <NotebookPen className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-lg font-black leading-tight">
              {checkIn ? "Today's check-in" : "How is today going?"}
            </span>
            <span className="block truncate text-sm text-warm-ink-muted">{summary}</span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-warm-ink-muted" aria-hidden />
        </Link>
      </motion.div>
    </section>
  );
}
