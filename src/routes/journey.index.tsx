import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { CobbCard } from "@/components/journey/CobbCard";
import { JourneyStats } from "@/components/journey/JourneyStats";
import { PainTrendCard } from "@/components/journey/PainTrendCard";
import { ActivityLog } from "@/components/journey/ActivityLog";
import { buildActivity, useJourney } from "@/lib/journey-store";
import { streakFrom } from "@/lib/today-store";

export const Route = createFileRoute("/journey/")({
  head: () => ({
    meta: [
      { title: "My journey — SpineUp curve and progress tracking" },
      {
        name: "description",
        content:
          "Track Cobb angle measurements, pain trends and every logged check-in and stretch in one private, on-device timeline.",
      },
      { property: "og:title", content: "My journey — SpineUp curve and progress tracking" },
      {
        property: "og:description",
        content:
          "Cobb angle trends, 14-day pain history and a full activity log for your scoliosis journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const reduced = useReducedMotion();
  const { journey, today, hydrated } = useJourney();

  const activity = useMemo(() => buildActivity(journey, today), [journey, today]);
  const stretches = useMemo(
    () => Object.values(today.completions).reduce((s, ids) => s + ids.length, 0),
    [today.completions],
  );

  const rise = (i: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: {
            type: "spring" as const,
            stiffness: 220,
            damping: 26,
            delay: i * 0.05,
          },
        };

  return (
    <main className="flex flex-col gap-4 px-4 pb-16 pt-6">
      <motion.header {...rise(0)}>
        <Link
          to="/today"
          aria-label="Back to today"
          className="mb-3 inline-grid h-11 w-11 place-items-center rounded-full text-warm-ink-muted outline-offset-2 hover:bg-warm-surface focus-visible:outline-3 focus-visible:outline-sage-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <p className="text-sm font-semibold uppercase tracking-wide text-warm-ink-muted">
          Clinical progress
        </p>
        <h1 className="mt-1 font-serif text-3xl font-black leading-tight text-warm-ink">
          My journey.{" "}
          <span className="italic text-coral-ink">Every degree counts.</span>
        </h1>
      </motion.header>

      <motion.div {...rise(1)}>
        <CobbCard measurements={journey.measurements} />
      </motion.div>

      <motion.div {...rise(2)}>
        <JourneyStats
          measurements={journey.measurements.length}
          checkIns={Object.keys(today.checkIns).length}
          stretches={stretches}
          streak={hydrated ? streakFrom(today) : 0}
        />
      </motion.div>

      <motion.div {...rise(3)}>
        <PainTrendCard today={today} />
      </motion.div>

      <motion.div {...rise(4)} className="mt-2">
        <ActivityLog entries={activity} />
      </motion.div>

      <p className="mt-2 text-xs font-medium text-warm-ink-muted">
        SpineUp is not a diagnostic tool. Measurements are yours to record from your
        clinician's report — everything stays on this device.
      </p>
    </main>
  );
}
