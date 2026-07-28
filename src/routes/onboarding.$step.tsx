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
    cta: "Get started",
    overshoot: false,
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
    if (!Number.isFinite(n) || n < 1 || n > 4) throw notFound();
    return { n };
  },
  component: StepPage,
});

function StepPage() {
  const { n } = Route.useLoaderData();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const s = SCREENS[n - 1];

  const go = (step: number) => navigate({ to: "/onboarding/$step", params: { step: String(step) } });
  const next = () => (n < 4 ? go(n + 1) : navigate({ to: "/profile/setup" }));
  const skip = () => navigate({ to: "/profile/setup" });

  return (
    <div
      className="relative flex min-h-dvh flex-col"
      style={{
        background: `radial-gradient(120% 90% at 50% 35%, ${s.bg} 0%, ${s.bg} 45%, ${s.edge} 100%)`,
        color: s.tint,
      }}
    >
      <header className="relative z-10 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex min-w-12 items-center">
          {n > 1 ? (
            <SmallLink onClick={() => go(n - 1)} tint={s.tint} ariaLabel="Go back">
              Back
            </SmallLink>
          ) : (
            <span className="block h-12 w-12" />
          )}
        </div>
        <ProgressDots step={n} tint={s.tint} />
        <div className="flex min-w-12 justify-end">
          {n > 1 ? (
            <SmallLink onClick={skip} tint={s.tint}>
              Skip
            </SmallLink>
          ) : (
            <span className="block h-12 w-12" />
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="relative grid place-items-center">
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
              />
            )}
            {n === 3 && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <CountUp to={120} color={s.tint} />
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="w-full max-w-sm"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced
              ? { duration: 0.4, ease: "easeOut" }
              : { type: "spring", stiffness: 220, damping: 22, delay: 0.08 }
          }
        >
          <h1 className="font-serif text-[2.6rem] font-black leading-[1.02] tracking-tight">
            <span className="block">{s.headline[0]}</span>
            <span className="block text-[2rem] font-bold italic" style={{ color: s.tintSoft }}>
              {s.headline[1]}
            </span>
          </h1>

          {n === 4 && (
            <p className="mt-4 text-sm leading-relaxed" style={{ color: s.tintSoft }}>
              Your entries are stored locally on this device. We never sell or share them with
              third parties, and you can delete everything at any time from Settings.
            </p>
          )}

          <div className="mt-8 flex justify-center pb-2">
            <KeycapCta
              label={s.cta}
              onClick={next}
              fill={s.tint}
              ink={s.deep}
              text={s.edge}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
