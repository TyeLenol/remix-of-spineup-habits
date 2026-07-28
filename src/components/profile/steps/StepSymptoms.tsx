import { useState } from "react";
import { ProfileShell, Field, Slider, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile } from "@/lib/profile-store";

export function StepSymptoms({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile().symptoms;
  const [pain, setPain] = useState<number>(initial.pain ?? 0);
  const [fatigue, setFatigue] = useState<number>(initial.fatigue ?? 0);
  const [activity, setActivity] = useState<"low" | "moderate" | "high" | undefined>(initial.activity);

  const save = () => {
    updateProfile((p) => ({ ...p, symptoms: { pain, fatigue, activity } }));
    onNext();
  };

  return (
    <ProfileShell
      step={8}
      composition="screen3"
      title="How's today?"
      explainer="A quick baseline so you can see progress over time. There's no wrong answer — honest beats optimistic."
      primary={{ label: "Continue", onClick: save }}
      secondary={{ label: "Skip", onClick: onSkip }}
    >
      <Field label={`Pain right now — ${pain}/10`} hint="0 = none, 10 = worst you can imagine.">
        <Slider value={pain} onChange={setPain} ariaLabel="Current pain level 0 to 10" tint="var(--coral)" />
      </Field>

      <Field label={`Fatigue — ${fatigue}/10`} hint="How drained does your body feel today?">
        <Slider value={fatigue} onChange={setFatigue} ariaLabel="Current fatigue level 0 to 10" tint="var(--lavender)" />
      </Field>

      <Field label="Typical activity level">
        <ChipGroup<"low" | "moderate" | "high">
          value={activity}
          onChange={setActivity}
          columns={3}
          options={[
            { value: "low", label: "Low" },
            { value: "moderate", label: "Moderate" },
            { value: "high", label: "High" },
          ]}
        />
      </Field>
    </ProfileShell>
  );
}