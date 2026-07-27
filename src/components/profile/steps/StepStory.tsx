import { useState } from "react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type TreatmentStage } from "@/lib/profile-store";

export function StepStory({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile().story;
  const [diagnosisDate, setDiagnosisDate] = useState(initial.diagnosisDate ?? "");
  const [stage, setStage] = useState<TreatmentStage | undefined>(initial.treatmentStage);

  const save = () => {
    updateProfile((p) => ({
      ...p,
      story: { diagnosisDate: diagnosisDate || undefined, treatmentStage: stage },
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={4}
      composition="screen1"
      title="Your scoliosis story."
      explainer="Where are you in your journey? This shapes what Spry cheers you on for — and it's fine to say you're not sure."
      primary={{ label: "Continue", onClick: save }}
      secondary={{ label: "Skip this step", onClick: onSkip }}
    >
      <Field label="Diagnosis date (approximate is fine)">
        <TextInput
          type="date"
          value={diagnosisDate}
          onChange={(e) => setDiagnosisDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </Field>

      <Field label="Where are you right now?">
        <ChipGroup<TreatmentStage>
          columns={1}
          value={stage}
          onChange={setStage}
          options={[
            { value: "observation", label: "Being monitored", hint: "Watch-and-wait, no brace yet" },
            { value: "bracing", label: "Wearing a brace", hint: "Boston, Rigo-Chêneau, night-time, etc." },
            { value: "pre_op", label: "Preparing for surgery" },
            { value: "post_op", label: "Recovering from surgery" },
            { value: "adult", label: "Adult with scoliosis", hint: "Managing symptoms long-term" },
            { value: "unsure", label: "I'm not sure yet" },
          ]}
        />
      </Field>
    </ProfileShell>
  );
}