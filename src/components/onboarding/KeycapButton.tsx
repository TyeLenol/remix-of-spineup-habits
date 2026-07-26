import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";

type Tone = "surface" | "sage" | "coral" | "lavender";

type Props = Omit<HTMLMotionProps<"button">, "ref"> & { tone?: Tone; children: ReactNode };

const TONES: Record<Tone, { fill: string; ink: string; text: string }> = {
  surface: { fill: "var(--warm-surface-high)", ink: "var(--warm-ink)", text: "var(--warm-ink)" },
  sage: { fill: "var(--sage)", ink: "var(--sage-ink)", text: "var(--on-sage)" },
  coral: { fill: "var(--coral)", ink: "var(--coral-ink)", text: "var(--on-coral)" },
  lavender: { fill: "var(--lavender)", ink: "var(--lavender-ink)", text: "var(--on-lavender)" },
};

export const KeycapButton = forwardRef<HTMLButtonElement, Props>(function KeycapButton(
  { tone = "surface", children, className = "", ...rest },
  ref,
) {
  const t = TONES[tone];
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: t.ink, transform: "translateY(6px)" }}
        aria-hidden
      />
      <motion.button
        ref={ref}
        whileTap={{ y: 6 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="relative inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-bold tracking-wide focus-visible:outline-none focus-visible:ring-4"
        style={{ background: t.fill, color: t.text }}
        {...rest}
      >
        {children}
      </motion.button>
    </div>
  );
});