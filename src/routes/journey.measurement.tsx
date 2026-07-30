import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { REGIONS, useJourney, type CurveRegion } from "@/lib/journey-store";
import { todayKey } from "@/lib/today-store";

export const Route = createFileRoute("/journey/measurement")({
  head: () => ({
    meta: [
      { title: "Add a curve measurement — SpineUp" },
      {
        name: "description",
        content:
          "Record a Cobb angle from your clinician's report: region, degrees, date and notes — stored privately on your device.",
      },
      { property: "og:title", content: "Add a curve measurement — SpineUp" },
      {
        property: "og:description",
        content: "Log a Cobb angle measurement into your private SpineUp journey timeline.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MeasurementPage,
});

function MeasurementPage() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const { addMeasurement } = useJourney();

  const [date, setDate] = useState(todayKey());
  const [region, setRegion] = useState<CurveRegion>("thoracic");
  const [degrees, setDegrees] = useState(25);
  const [clinician, setClinician] = useState("");
  const [notes, setNotes] = useState("");

  const save = () => {
    addMeasurement({
      date,
      region,
      degrees,
      clinician: clinician.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    navigate({ to: "/journey" });
  };

  return (
    <main className="flex flex-col gap-4 px-4 pb-16 pt-6">
      <header>
        <Link
          to="/journey"
          aria-label="Back to my journey"
          className="mb-3 inline-grid h-11 w-11 place-items-center rounded-full text-warm-ink-muted outline-offset-2 hover:bg-warm-surface focus-visible:outline-3 focus-visible:outline-sage-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <h1 className="font-serif text-3xl font-black leading-tight text-warm-ink">
          New measurement.
        </h1>
        <p className="mt-1 text-sm text-warm-ink-muted">
          Copy the Cobb angle from your X-ray or clinic report.
        </p>
      </header>

      <Card>
        <Label htmlFor="date">Date of scan</Label>
        <input
          id="date"
          type="date"
          value={date}
          max={todayKey()}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 min-h-12 w-full rounded-2xl border border-outline-variant bg-warm-bg px-4 text-base font-semibold text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
        />
      </Card>

      <Card>
        <fieldset>
          <legend className="font-serif text-lg font-black text-warm-ink">Region</legend>
          <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Curve region">
            {REGIONS.map((r) => {
              const on = r.id === region;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setRegion(r.id)}
                  className={`min-h-12 flex-1 rounded-full border px-3 text-sm font-bold outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink ${
                    on
                      ? "border-transparent bg-sage-ink text-warm-bg"
                      : "border-outline-variant bg-warm-bg text-warm-ink"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </Card>

      <Card>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="degrees">Cobb angle</Label>
          <span className="font-serif text-3xl font-black tabular-nums text-warm-ink">
            {degrees}
            <span className="text-base font-semibold text-warm-ink-muted">°</span>
          </span>
        </div>
        <input
          id="degrees"
          type="range"
          min={0}
          max={90}
          value={degrees}
          onChange={(e) => setDegrees(Number(e.target.value))}
          aria-valuetext={`${degrees} degrees`}
          className="mt-2 h-11 w-full accent-[var(--sage-ink)]"
        />
        <p className="text-xs font-medium text-warm-ink-muted">
          Under 10° is not classed as scoliosis; 10–25° is mild, 25–45° moderate, over 45°
          severe. Only your clinician can interpret this.
        </p>
      </Card>

      <Card>
        <Label htmlFor="clinician">Clinician or clinic (optional)</Label>
        <input
          id="clinician"
          value={clinician}
          onChange={(e) => setClinician(e.target.value)}
          placeholder="Dr Alvarez"
          className="mt-2 min-h-12 w-full rounded-2xl border border-outline-variant bg-warm-bg px-4 text-base font-medium text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
        />
        <div className="mt-4">
          <Label htmlFor="notes">Notes (optional)</Label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did they say at the visit?"
            className="mt-2 w-full rounded-2xl border border-outline-variant bg-warm-bg px-4 py-3 text-base font-medium text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
          />
        </div>
      </Card>

      <motion.button
        type="button"
        onClick={save}
        whileTap={reduced ? undefined : { scale: 0.98, borderRadius: 18 }}
        transition={{ type: "spring", stiffness: 560, damping: 26 }}
        className="mt-2 min-h-14 rounded-full bg-sage-ink text-base font-bold text-warm-bg outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
      >
        Save measurement
      </motion.button>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-outline-variant bg-warm-surface p-5">
      {children}
    </section>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="font-serif text-lg font-black text-warm-ink">
      {children}
    </label>
  );
}
