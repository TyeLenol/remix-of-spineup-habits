import { useState } from "react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type UnitSystem } from "@/lib/profile-store";

export function StepBody({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile().body;
  const [units, setUnits] = useState<UnitSystem>(initial.units);
  const [height, setHeight] = useState<string>(
    initial.heightCm ? String(units === "imperial" ? Math.round(initial.heightCm / 2.54) : initial.heightCm) : "",
  );
  const [weight, setWeight] = useState<string>(
    initial.weightKg ? String(units === "imperial" ? Math.round(initial.weightKg * 2.20462) : initial.weightKg) : "",
  );

  const save = () => {
    const h = Number(height);
    const w = Number(weight);
    const heightCm = Number.isFinite(h) && h > 0 ? (units === "imperial" ? h * 2.54 : h) : undefined;
    const weightKg = Number.isFinite(w) && w > 0 ? (units === "imperial" ? w / 2.20462 : w) : undefined;
    updateProfile((p) => ({ ...p, body: { units, heightCm, weightKg } }));
    onNext();
  };

  return (
    <ProfileShell
      step={3}
      composition="screen3"
      title="Body basics."
      explainer="Optional — helps us adjust exercise cues to your frame. Skip if you'd rather not share."
      primary={{ label: "Continue", onClick: save }}
      secondary={{ label: "Skip this step", onClick: onSkip }}
    >
      <Field label="Units">
        <ChipGroup<UnitSystem>
          value={units}
          onChange={setUnits}
          options={[
            { value: "metric", label: "Metric (cm / kg)" },
            { value: "imperial", label: "Imperial (in / lb)" },
          ]}
        />
      </Field>

      <Field label={units === "imperial" ? "Height (inches)" : "Height (cm)"}>
        <TextInput
          type="number"
          inputMode="decimal"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder={units === "imperial" ? "e.g. 64" : "e.g. 162"}
        />
      </Field>

      <Field label={units === "imperial" ? "Weight (lb)" : "Weight (kg)"}>
        <TextInput
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={units === "imperial" ? "e.g. 120" : "e.g. 55"}
        />
      </Field>
    </ProfileShell>
  );
}