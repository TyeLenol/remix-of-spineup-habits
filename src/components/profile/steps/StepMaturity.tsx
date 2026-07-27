import { useState } from "react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile } from "@/lib/profile-store";

export function StepMaturity({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile().maturity;
  const [menarche, setMenarche] = useState<"yes" | "no" | "na" | "skip" | undefined>(initial.menarche);
  const [age, setAge] = useState<string>(initial.ageAtMenarche ? String(initial.ageAtMenarche) : "");

  const save = () => {
    updateProfile((p) => ({
      ...p,
      maturity: { menarche, ageAtMenarche: age ? Number(age) : undefined },
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={6}
      composition="screen3"
      title="Growth check-in."
      explainer="Puberty timing is one of the strongest predictors of curve change during adolescence. Sensitive — always optional."
      primary={{ label: "Continue", onClick: save }}
      secondary={{ label: "Not relevant / skip", onClick: onSkip }}
    >
      <Field label="Has menarche (first period) started?">
        <ChipGroup<"yes" | "no" | "na" | "skip">
          columns={2}
          value={menarche}
          onChange={setMenarche}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "Not yet" },
            { value: "na", label: "Not applicable" },
            { value: "skip", label: "Prefer not to say" },
          ]}
        />
      </Field>

      {menarche === "yes" && (
        <Field label="Age when it started (optional)">
          <TextInput
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 12"
            min={7}
            max={20}
          />
        </Field>
      )}
    </ProfileShell>
  );
}