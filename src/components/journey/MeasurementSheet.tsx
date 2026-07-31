import { useState } from "react";
import { REGIONS, type CurveRegion, type Measurement } from "@/lib/journey-store";
import { todayKey } from "@/lib/today-store";
import { KeycapButton, Sheet, fieldClass, labelClass } from "./Sheet";

export function MeasurementSheet({
  open,
  onClose,
  existing,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  existing: Measurement[];
  onSave: (m: Omit<Measurement, "id">, duplicate: boolean) => void;
}) {
  const [date, setDate] = useState(todayKey());
  const [region, setRegion] = useState<CurveRegion>("thoracic");
  const [degrees, setDegrees] = useState("25");
  const [clinician, setClinician] = useState("");

  const save = () => {
    const value = Math.min(120, Math.max(0, Number(degrees) || 0));
    const duplicate = existing.some((m) => m.date === date);
    onSave(
      { date, region, degrees: value, clinician: clinician.trim() || undefined },
      duplicate,
    );
    setDegrees("25");
    setClinician("");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Log Cobb angle">
      <p className="mt-1 text-sm text-warm-ink-muted">
        Copy the value from your clinician&rsquo;s report or X-ray.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label className={labelClass} htmlFor="ms-degrees">
            Cobb angle (degrees)
          </label>
          <input
            id="ms-degrees"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            value={degrees}
            onChange={(e) => setDegrees(e.target.value)}
            className={`${fieldClass} mt-1 font-serif text-3xl font-black`}
          />
        </div>

        <fieldset>
          <legend className={labelClass}>Curve region</legend>
          <div className="mt-1 flex gap-2">
            {REGIONS.map((r) => {
              const on = r.id === region;
              return (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setRegion(r.id)}
                  className={`min-h-12 flex-1 rounded-full px-3 text-sm font-bold outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink ${
                    on
                      ? "bg-sage-ink text-warm-bg"
                      : "border border-outline text-warm-ink"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="ms-date">
            Date of scan
          </label>
          <input
            id="ms-date"
            type="date"
            value={date}
            max={todayKey()}
            onChange={(e) => setDate(e.target.value)}
            className={`${fieldClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ms-clinician">
            Clinician (optional)
          </label>
          <input
            id="ms-clinician"
            type="text"
            value={clinician}
            onChange={(e) => setClinician(e.target.value)}
            placeholder="Dr. Rivera"
            className={`${fieldClass} mt-1`}
          />
        </div>
      </div>

      <KeycapButton onClick={save}>Save measurement</KeycapButton>
    </Sheet>
  );
}
