// On-device My Journey store. Clinical measurements stay in localStorage.
import { useCallback, useEffect, useState } from "react";
import { loadToday, MOODS, streakFrom, levelInfo, type TodayState } from "@/lib/today-store";
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

export interface JourneyAppointment {
  id: string;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  clinic: string;
  kind: string;
  notes?: string;
}

export interface JourneyState {
  measurements: Measurement[];
  appointments: JourneyAppointment[];
  bannerDismissed: boolean;
}

const KEY = "spineup.journey.v1";

export const emptyJourney = (): JourneyState => ({
  measurements: [],
  appointments: [],
  bannerDismissed: false,
});

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

/* ---------- Timeframes ---------- */

export type Timeframe = "7d" | "30d" | "90d" | "all";

export const TIMEFRAMES: Array<{ id: Timeframe; label: string; long: string }> = [
  { id: "7d", label: "7d", long: "Last 7 days" },
  { id: "30d", label: "30d", long: "Last 30 days" },
  { id: "90d", label: "90d", long: "Last 90 days" },
  { id: "all", label: "All", long: "All time" },
];

const DAYS: Record<Exclude<Timeframe, "all">, number> = { "7d": 7, "30d": 30, "90d": 90 };

/** Inclusive ISO cutoff for a timeframe, or null for "all". */
export function cutoffFor(tf: Timeframe): string | null {
  if (tf === "all") return null;
  const d = new Date();
  d.setDate(d.getDate() - (DAYS[tf] - 1));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function withinTimeframe<T extends { date: string }>(rows: T[], tf: Timeframe) {
  const cut = cutoffFor(tf);
  return cut ? rows.filter((r) => r.date >= cut) : rows;
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

export type ActivityKind = "measurement" | "check-in" | "exercise" | "appointment";

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

  for (const a of journey.appointments) {
    out.push({
      id: `a-${a.id}`,
      kind: "appointment",
      date: a.date,
      title: a.kind,
      detail: [a.clinic, a.notes].filter(Boolean).join(" · ") || "Appointment",
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

/* ---------- Highlights (gamification lives here, not in the log) ---------- */

export type HighlightTone = "sage" | "coral" | "plain";

export interface Highlight {
  id: string;
  icon: "flame" | "trophy" | "ruler" | "calendar" | "activity";
  title: string;
  detail: string;
  tone: HighlightTone;
}

export function buildHighlights(
  journey: JourneyState,
  today: TodayState,
): Highlight[] {
  const out: Highlight[] = [];
  const streak = streakFrom(today);
  const lvl = levelInfo(today.xp);

  out.push({
    id: "streak",
    icon: "flame",
    title: streak > 0 ? `${streak}-day streak` : "Start a streak",
    detail:
      streak > 0
        ? "Consecutive days with activity"
        : "Log a stretch or check-in today",
    tone: "coral",
  });

  out.push({
    id: "level",
    icon: "trophy",
    title: `Level ${lvl.level} · ${lvl.title}`,
    detail: `${lvl.into} / ${lvl.needed} XP this level`,
    tone: "sage",
  });

  const all = [...journey.measurements].sort((a, b) => a.date.localeCompare(b.date));
  const latest = all[all.length - 1];
  out.push({
    id: "angle",
    icon: "ruler",
    title: latest ? `${latest.degrees}° logged` : "No angle yet",
    detail: latest
      ? `${REGIONS.find((r) => r.id === latest.region)?.label} · ${new Date(
          `${latest.date}T00:00:00`,
        ).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
      : "Add one from your clinic report",
    tone: "plain",
  });

  const checkIns = Object.keys(today.checkIns).length;
  out.push({
    id: "checkins",
    icon: "calendar",
    title: `${checkIns} check-${checkIns === 1 ? "in" : "ins"}`,
    detail: "Daily pain and mood logs",
    tone: "plain",
  });

  const stretches = Object.values(today.completions).reduce((s, i) => s + i.length, 0);
  out.push({
    id: "stretches",
    icon: "activity",
    title: `${stretches} stretches`,
    detail: "Completed all time",
    tone: "plain",
  });

  return out;
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

/** Logged pain points inside a timeframe, oldest first. */
export function painPoints(today: TodayState, tf: Timeframe) {
  const cut = cutoffFor(tf);
  return Object.entries(today.checkIns)
    .filter(([date]) => (cut ? date >= cut : true))
    .map(([date, c]) => ({ date, pain: c.pain }))
    .sort((a, b) => a.date.localeCompare(b.date));
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

  const patch = useCallback((fn: (s: JourneyState) => JourneyState) => {
    setJourney((prev) => {
      const next = fn(prev);
      saveJourney(next);
      return next;
    });
  }, []);

  const addMeasurement = useCallback(
    (m: Omit<Measurement, "id">) =>
      patch((prev) => ({
        ...prev,
        measurements: [...prev.measurements, { ...m, id: crypto.randomUUID() }],
      })),
    [patch],
  );

  const removeMeasurement = useCallback(
    (id: string) =>
      patch((prev) => ({
        ...prev,
        measurements: prev.measurements.filter((m) => m.id !== id),
      })),
    [patch],
  );

  const addAppointment = useCallback(
    (a: Omit<JourneyAppointment, "id">) =>
      patch((prev) => ({
        ...prev,
        appointments: [...prev.appointments, { ...a, id: crypto.randomUUID() }],
      })),
    [patch],
  );

  const dismissBanner = useCallback(
    () => patch((prev) => ({ ...prev, bannerDismissed: true })),
    [patch],
  );

  return {
    journey,
    today,
    hydrated,
    addMeasurement,
    removeMeasurement,
    addAppointment,
    dismissBanner,
  };
}
