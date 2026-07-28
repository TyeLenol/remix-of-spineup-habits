import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { MOODS, PAIN_LOCATIONS, useToday, type Mood } from "@/lib/today-store";
import { loadProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/today/check-in")({
  head: () => ({
    meta: [
      { title: "Daily check-in — SpineUp" },
      {
        name: "description",
        content:
          "Log pain, mood, pain locations, fatigue, tightness, brace hours and a private note for today.",
      },
      { property: "og:title", content: "Daily check-in — SpineUp" },
      {
        property: "og:description",
        content: "A quick, private daily scoliosis check-in stored only on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckInPage,
});

function CheckInPage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { checkIn, saveCheckIn, hydrated } = useToday();

  const [pain, setPain] = useState(3);
  const [mood, setMood] = useState<Mood>("okay");
  const [locations, setLocations] = useState<string[]>([]);
  const [fatigue, setFatigue] = useState(3);
  const [tightness, setTightness] = useState(3);
  const [braceHours, setBraceHours] = useState(0);
  const [notes, setNotes] = useState("");
  const [wearsBrace, setWearsBrace] = useState(false);

  useEffect(() => {
    setWearsBrace(Boolean(loadProfile().brace.wears));
  }, []);

  useEffect(() => {
    if (!hydrated || !checkIn) return;
    setPain(checkIn.pain);
    setMood(checkIn.mood);
    setLocations(checkIn.locations);
    setFatigue(checkIn.fatigue);
    setTightness(checkIn.tightness);
    setBraceHours(checkIn.braceHours ?? 0);
    setNotes(checkIn.notes);
  }, [hydrated, checkIn]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCheckIn({
      pain,
      mood,
      locations,
      fatigue,
      tightness,
      braceHours: wearsBrace ? braceHours : undefined,
      notes: notes.slice(0, 1000),
    });
    navigate({ to: "/today" });
  };

  return (
    <main className="px-4 pb-24 pt-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate({ to: "/today" })}
          aria-label="Back to today"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
        <h1 className="font-serif text-2xl font-black text-warm-ink">Daily check-in</h1>
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
        <Card>
          <Label htmlFor="pain">Pain intensity</Label>
          <p className="text-sm text-warm-ink-muted">0 is no pain, 10 is the worst.</p>
          <input
            id="pain"
            type="range"
            min={0}
            max={10}
            step={1}
            value={pain}
            onChange={(e) => setPain(Number(e.target.value))}
            aria-valuetext={`${pain} out of 10`}
            className="mt-4 h-11 w-full accent-[var(--coral-ink)]"
          />
          <p className="font-serif text-3xl font-black tabular-nums text-warm-ink">
            {pain}
            <span className="text-base font-semibold text-warm-ink-muted"> / 10</span>
          </p>
        </Card>

        <Card>
          <fieldset>
            <legend className="font-serif text-lg font-black text-warm-ink">Mood</legend>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Mood">
              {MOODS.map((m) => {
                const on = mood === m.id;
                return (
                  <motion.button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setMood(m.id)}
                    whileTap={reduced ? undefined : { scale: 0.92, borderRadius: 14 }}
                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                    className={`flex min-h-12 flex-1 flex-col items-center justify-center rounded-2xl border px-2 py-2 text-xs font-semibold outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink ${
                      on
                        ? "border-sage-ink bg-sage-container text-on-sage"
                        : "border-outline-variant text-warm-ink"
                    }`}
                  >
                    <span aria-hidden className="mb-1 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`block h-1.5 w-1.5 rounded-full ${
                            n <= m.score
                              ? on
                                ? "bg-sage-ink"
                                : "bg-warm-ink/45"
                              : "bg-warm-ink/12"
                          }`}
                        />
                      ))}
                    </span>
                    {m.label}
                  </motion.button>
                );
              })}
            </div>
          </fieldset>
        </Card>

        <Card>
          <fieldset>
            <legend className="font-serif text-lg font-black text-warm-ink">
              Where does it hurt?
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {PAIN_LOCATIONS.map((loc) => {
                const on = locations.includes(loc);
                return (
                  <motion.button
                    key={loc}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setLocations((prev) =>
                        on ? prev.filter((l) => l !== loc) : [...prev, loc],
                      )
                    }
                    whileTap={reduced ? undefined : { scale: 0.94, borderRadius: 12 }}
                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                    className={`min-h-12 rounded-full border px-4 text-sm font-semibold outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink ${
                      on
                        ? "border-lavender-ink bg-lavender-container text-lavender-ink"
                        : "border-outline-variant text-warm-ink"
                    }`}
                  >
                    {loc}
                  </motion.button>
                );
              })}
            </div>
          </fieldset>
        </Card>

        <Card>
          <Label htmlFor="fatigue">Fatigue</Label>
          <input
            id="fatigue"
            type="range"
            min={0}
            max={10}
            value={fatigue}
            onChange={(e) => setFatigue(Number(e.target.value))}
            aria-valuetext={`${fatigue} out of 10`}
            className="h-11 w-full accent-[var(--lavender-ink)]"
          />
          <Label htmlFor="tightness">Muscle tightness</Label>
          <input
            id="tightness"
            type="range"
            min={0}
            max={10}
            value={tightness}
            onChange={(e) => setTightness(Number(e.target.value))}
            aria-valuetext={`${tightness} out of 10`}
            className="h-11 w-full accent-[var(--lavender-ink)]"
          />
        </Card>

        {wearsBrace && (
          <Card>
            <Label htmlFor="brace">Brace worn today</Label>
            <div className="flex items-center gap-3">
              <input
                id="brace"
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={braceHours}
                onChange={(e) => setBraceHours(Number(e.target.value))}
                className="min-h-12 w-28 rounded-2xl border border-outline-variant bg-warm-bg px-4 text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
              />
              <span className="text-sm text-warm-ink-muted">hours out of 24</span>
            </div>
          </Card>
        )}

        <Card>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={notes}
            maxLength={1000}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Anything worth remembering about today?"
            className="w-full rounded-2xl border border-outline-variant bg-warm-bg p-3 text-warm-ink outline-offset-2 placeholder:text-warm-ink-muted focus-visible:outline-3 focus-visible:outline-sage-ink"
          />
        </Card>

        <div className="relative mt-2">
          <div
            aria-hidden
            className="absolute inset-0 translate-y-1.5 rounded-full bg-sage-ink"
          />
          <motion.button
            type="submit"
            whileTap={reduced ? undefined : { y: 6, borderRadius: 22 }}
            whileHover={reduced ? undefined : { scale: 1.01 }}
            transition={{ type: "spring", stiffness: 620, damping: 24 }}
            className="relative flex min-h-14 w-full items-center justify-center rounded-full bg-sage-container px-8 text-base font-bold text-on-sage outline-offset-4 focus-visible:outline-3 focus-visible:outline-sage-ink"
          >
            {checkIn ? "Update check-in" : "Save check-in · +25 XP"}
          </motion.button>
        </div>
      </form>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-[28px] border border-outline-variant bg-warm-surface p-5">
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
