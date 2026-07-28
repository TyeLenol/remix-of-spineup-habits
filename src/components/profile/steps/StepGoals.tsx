import { useState } from "react";
import { ProfileShell, Field, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type Goal } from "@/lib/profile-store";

export function StepGoals({ onNext }: { onNext: () => void }) {
  const initial = loadProfile().goals;
  const [goals, setGoals] = useState<Goal[]>(initial);

  const toggle = (g: Goal) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const save = () => {
    updateProfile((p) => ({
      ...p,
      goals,
      completedAt: new Date().toISOString(),
      xp: (p.xp || 0) + 250,
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={5}
      composition="screen1"
      title="Pick your quests."
      explainer="What matters to you right now? Pick at least one — this shapes your daily quests, XP goals, and home screen."
      primary={{ label: "Complete profile · +250 XP", onClick: save, disabled: goals.length === 0 }}
    >
      <Field label="Your goals (choose one or more)">
        <ChipGroup<Goal>
          multi
          columns={1}
          value={goals}
          onChange={toggle}
          options={[
            { value: "reduce_pain", label: "Reduce pain", hint: "Gentler days, better sleep" },
            { value: "brace_hours", label: "Hit my brace-hour targets" },
            { value: "pt_consistency", label: "Stay consistent with physio" },
            { value: "prep_surgery", label: "Prepare for surgery" },
            { value: "track_progression", label: "Track how my curve is changing" },
            { value: "exploring", label: "Just exploring for now" },
          ]}
        />
      </Field>
    </ProfileShell>
  );
}