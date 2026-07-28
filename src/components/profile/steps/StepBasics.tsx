import { useState } from "react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type Sex, type TreatmentStage } from "@/lib/profile-store";

export function StepBasics({ onNext }: { onNext: () => void }) {
  const profile = loadProfile();
  const [name, setName] = useState(profile.basics.displayName);
  const [dob, setDob] = useState(profile.basics.dob);
  const [sex, setSex] = useState<Sex>(profile.basics.sex);
  const [stage, setStage] = useState<TreatmentStage | undefined>(profile.story.treatmentStage);

  const canContinue = name.trim().length > 0 && dob.length > 0 && !!stage;

  const save = () => {
    updateProfile((p) => ({
      ...p,
      basics: { displayName: name.trim(), dob, sex },
      story: { ...p.story, treatmentStage: stage },
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={2}
      composition="screen2"
      title="Nice to meet you."
      explainer="Just the essentials so Spry can tailor your journey. Sex-at-birth is optional — it only affects progression-risk insights."
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

      <Field label="Where are you in your journey?" hint="Shapes what Spry cheers you on for. You can change this any time.">
        <ChipGroup<TreatmentStage>
          columns={1}
          value={stage}
          onChange={setStage}
          options={[
            { value: "observation", label: "Being monitored", hint: "Watch-and-wait, no brace yet" },
            { value: "bracing", label: "Wearing a brace" },
            { value: "pre_op", label: "Preparing for surgery" },
            { value: "post_op", label: "Recovering from surgery" },
            { value: "adult", label: "Adult with scoliosis" },
            { value: "unsure", label: "Not sure yet" },
          ]}
        />
      </Field>
    </ProfileShell>
  );
}