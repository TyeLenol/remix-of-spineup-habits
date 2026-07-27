import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import type { ReactNode } from "react";
import { LivingBackground } from "@/components/onboarding/LivingBackground";
import { TOTAL_STEPS } from "@/lib/profile-store";

type Props = {
  step: number;
  title: string;
  explainer: string;
  primary: { label: string; onClick: () => void; disabled?: boolean; ariaLabel?: string };
  secondary?: { label: string; onClick: () => void };
  children: ReactNode;
  composition?: "screen1" | "screen2" | "screen3" | "screen4";
};

export function ProfileShell({
  step,
  title,
  explainer,
  primary,
  secondary,
  children,
  composition = "screen4",
}: Props) {
  const navigate = useNavigate();
  const pct = Math.round((step / TOTAL_STEPS) * 100);

  const goBack = () => {
    if (step > 1) {
      navigate({ to: "/profile/setup/$step", params: { step: String(step - 1) } });
    }
  };

  return (
    <>
      <LivingBackground composition={composition} />
      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* Top bar: back / progress / close */}
        <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-3">
          <button
            onClick={goBack}
            aria-label="Go back"
            disabled={step === 1}
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-warm-surface-high/60 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-30"
            style={{ color: "var(--warm-ink)" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div
            className="flex flex-1 flex-col items-center gap-1 px-4"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={step}
            aria-label={`Step ${step} of ${TOTAL_STEPS}`}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--warm-ink-muted)" }}>
              Step {step} of {TOTAL_STEPS}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--md-outline-variant)" }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pct}%`, background: "var(--sage)" }}
              />
            </div>
          </div>

          <Link
            to="/"
            aria-label="Exit profile setup"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-warm-surface-high/60 focus-visible:outline-none focus-visible:ring-2"
            style={{ color: "var(--warm-ink-muted)" }}
          >
            <X className="h-5 w-5" />
          </Link>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-6 pb-6">
          <h1 className="font-serif text-4xl font-black leading-[0.95] tracking-tight" style={{ color: "var(--warm-ink)" }}>
            {title}
          </h1>
          <p className="mt-3 max-w-[22rem] text-sm font-medium" style={{ color: "var(--warm-ink-muted)" }}>
            {explainer}
          </p>

          <div className="mt-6 flex-1">{children}</div>

          {/* Sticky-ish actions */}
          <div className="mt-6 flex flex-col items-stretch gap-3">
            <button
              onClick={primary.onClick}
              disabled={primary.disabled}
              aria-label={primary.ariaLabel ?? primary.label}
              className="relative min-h-14 rounded-full text-base font-bold tracking-wide transition-transform active:translate-y-1 focus-visible:outline-none focus-visible:ring-4 disabled:opacity-40"
              style={{ background: "var(--sage)", color: "var(--on-sage)", boxShadow: "0 6px 0 0 var(--sage-ink)" }}
            >
              {primary.label}
            </button>
            {secondary && (
              <button
                onClick={secondary.onClick}
                className="min-h-11 rounded-full text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2"
                style={{ color: "var(--warm-ink-muted)" }}
              >
                {secondary.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Shared field primitives ---------- */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--warm-ink)" }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs" style={{ color: "var(--warm-ink-muted)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-12 w-full rounded-2xl border-2 bg-transparent px-4 text-base font-medium focus-visible:outline-none focus-visible:ring-4 ${props.className ?? ""}`}
      style={{
        borderColor: "var(--md-outline-variant)",
        color: "var(--warm-ink)",
        background: "var(--warm-surface)",
      }}
    />
  );
}

export function ChipGroup<T extends string>({
  value,
  onChange,
  options,
  multi = false,
  columns = 2,
}: {
  value: T | T[] | undefined;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string }[];
  multi?: boolean;
  columns?: 1 | 2 | 3;
}) {
  const selected = (v: T) =>
    multi ? Array.isArray(value) && value.includes(v) : value === v;
  const cols = columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <div className={`grid ${cols} gap-2`} role={multi ? "group" : "radiogroup"}>
      {options.map((o) => {
        const on = selected(o.value);
        return (
          <button
            key={o.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className="min-h-12 rounded-2xl border-2 px-3 py-2 text-left text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-4"
            style={{
              borderColor: on ? "var(--sage-ink)" : "var(--md-outline-variant)",
              background: on ? "var(--sage-container)" : "var(--warm-surface)",
              color: on ? "var(--on-sage)" : "var(--warm-ink)",
            }}
          >
            <span className="block">{o.label}</span>
            {o.hint && (
              <span className="mt-0.5 block text-[11px] font-medium opacity-70">{o.hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  ariaLabel,
  tint = "var(--coral)",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel: string;
  tint?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="h-11 flex-1 accent-current"
        style={{ color: tint }}
      />
      <span
        className="grid h-11 w-11 place-items-center rounded-full text-base font-black"
        style={{ background: tint, color: "var(--on-coral)" }}
        aria-hidden
      >
        {value}
      </span>
    </div>
  );
}