import { motion, useReducedMotion } from "motion/react";
import type { ComponentType, ReactNode } from "react";

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
      aria-label={`Onboarding progress: step ${step} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="block h-1 rounded-full transition-all duration-300"
          style={{
            width: i + 1 === step ? 16 : 6,
            background: tint,
            opacity: i + 1 === step ? 1 : 0.55,
          }}
        />
      ))}
    </div>
  );
}

/**
 * M3-Expressive CTA: opaque keycap over a darker offset shape, with the
 * signature shape-morph (pill -> squircle) and depth press on interaction.
 */
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
      <motion.div
        className="absolute inset-0"
        style={{ background: ink, transform: "translateY(6px)", borderRadius: 999 }}
        aria-hidden
        variants={{ rest: { borderRadius: 999 }, press: { borderRadius: 22 } }}
      />
      <motion.button
        type="button"
        onClick={onClick}
        initial="rest"
        animate="rest"
        whileTap={reduced ? undefined : "press"}
        whileHover={reduced ? undefined : { scale: 1.015 }}
        variants={{
          rest: { y: 0, borderRadius: 999 },
          press: { y: 6, borderRadius: 22 },
        }}
        transition={{ type: "spring", stiffness: 620, damping: 24 }}
        className="relative flex min-h-14 w-full items-center justify-center px-8 text-base font-bold outline-offset-4 focus-visible:outline-3"
        style={{ background: fill, color: text, borderRadius: 999, outlineColor: fill }}
      >
        {label}
      </motion.button>
    </div>
  );
}

/** Expressive tonal icon button — shape-morphs on press, 48px min target. */
export function IconButton({
  icon: Icon,
  label,
  onClick,
  tint,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  onClick: () => void;
  tint: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={reduced ? undefined : { scale: 0.9, borderRadius: 16 }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      transition={{ type: "spring", stiffness: 620, damping: 22 }}
      className="inline-flex h-12 w-12 items-center justify-center outline-offset-2 focus-visible:outline-3"
      style={{
        color: tint,
        borderRadius: 999,
        background: `color-mix(in oklab, ${tint} 18%, transparent)`,
        outlineColor: tint,
      }}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </motion.button>
  );
}

/** Expressive text link with the same shape-morph press behaviour. */
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
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={reduced ? undefined : { scale: 0.94, borderRadius: 14 }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      transition={{ type: "spring", stiffness: 620, damping: 22 }}
      className="inline-flex min-h-12 min-w-12 items-center justify-center px-4 text-sm font-semibold outline-offset-2 focus-visible:outline-3"
      style={{
        color: tint,
        borderRadius: 999,
        background: `color-mix(in oklab, ${tint} 14%, transparent)`,
        outlineColor: tint,
      }}
    >
      {children}
    </motion.button>
  );
}

/** Polite announcement of the current screen for screen-reader users. */
export function StepAnnouncer({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
