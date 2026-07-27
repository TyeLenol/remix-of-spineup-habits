import { useState } from "react";
import { Shield, Cloud, BarChart3 } from "lucide-react";
import { ProfileShell } from "../ProfileShell";
import { loadProfile, updateProfile } from "@/lib/profile-store";
import { Spry } from "@/components/onboarding/Spry";

export function StepConsent({ onNext }: { onNext: () => void }) {
  const initial = loadProfile();
  const [analytics, setAnalytics] = useState(initial.consent.analytics);

  const accept = () => {
    updateProfile((p) => ({
      ...p,
      consent: { onDevice: true, analytics, acceptedAt: new Date().toISOString() },
    }));
    onNext();
  };

  return (
    <ProfileShell
      step={1}
      composition="screen1"
      title="Your data, your body, your rules."
      explainer="Health info is sensitive. Everything you enter stays on this device by default. You choose what — if anything — to share."
      primary={{ label: "I understand — continue", onClick: accept }}
    >
      <div className="flex justify-center py-2">
        <Spry pose="waving" size={120} />
      </div>

      <ul className="space-y-3">
        <ConsentRow
          icon={<Shield />}
          title="On-device by default"
          body="Your profile lives in local storage on this phone. No account, no cloud, unless you turn it on later."
          locked
        />
        <ConsentRow
          icon={<Cloud />}
          title="Cloud sync"
          body="Off. Enable later in Settings if you want to sync across devices."
          locked
        />
        <ConsentRow
          icon={<BarChart3 />}
          title="Anonymous usage analytics"
          body="Help us improve SpineUp with anonymised, non-medical usage data."
          toggle={{ value: analytics, onChange: setAnalytics }}
        />
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed" style={{ color: "var(--warm-ink-muted)" }}>
        Every clinical question in setup is optional. You can skip anything, edit later, and delete your profile any time from Settings.
      </p>
    </ProfileShell>
  );
}

function ConsentRow({
  icon,
  title,
  body,
  locked,
  toggle,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  locked?: boolean;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
}) {
  return (
    <li
      className="flex items-start gap-3 rounded-3xl p-4"
      style={{ background: "var(--warm-surface)", border: "1px solid var(--md-outline-variant)" }}
    >
      <div
        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
        style={{ background: "var(--sage-container)", color: "var(--on-sage)" }}
        aria-hidden
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold" style={{ color: "var(--warm-ink)" }}>
          {title}
        </div>
        <div className="text-xs" style={{ color: "var(--warm-ink-muted)" }}>
          {body}
        </div>
      </div>
      {toggle && (
        <button
          role="switch"
          aria-checked={toggle.value}
          aria-label="Toggle anonymous usage analytics"
          onClick={() => toggle.onChange(!toggle.value)}
          className="relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4"
          style={{ background: toggle.value ? "var(--sage)" : "var(--md-outline-variant)" }}
        >
          <span
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform"
            style={{ transform: toggle.value ? "translateX(22px)" : "translateX(2px)" }}
          />
        </button>
      )}
      {locked && (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--sage-ink)" }}>
          Default
        </span>
      )}
    </li>
  );
}