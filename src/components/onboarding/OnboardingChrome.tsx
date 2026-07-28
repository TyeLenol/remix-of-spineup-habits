import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ProgressDots({
  step,
  total = 4,
  tint,
}: {
  step: number;
  total?: number;
  tint: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="block h-1 rounded-full transition-all duration-300"
          style={{
            width: i + 1 === step ? 16 : 6,
            background: tint,
            opacity: i + 1 === step ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

/** Flat keycap: opaque fill over a darker offset shape. No glass, no gradient. */
export function KeycapCta({
  label,
  onClick,
  fill,
  ink,
  text,
}: {
  label: string;
  onClick: () => void;
  fill: string;
  ink: string;
  text: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="relative inline-block w-full max-w-xs">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: ink, transform: "translateY(6px)" }}
        aria-hidden
      />
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={reduced ? undefined : { y: 6 }}
        transition={{ type: "spring", stiffness: 700, damping: 22 }}
        className="relative flex min-h-14 w-full items-center justify-center rounded-full px-8 text-base font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        style={{ background: fill, color: text }}
      >
        {label}
      </motion.button>
    </div>
  );
}

export function SmallLink({
  children,
  onClick,
  tint,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  tint: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{ color: tint, opacity: 0.75 }}
    >
      {children}
    </button>
  );
}
