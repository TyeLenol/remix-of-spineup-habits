import { useState } from "react";
import type { JourneyAppointment } from "@/lib/journey-store";
import { todayKey } from "@/lib/today-store";
import { KeycapButton, Sheet, fieldClass, labelClass } from "./Sheet";

const KINDS = ["Orthopedist follow-up", "X-ray", "Physio session", "Brace fitting"];

export function AppointmentSheet({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (a: Omit<JourneyAppointment, "id">) => void;
}) {
  const [date, setDate] = useState(todayKey());
  const [kind, setKind] = useState(KINDS[0]);
  const [clinic, setClinic] = useState("");
  const [notes, setNotes] = useState("");

  const save = () => {
    onSave({ date, kind, clinic: clinic.trim() || "Clinic", notes: notes.trim() || undefined });
    setClinic("");
    setNotes("");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Schedule appointment">
      <p className="mt-1 text-sm text-warm-ink-muted">
        Appointments appear in your timeline and stay on this device.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label className={labelClass} htmlFor="ap-date">
            Date
          </label>
          <input
            id="ap-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${fieldClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-kind">
            Type
          </label>
          <select
            id="ap-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className={`${fieldClass} mt-1`}
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-clinic">
            Clinic or clinician
          </label>
          <input
            id="ap-clinic"
            type="text"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            placeholder="Northside Spine Clinic"
            className={`${fieldClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-notes">
            Notes (optional)
          </label>
          <textarea
            id="ap-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${fieldClass} mt-1 py-3`}
          />
        </div>
      </div>

      <KeycapButton onClick={save}>Save appointment</KeycapButton>
    </Sheet>
  );
}
