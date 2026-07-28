import { useState } from "react";
import { ProfileShell, Field, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type PtMethod } from "@/lib/profile-store";

export function StepPt({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile().pt;
  const [method, setMethod] = useState<PtMethod | undefined>(initial.method);

  const save = () => {
    updateProfile((p) => ({ ...p, pt: { method } }));
    onNext();
  };

  return (
    <ProfileShell
      step={7}
      composition="screen2"
      title="Physio approach."
      explainer="If you're following a specific scoliosis exercise method, we'll tune reminders and content around it."
      primary={{ label: "Continue", onClick: save }}
      secondary={{ label: "Skip", onClick: onSkip }}
    >
      <Field label="Which method are you doing?">
        <ChipGroup<PtMethod>
          columns={1}
          value={method}
          onChange={setMethod}
          options={[
            { value: "schroth", label: "Schroth", hint: "Curve-specific breathing & posture" },
            { value: "seas", label: "SEAS", hint: "Scientific Exercise Approach to Scoliosis" },
            { value: "other_psse", label: "Other PSSE method" },
            { value: "none", label: "General physio / stretches" },
            { value: "unsure", label: "Not sure" },
          ]}
        />
      </Field>
    </ProfileShell>
  );
}