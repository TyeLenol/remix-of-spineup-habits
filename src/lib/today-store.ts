// On-device Today store. Privacy-first: everything stays in localStorage.
import { useCallback, useEffect, useState } from "react";

export type Mood = "awful" | "low" | "okay" | "good" | "great";

export const MOODS: Array<{ id: Mood; label: string; score: number }> = [
  { id: "awful", label: "Awful", score: 1 },
  { id: "low", label: "Low", score: 2 },
  { id: "okay", label: "Okay", score: 3 },
  { id: "good", label: "Good", score: 4 },
  { id: "great", label: "Great", score: 5 },
];

export const PAIN_LOCATIONS = [
  "Upper back",
  "Lower back",
  "Ribs",
  "Neck",
  "Hips",
] as const;

export interface CheckIn {
  pain: number;
  mood: Mood;
  locations: string[];
  fatigue: number;
  tightness: number;
  braceHours?: number;
  notes: string;
  loggedAt: string;
}

export interface Appointment {
  date: string;
  doctor: string;
  kind: string;
}

export interface TodayState {
  xp: number;
  /** ISO date -> completed exercise ids */
  completions: Record<string, string[]>;
  /** ISO date -> check-in */
  checkIns: Record<string, CheckIn>;
  appointment?: Appointment;
}

const KEY = "spineup.today.v1";

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const emptyToday = (): TodayState => ({
  xp: 0,
  completions: {},
  checkIns: {},
  appointment: undefined,
});

export function loadToday(): TodayState {
  if (typeof window === "undefined") return emptyToday();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyToday();
    return { ...emptyToday(), ...JSON.parse(raw) };
  } catch {
    return emptyToday();
  }
}

export function saveToday(s: TodayState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — silent */
  }
}

/** Levels: 400 XP per level, with M3-ish encouraging titles. */
export const XP_PER_LEVEL = 400;
const LEVEL_TITLES = [
  "First steps",
  "Finding rhythm",
  "Steady riser",
  "Strong habit",
  "Spine steward",
  "Consistency pro",
];

export function levelInfo(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const into = xp % XP_PER_LEVEL;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    into,
    needed: XP_PER_LEVEL,
    progress: into / XP_PER_LEVEL,
  };
}

/** Consecutive days (ending today or yesterday) with any logged activity. */
export function streakFrom(state: TodayState): number {
  const active = (key: string) =>
    (state.completions[key]?.length ?? 0) > 0 || Boolean(state.checkIns[key]);
  const d = new Date();
  if (!active(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  for (let i = 0; i < 400; i++) {
    if (!active(todayKey(d))) break;
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function useToday() {
  const [state, setState] = useState<TodayState>(emptyToday);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadToday());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: (s: TodayState) => TodayState) => {
    setState((prev) => {
      const next = patch(prev);
      saveToday(next);
      return next;
    });
  }, []);

  const key = todayKey();
  const doneToday = state.completions[key] ?? [];
  const checkIn = state.checkIns[key];

  const toggleExercise = useCallback(
    (id: string, xp: number) =>
      update((s) => {
        const list = s.completions[key] ?? [];
        const has = list.includes(id);
        return {
          ...s,
          xp: Math.max(0, s.xp + (has ? -xp : xp)),
          completions: {
            ...s.completions,
            [key]: has ? list.filter((x) => x !== id) : [...list, id],
          },
        };
      }),
    [key, update],
  );

  const saveCheckIn = useCallback(
    (entry: Omit<CheckIn, "loggedAt">) =>
      update((s) => ({
        ...s,
        xp: s.xp + (s.checkIns[key] ? 0 : 25),
        checkIns: { ...s.checkIns, [key]: { ...entry, loggedAt: new Date().toISOString() } },
      })),
    [key, update],
  );

  return {
    state,
    hydrated,
    doneToday,
    checkIn,
    toggleExercise,
    saveCheckIn,
    streak: streakFrom(state),
    ...levelInfo(state.xp),
  };
}
