import { useState } from "react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type BraceType, type PtMethod } from "@/lib/profile-store";

export function StepCare({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile();
  const [wears, setWears] = useState<"yes" | "no" | undefined>(
    initial.brace.wears === true ? "yes" : initial.brace.wears === false ? "no" : undefined,
  );
  const [type, setType] = useState<BraceType | undefined>(initial.brace.type);
  const [hours, setHours] = useState<string>(
    initial.brace.hoursPerDay ? String(initial.brace.hoursPerDay) : "",
  );
  const [method, setMethod] = useState<PtMethod | undefined>(initial.pt.method);

  const canContinue = !!wears;

  const save = () => {
    updateProfile((p) => ({
      ...p,
      brace:
        wears === "yes"
          ? { wears: true, type, hoursPerDay: hours ? Number(hours) : undefined }
          : { wears: false, type: "none" },
      pt: { method },
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={4}
      composition="screen3"
      title="Your care routine."
      explainer="A quick snapshot of your brace and physio — we'll use it to shape your daily quests and reminders."
      primary={{ label: "Continue", onClick: save, disabled: !canContinue }}
      secondary={{ label: "Skip", onClick: onSkip }}
    >
      <Field label="Do you currently wear a brace?">
        <ChipGroup<"yes" | "no">
          columns={2}
          value={wears}
          onChange={setWears}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </Field>

      {wears === "yes" && (
        <>
          <Field label="Brace type">
            <ChipGroup<BraceType>
              columns={2}
              value={type}
              onChange={setType}
              options={[
                { value: "boston", label: "Boston" },
                { value: "rigo_cheneau", label: "Rigo-Chêneau" },
                { value: "providence", label: "Providence", hint: "Night-time" },
                { value: "spinecor", label: "SpineCor", hint: "Soft brace" },
                { value: "other", label: "Other" },
              ]}
            />
          </Field>

          <Field label="Prescribed hours per day" hint="Whatever your doctor recommended.">
            <TextInput
              type="number"
              inputMode="numeric"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 20"
              min={0}
              max={24}
            />
          </Field>
        </>
      )}

      <Field label="Physio method (optional)" hint="If you're following a specific scoliosis exercise approach.">
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