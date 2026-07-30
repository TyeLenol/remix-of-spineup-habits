// On-device My Journey store. Clinical measurements stay in localStorage.
import { useCallback, useEffect, useState } from "react";
import { loadToday, MOODS, type TodayState } from "@/lib/today-store";
import { EXERCISES } from "@/lib/exercises";

export type CurveRegion = "thoracic" | "lumbar" | "cervical";

export const REGIONS: Array<{ id: CurveRegion; label: string }> = [
  { id: "thoracic", label: "Thoracic" },
  { id: "lumbar", label: "Lumbar" },
  { id: "cervical", label: "Cervical" },
];

export interface Measurement {
  id: string;
  /** ISO date (yyyy-mm-dd) of the scan or clinic visit */
  date: string;
  region: CurveRegion;
  /** Cobb angle in degrees */
  degrees: number;
  clinician?: string;
  notes?: string;
}

export interface JourneyState {
  measurements: Measurement[];
}

const KEY = "spineup.journey.v1";

export const emptyJourney = (): JourneyState => ({ measurements: [] });

export function loadJourney(): JourneyState {
  if (typeof window === "undefined") return emptyJourney();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyJourney();
    return { ...emptyJourney(), ...JSON.parse(raw) };
  } catch {
    return emptyJourney();
  }
}

export function saveJourney(s: JourneyState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — silent */
  }
}

/** Clinically meaningful change is >= 5 degrees (SRS convention). */
export const MEANINGFUL_CHANGE = 5;

export function seriesFor(ms: Measurement[], region: CurveRegion) {
  return ms
    .filter((m) => m.region === region)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function changeSummary(series: Measurement[]) {
  if (series.length === 0) return null;
  const latest = series[series.length - 1];
  const previous = series.length > 1 ? series[series.length - 2] : undefined;
  const delta = previous ? latest.degrees - previous.degrees : 0;
  const direction: "improved" | "increased" | "stable" =
    !previous || Math.abs(delta) < MEANINGFUL_CHANGE
      ? "stable"
      : delta < 0
        ? "improved"
        : "increased";
  return { latest, previous, delta, direction };
}

/* ---------- Activity log ---------- */

export type ActivityKind = "measurement" | "check-in" | "exercise";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  date: string;
  title: string;
  detail: string;
}

export function buildActivity(
  journey: JourneyState,
  today: TodayState,
): ActivityEntry[] {
  const out: ActivityEntry[] = [];

  for (const m of journey.measurements) {
    out.push({
      id: `m-${m.id}`,
      kind: "measurement",
      date: m.date,
      title: `${REGIONS.find((r) => r.id === m.region)?.label ?? m.region} curve measured`,
      detail: `${m.degrees}° Cobb angle${m.clinician ? ` · ${m.clinician}` : ""}`,
    });
  }

  for (const [date, c] of Object.entries(today.checkIns)) {
    const mood = MOODS.find((x) => x.id === c.mood)?.label ?? c.mood;
    out.push({
      id: `c-${date}`,
      kind: "check-in",
      date,
      title: "Daily check-in logged",
      detail: [
        `Pain ${c.pain}/10`,
        mood,
        c.braceHours !== undefined ? `brace ${c.braceHours}h` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  for (const [date, ids] of Object.entries(today.completions)) {
    if (!ids.length) continue;
    const xp = ids.reduce(
      (sum, id) => sum + (EXERCISES.find((e) => e.id === id)?.xp ?? 0),
      0,
    );
    out.push({
      id: `e-${date}`,
      kind: "exercise",
      date,
      title: `${ids.length} ${ids.length === 1 ? "stretch" : "stretches"} completed`,
      detail: `${xp} XP earned · ${ids
        .map((id) => EXERCISES.find((e) => e.id === id)?.name ?? id)
        .slice(0, 2)
        .join(", ")}${ids.length > 2 ? "…" : ""}`,
    });
  }

  return out.sort((a, b) => b.date.localeCompare(a.date));
}

/** Last `days` daily pain scores, newest last. Missing days are null. */
export function painSeries(today: TodayState, days = 14) {
  const out: Array<{ date: string; pain: number | null }> = [];
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
    out.push({ date: key, pain: today.checkIns[key]?.pain ?? null });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function useJourney() {
  const [journey, setJourney] = useState<JourneyState>(emptyJourney);
  const [today, setTodayState] = useState<TodayState>(() => ({
    xp: 0,
    completions: {},
    checkIns: {},
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setJourney(loadJourney());
    setTodayState(loadToday());
    setHydrated(true);
  }, []);

  const addMeasurement = useCallback((m: Omit<Measurement, "id">) => {
    setJourney((prev) => {
      const next: JourneyState = {
        ...prev,
        measurements: [...prev.measurements, { ...m, id: crypto.randomUUID() }],
      };
      saveJourney(next);
      return next;
    });
  }, []);

  const removeMeasurement = useCallback((id: string) => {
    setJourney((prev) => {
      const next: JourneyState = {
        ...prev,
        measurements: prev.measurements.filter((m) => m.id !== id),
      };
      saveJourney(next);
      return next;
    });
  }, []);

  return { journey, today, hydrated, addMeasurement, removeMeasurement };
}
