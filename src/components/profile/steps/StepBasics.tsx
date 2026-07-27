import { useState } from "react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type Sex } from "@/lib/profile-store";

export function StepBasics({ onNext }: { onNext: () => void }) {
  const initial = loadProfile().basics;
  const [name, setName] = useState(initial.displayName);
  const [dob, setDob] = useState(initial.dob);
  const [sex, setSex] = useState<Sex>(initial.sex);

  const canContinue = name.trim().length > 0 && dob.length > 0;

  const save = () => {
    updateProfile((p) => ({ ...p, basics: { displayName: name.trim(), dob, sex } }));
    onNext();
  };

  return (
    <ProfileShell
      step={2}
      composition="screen2"
      title="Nice to meet you."
      explainer="Just the essentials. We use your age to tailor content — sex-at-birth is optional and affects progression-risk insights only if you share it."
      primary={{ label: "Continue", onClick: save, disabled: !canContinue }}
    >
      <Field label="What should Spry call you?">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name or nickname"
          maxLength={40}
          autoComplete="given-name"
          aria-required="true"
        />
      </Field>

      <Field label="Date of birth" hint="Used for age-appropriate content and growth tracking.">
        <TextInput
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          aria-required="true"
        />
      </Field>

      <Field label="Sex assigned at birth (optional)" hint="Scoliosis progression risk differs — you can skip this.">
        <ChipGroup<Sex>
          value={sex}
          onChange={(v) => setSex(v === sex ? "" : v)}
          options={[
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
            { value: "intersex", label: "Intersex" },
            { value: "prefer_not", label: "Prefer not to say" },
          ]}
        />
      </Field>
    </ProfileShell>
  );
}