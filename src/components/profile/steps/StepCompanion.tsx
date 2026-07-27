import { useState } from "react";
import { motion } from "motion/react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile } from "@/lib/profile-store";
import { Spry } from "@/components/onboarding/Spry";

export function StepCompanion({ onNext }: { onNext: () => void }) {
  const initial = loadProfile().companion;
  const [name, setName] = useState(initial.name);
  const [color, setColor] = useState<"sage" | "coral" | "lavender">(initial.color);

  const finish = () => {
    updateProfile((p) => ({
      ...p,
      companion: { name: name.trim() || "Spry", color },
      completedAt: new Date().toISOString(),
      xp: (p.xp || 0) + 250,
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={11}
      composition="screen4"
      title="Meet your companion."
      explainer="Give Spry a name and a colour. You'll unlock more looks as you build streaks."
      primary={{ label: "Complete profile · +250 XP", onClick: finish }}
    >
      <div className="flex justify-center py-4">
        <motion.div
          key={color}
          initial={{ scale: 0.9, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          style={{ filter: `hue-rotate(${color === "coral" ? 180 : color === "lavender" ? 90 : 0}deg)` }}
        >
          <Spry pose="excited" size={160} />
        </motion.div>
      </div>

      <Field label="Companion name">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Spry"
          maxLength={20}
        />
      </Field>

      <Field label="Colour">
        <ChipGroup<"sage" | "coral" | "lavender">
          value={color}
          onChange={setColor}
          columns={3}
          options={[
            { value: "sage", label: "Sage" },
            { value: "coral", label: "Coral" },
            { value: "lavender", label: "Lavender" },
          ]}
        />
      </Field>
    </ProfileShell>
  );
}