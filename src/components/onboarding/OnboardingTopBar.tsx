import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function OnboardingTopBar({ step, total = 4 }: { step: number; total?: number }) {
  const navigate = useNavigate();
  return (
    <div className="relative z-20 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-2">
      <div className="w-16">
        {step > 1 && (
          <button
            onClick={() => navigate({ to: "/onboarding/$step", params: { step: String(step - 1) } })}
            aria-label="Go back"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-warm-surface-high/60 focus-visible:outline-none focus-visible:ring-2"
            style={{ color: "var(--warm-ink)" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={`Step ${step} of ${total}`}
      >
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "current" : "upcoming";
          return (
            <span
              key={n}
              className="block rounded-full transition-all"
              style={{
                width: state === "current" ? 22 : 8,
                height: 8,
                background:
                  state === "done"
                    ? "var(--sage-ink)"
                    : state === "current"
                      ? "var(--sage)"
                      : "var(--md-outline-variant)",
              }}
            />
          );
        })}
      </div>

      <div className="w-16 text-right">
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-full px-3 text-sm font-semibold hover:bg-warm-surface-high/60 focus-visible:outline-none focus-visible:ring-2"
          style={{ color: "var(--warm-ink-muted)" }}
        >
          Skip
        </Link>
      </div>
    </div>
  );
}