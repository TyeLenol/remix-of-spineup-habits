import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CobbCard } from "@/components/journey/CobbCard";
import { HighlightsRail } from "@/components/journey/HighlightsRail";
import { PrivacyBanner } from "@/components/journey/PrivacyBanner";
import { PainTrendCard } from "@/components/journey/PainTrendCard";
import { ActivityLog } from "@/components/journey/ActivityLog";
import { JourneyFab } from "@/components/journey/JourneyFab";
import { MeasurementSheet } from "@/components/journey/MeasurementSheet";
import { AppointmentSheet } from "@/components/journey/AppointmentSheet";
import { buildActivity, buildHighlights, useJourney } from "@/lib/journey-store";

export const Route = createFileRoute("/journey/")({
  head: () => ({
    meta: [
      { title: "Your history — SpineUp curve and progress tracking" },
      {
        name: "description",
        content:
          "Track Cobb angle measurements, pain trends and every logged check-in, stretch and appointment in one private, on-device timeline.",
      },
      { property: "og:title", content: "Your history — SpineUp curve and progress tracking" },
      {
        property: "og:description",
        content:
          "Cobb angle trends, pain comparison and a full clinical activity log for your scoliosis journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const reduced = useReducedMotion();
  const { journey, today, hydrated, addMeasurement, addAppointment, dismissBanner } =
    useJourney();

  const [fabOpen, setFabOpen] = useState(false);
  const [measureOpen, setMeasureOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const activity = useMemo(() => buildActivity(journey, today), [journey, today]);
  const highlights = useMemo(() => buildHighlights(journey, today), [journey, today]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4000);
  };

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
    <>
      <main className="flex flex-col gap-4 px-4 pb-32 pt-6">
        <motion.header {...rise(0)}>
          <Link
            to="/today"
            aria-label="Back to today"
            className="mb-3 inline-grid h-12 w-12 place-items-center rounded-full text-warm-ink-muted outline-offset-2 hover:bg-warm-surface focus-visible:outline-3 focus-visible:outline-sage-ink"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
          <h1
            aria-label="Your history, one day at a time."
            className="font-serif text-4xl font-black leading-[1.05] text-warm-ink"
          >
            <span aria-hidden>Your history.</span>
            <br />
            <span aria-hidden className="text-2xl italic text-sage-ink">
              one day at a time.
            </span>
          </h1>
        </motion.header>

        <AnimatePresence initial={false}>
          {hydrated && !journey.bannerDismissed && (
            <PrivacyBanner onDismiss={dismissBanner} />
          )}
        </AnimatePresence>

        <motion.div {...rise(1)}>
          <HighlightsRail items={highlights} />
        </motion.div>

        <motion.div {...rise(2)}>
          <CobbCard measurements={journey.measurements} today={today} />
        </motion.div>

        <motion.div {...rise(3)}>
          <PainTrendCard today={today} />
        </motion.div>

        <motion.div {...rise(4)} className="mt-2">
          <ActivityLog entries={activity} />
        </motion.div>

        <p className="mt-2 text-xs font-medium text-warm-ink-muted">
          SpineUp is not a diagnostic tool. Measurements are yours to record from your
          clinician&rsquo;s report — everything stays on this device.
        </p>
      </main>

      <JourneyFab
        open={fabOpen}
        onOpenChange={setFabOpen}
        onLogAngle={() => setMeasureOpen(true)}
        onSchedule={() => setApptOpen(true)}
      />

      <MeasurementSheet
        open={measureOpen}
        onClose={() => setMeasureOpen(false)}
        existing={journey.measurements}
        onSave={(m, duplicate) => {
          addMeasurement(m);
          flash(
            duplicate
              ? "Measurement logged. Note: XP is only awarded for the first log of the day."
              : "Measurement logged.",
          );
        }}
      />

      <AppointmentSheet
        open={apptOpen}
        onClose={() => setApptOpen(false)}
        onSave={(a) => {
          addAppointment(a);
          flash("Appointment saved to your timeline.");
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={
              reduced ? { duration: 0.25 } : { type: "spring", stiffness: 300, damping: 26 }
            }
            className="fixed inset-x-0 bottom-28 z-50 mx-auto w-full max-w-md px-4"
          >
            <p className="rounded-[12px] bg-on-sage px-4 py-3 text-sm font-medium text-sage-container">
              {toast}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
