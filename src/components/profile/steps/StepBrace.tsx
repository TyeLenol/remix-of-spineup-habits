import { useState } from "react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type BraceType } from "@/lib/profile-store";

export function StepBrace({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile().brace;
  const [wears, setWears] = useState<"yes" | "no" | undefined>(
    initial.wears === true ? "yes" : initial.wears === false ? "no" : undefined,
  );
  const [type, setType] = useState<BraceType | undefined>(initial.type);
  const [hours, setHours] = useState<string>(initial.hoursPerDay ? String(initial.hoursPerDay) : "");
  const [startDate, setStartDate] = useState(initial.startDate ?? "");

  const save = () => {
    updateProfile((p) => ({
      ...p,
      brace:
        wears === "yes"
          ? {
              wears: true,
              type,
              hoursPerDay: hours ? Number(hours) : undefined,
              startDate: startDate || undefined,
            }
          : { wears: false, type: "none" },
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={6}
      composition="screen1"
      title="Your brace."
      explainer="If you wear a brace, we'll shape your daily hour goal and celebrate every hour you clock."
      primary={{ label: "Continue", onClick: save, disabled: !wears }}
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

      <Field label="Start date (optional)">
        <TextInput
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </Field>
        </>
      )}
    </ProfileShell>
  );
}