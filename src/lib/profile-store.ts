// Local, on-device profile store. Privacy-first: nothing leaves the device
// until the user explicitly opts into cloud sync (not implemented yet).

export type TreatmentStage =
  | "observation"
  | "bracing"
  | "pre_op"
  | "post_op"
  | "adult"
  | "unsure";

export type CurveType = "thoracic" | "lumbar" | "thoracolumbar" | "double_s" | "unsure";
export type BraceType = "boston" | "rigo_cheneau" | "providence" | "spinecor" | "other" | "none";
export type PtMethod = "schroth" | "seas" | "other_psse" | "none" | "unsure";
export type Sex = "female" | "male" | "intersex" | "prefer_not" | "";
export type UnitSystem = "metric" | "imperial";

export type Goal =
  | "reduce_pain"
  | "brace_hours"
  | "pt_consistency"
  | "prep_surgery"
  | "track_progression"
  | "exploring";

export interface ProfileData {
  consent: { onDevice: boolean; analytics: boolean; acceptedAt?: string };
  basics: { displayName: string; dob: string; sex: Sex };
  body: { units: UnitSystem; heightCm?: number; weightKg?: number };
  story: { diagnosisDate?: string; treatmentStage?: TreatmentStage };
  curve: {
    cobbPrimary?: number;
    cobbSecondary?: number;
    curveType?: CurveType;
    risser?: number;
    lenke?: string;
  };
  maturity: { menarche?: "yes" | "no" | "na" | "skip"; ageAtMenarche?: number };
  brace: { type?: BraceType; hoursPerDay?: number; startDate?: string };
  pt: { method?: PtMethod };
  symptoms: { pain?: number; fatigue?: number; activity?: "low" | "moderate" | "high" };
  goals: Goal[];
  companion: { name: string; color: "sage" | "coral" | "lavender" };
  completedAt?: string;
  xp: number;
}

const KEY = "spineup.profile.v1";

export const emptyProfile = (): ProfileData => ({
  consent: { onDevice: true, analytics: false },
  basics: { displayName: "", dob: "", sex: "" },
  body: { units: "metric" },
  story: {},
  curve: {},
  maturity: {},
  brace: {},
  pt: {},
  symptoms: {},
  goals: [],
  companion: { name: "Spry", color: "sage" },
  xp: 0,
});

export function loadProfile(): ProfileData {
  if (typeof window === "undefined") return emptyProfile();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProfile();
    return { ...emptyProfile(), ...JSON.parse(raw) };
  } catch {
    return emptyProfile();
  }
}

export function saveProfile(p: ProfileData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* quota / private mode — silent */
  }
}

export function updateProfile(patch: (p: ProfileData) => ProfileData) {
  const next = patch(loadProfile());
  saveProfile(next);
  return next;
}

export const PROFILE_STEPS = [
  { n: 1, key: "consent", label: "Privacy" },
  { n: 2, key: "basics", label: "About you" },
  { n: 3, key: "body", label: "Body" },
  { n: 4, key: "story", label: "Your story" },
  { n: 5, key: "curve", label: "Curve details" },
  { n: 6, key: "maturity", label: "Growth" },
  { n: 7, key: "brace", label: "Brace" },
  { n: 8, key: "pt", label: "Physio" },
  { n: 9, key: "symptoms", label: "Today" },
  { n: 10, key: "goals", label: "Goals" },
  { n: 11, key: "companion", label: "Spry" },
] as const;

export const TOTAL_STEPS = PROFILE_STEPS.length;