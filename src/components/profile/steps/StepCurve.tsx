import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProfileShell, Field, TextInput, ChipGroup } from "../ProfileShell";
import { loadProfile, updateProfile, type CurveType } from "@/lib/profile-store";

export function StepCurve({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const initial = loadProfile().curve;
  const [primary, setPrimary] = useState<string>(initial.cobbPrimary ? String(initial.cobbPrimary) : "");
  const [secondary, setSecondary] = useState<string>(initial.cobbSecondary ? String(initial.cobbSecondary) : "");
  const [curveType, setCurveType] = useState<CurveType | undefined>(initial.curveType);
  const [risser, setRisser] = useState<string>(initial.risser !== undefined ? String(initial.risser) : "");
  const [advanced, setAdvanced] = useState(false);

  const save = () => {
    updateProfile((p) => ({
      ...p,
      curve: {
        cobbPrimary: primary ? Number(primary) : undefined,
        cobbSecondary: secondary ? Number(secondary) : undefined,
        curveType,
        risser: risser !== "" ? Number(risser) : undefined,
      },
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={3}
      composition="screen2"
      title="Curve details."
      explainer="Only fill what you know from your last clinic visit. If you don't have your X-ray report handy, skip — you can add these later."
      primary={{ label: "Continue", onClick: save }}
      secondary={{ label: "I don't have this info", onClick: onSkip }}
    >
      <Field label="Primary Cobb angle (°)" hint="The main curve angle from your X-ray.">
        <TextInput
          type="number"
          inputMode="decimal"
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          placeholder="e.g. 28"
          min={0}
          max={130}
        />
      </Field>

      <Field label="Curve pattern">
        <ChipGroup<CurveType>
          columns={1}
          value={curveType}
          onChange={setCurveType}
          options={[
            { value: "thoracic", label: "Thoracic (upper back)" },
            { value: "lumbar", label: "Lumbar (lower back)" },
            { value: "thoracolumbar", label: "Thoracolumbar (mid)" },
            { value: "double_s", label: "Double / S-shaped" },
            { value: "unsure", label: "Not sure" },
          ]}
        />
      </Field>

      <button
        type="button"
        onClick={() => setAdvanced((x) => !x)}
        className="flex min-h-11 items-center gap-1 text-sm font-bold focus-visible:outline-none focus-visible:ring-2"
        style={{ color: "var(--sage-ink)" }}
        aria-expanded={advanced}
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${advanced ? "rotate-180" : ""}`} />
        Advanced clinical details
      </button>

      {advanced && (
        <div className="mt-4">
          <Field label="Secondary Cobb angle (°)" hint="If you have a compensatory curve.">
            <TextInput
              type="number"
              inputMode="decimal"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              placeholder="e.g. 18"
              min={0}
              max={130}
            />
          </Field>
          <Field label="Risser sign (0–5)" hint="Skeletal maturity marker from your X-ray.">
            <TextInput
              type="number"
              inputMode="numeric"
              value={risser}
              onChange={(e) => setRisser(e.target.value)}
              placeholder="0–5"
              min={0}
              max={5}
            />
          </Field>
        </div>
      )}
    </ProfileShell>
  );
}