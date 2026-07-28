import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { MorphShape, Breathing, CountUp } from "@/components/onboarding/MorphShape";
import {
  ProgressDots,
  KeycapCta,
  SmallLink,
  IconButton,
  StepAnnouncer,
} from "@/components/onboarding/OnboardingChrome";

const TOTAL = 5;

type Screen = {
  bg: string;
  edge: string;
  shape: string;
  accent: string;
  tint: string;
  tintSoft: string;
  deep: string;
  headline: [string, string];
  subtext: string;
  cta: string;
  overshoot: boolean;
  chips?: string[];
};

const SCREENS: Screen[] = [
  {
    bg: "var(--ob-sage-bg)",
    edge: "var(--ob-sage-edge)",
    shape: "var(--ob-sage-shape)",
    accent: "var(--ob-sage-accent)",
    tint: "var(--ob-sage-tint)",
    tintSoft: "var(--ob-sage-tint-soft)",
    deep: "var(--ob-sage-ink-deep)",
    headline: ["Your spine has a story.", "Let's track it."],
    subtext:
      "Log brace time and exercises daily, and watch the picture of your curve come together.",
    cta: "Next",
    overshoot: false,
  },
  {
    bg: "var(--ob-lav-bg)",
    edge: "var(--ob-lav-edge)",
    shape: "var(--ob-lav-shape)",
    accent: "var(--ob-lav-accent)",
    tint: "var(--ob-lav-tint)",
    tintSoft: "var(--ob-lav-tint-soft)",
    deep: "var(--ob-lav-ink-deep)",
    headline: ["Every stretch counts", "toward something."],
    subtext: "Brace hours and stretches feed one daily ring — fill it and your streak keeps going.",
    cta: "Next",
    overshoot: true,
  },
  {
    bg: "var(--ob-coral-bg)",
    edge: "var(--ob-coral-edge)",
    shape: "var(--ob-coral-shape)",
    accent: "var(--ob-coral-accent)",
    tint: "var(--ob-coral-tint)",
    tintSoft: "var(--ob-coral-tint-soft)",
    deep: "var(--ob-coral-ink-deep)",
    headline: ["Show up,", "level up."],
    subtext: "Real actions earn real XP, so every session pushes your level and streak forward.",
    cta: "Next",
    overshoot: true,
  },
  {
    bg: "var(--ob-azure-bg)",
    edge: "var(--ob-azure-edge)",
    shape: "var(--ob-azure-shape)",
    accent: "var(--ob-azure-accent)",
    tint: "var(--ob-azure-tint)",
    tintSoft: "var(--ob-azure-tint-soft)",
    deep: "var(--ob-azure-ink-deep)",
    headline: ["You're not doing", "this alone."],
    subtext:
      "Follow others managing scoliosis, swap what actually helps, and cheer each other's streaks on.",
    cta: "Next",
    overshoot: true,
  },
  {
    bg: "var(--ob-lav-bg)",
    edge: "var(--ob-lav-edge)",
    shape: "var(--ob-lav-shape)",
    accent: "var(--ob-lav-accent)",
    tint: "var(--ob-lav-tint)",
    tintSoft: "var(--ob-lav-tint-soft)",
    deep: "var(--ob-lav-ink-deep)",
    headline: ["Your data", "stays yours."],
    subtext: "Three promises we keep by design, not by policy.",
    cta: "Get started",
    overshoot: false,
    chips: [
      "Stored on this device",
      "Never sold or shared",
      "Deletable anytime in Settings",
    ],
  },
];

export const Route = createFileRoute("/onboarding/$step")({
  head: ({ params }) => {
    const titles: Record<string, { t: string; d: string }> = {
      "1": {
        t: "Welcome to SpineUp — Your spine has a story",
        d: "Start your scoliosis-care journey with SpineUp's gamified daily tracking.",
      },
      "2": {
        t: "Track every stretch — SpineUp",
        d: "Log daily brace time and exercises, and watch your consistency ring fill up.",
      },
      "3": {
        t: "Show up, level up — SpineUp",
        d: "Earn XP, build streaks, and get rewarded for real scoliosis-care actions.",
      },
      "4": {
        t: "You're not doing this alone — SpineUp community",
        d: "Connect with other people managing scoliosis, share what works, and keep each other going.",
      },
      "5": {
        t: "Your data stays yours — SpineUp",
        d: "SpineUp stores your data on your device, never sells it, and lets you delete it anytime.",
      },
    };
    const m = titles[params.step] ?? titles["1"];
    return {
      meta: [
        { title: m.t },
        { name: "description", content: m.d },
        { property: "og:title", content: m.t },
        { property: "og:description", content: m.d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ params }) => {
    const n = Number(params.step);
    if (!Number.isFinite(n) || n < 1 || n > TOTAL) throw notFound();
    return { n };
  },
  component: StepPage,
});

function StepPage() {
  const { n } = Route.useLoaderData();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const s = SCREENS[n - 1];
  const headingRef = useRef<HTMLHeadingElement>(null);

  const go = (step: number) =>
    navigate({ to: "/onboarding/$step", params: { step: String(step) } });
  const next = () => (n < TOTAL ? go(n + 1) : navigate({ to: "/profile/setup" }));
  const skip = () => navigate({ to: "/profile/setup" });

  // Move focus to the new heading so keyboard and screen-reader users land in context.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [n]);

  // Arrow-key navigation between steps, skipped when a control owns the key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (el?.closest('[role="slider"],[role="tablist"],[role="listbox"],[role="menu"]')) return;
      if (e.key === "ArrowRight" && n < TOTAL) go(n + 1);
      if (e.key === "ArrowLeft" && n > 1) go(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  const enter = (delay: number) =>
    reduced
      ? { duration: 0.4, ease: "easeOut" as const, delay: 0 }
      : { type: "spring" as const, stiffness: 240, damping: 24, delay };

  const rise = reduced ? { opacity: 0 } : { opacity: 0, y: 14 };

  return (
    <div
      className="relative flex min-h-dvh flex-col"
      style={{
        background: `radial-gradient(120% 90% at 50% 35%, ${s.bg} 0%, ${s.bg} 45%, ${s.edge} 100%)`,
        color: s.tint,
      }}
    >
      <StepAnnouncer
        message={`Step ${n} of ${TOTAL}. ${s.headline[0]} ${s.headline[1]} ${s.subtext}`}
      />

      <header className="relative z-10 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex min-w-12 items-center">
          {n > 1 ? (
            <IconButton icon={ArrowLeft} label="Go back" onClick={() => go(n - 1)} tint={s.tint} />
          ) : (
            <span className="block h-12 w-12" />
          )}
        </div>
        <ProgressDots step={n} total={TOTAL} tint={s.tint} />
        <div className="flex min-w-12 justify-end">
          {n > 1 ? (
            <SmallLink onClick={skip} tint={s.tint} ariaLabel="Skip onboarding">
              Skip
            </SmallLink>
          ) : (
            <span className="block h-12 w-12" />
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <div className="flex flex-1 items-center justify-center py-6">
          <div
            className="relative grid place-items-center"
            {...(n === 2
              ? {
                  role: "progressbar" as const,
                  "aria-valuemin": 0,
                  "aria-valuemax": 100,
                  "aria-valuenow": 70,
                  "aria-label": "Example daily consistency ring, 70 percent complete",
                }
              : {})}
          >
            {n === 1 ? (
              <Breathing>
                <MorphShape index={0} fill={s.shape} accent={s.accent} overshoot={false} />
              </Breathing>
            ) : (
              <MorphShape
                index={n - 1}
                fill={s.shape}
                accent={s.accent}
                overshoot={s.overshoot}
                progress={n === 2 ? 0.7 : undefined}
                nodes={n === 4}
                layered={n === 5}
                size={n === 5 ? 232 : 300}
              />
            )}
            {n === 3 && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <CountUp to={120} color={s.tint} />
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-sm">
          <motion.h1
            ref={headingRef}
            tabIndex={-1}
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.06)}
            className="font-serif text-[2.6rem] font-black leading-[1.02] tracking-tight outline-offset-4 focus-visible:outline-2"
            style={{ outlineColor: `color-mix(in oklab, ${s.tint} 55%, transparent)` }}
          >
            <span className="block">{s.headline[0]}</span>
            <span className="block text-[2rem] font-bold italic" style={{ color: s.tintSoft }}>
              {s.headline[1]}
            </span>
          </motion.h1>

          <motion.p
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.14)}
            className="mt-4 text-sm leading-relaxed"
            style={{ color: s.tintSoft }}
          >
            {s.subtext}
          </motion.p>

          {s.chips && (
            <ul className="mt-4 flex flex-col gap-2">
              {s.chips.map((chip, i) => (
                <motion.li
                  key={chip}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={enter(0.2 + i * 0.07)}
                  className="inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-semibold"
                  style={{
                    color: s.tint,
                    background: `color-mix(in oklab, ${s.tint} 16%, transparent)`,
                  }}
                >
                  {chip}
                </motion.li>
              ))}
            </ul>
          )}

          <motion.div
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.24)}
            className="mt-8 flex justify-center pb-2"
          >
            <KeycapCta label={s.cta} onClick={next} fill={s.tint} ink={s.deep} text={s.edge} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
