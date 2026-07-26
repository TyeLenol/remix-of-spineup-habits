import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LivingBackground } from "@/components/onboarding/LivingBackground";
import { OnboardingTopBar } from "@/components/onboarding/OnboardingTopBar";
import { Spry } from "@/components/onboarding/Spry";
import { ChargeHoldButton } from "@/components/onboarding/ChargeHoldButton";
import { DragPillar } from "@/components/onboarding/DragPillar";
import { ArcadeSmash } from "@/components/onboarding/ArcadeSmash";

export const Route = createFileRoute("/onboarding/$step")({
  head: ({ params }) => {
    const titles: Record<string, { t: string; d: string }> = {
      "1": { t: "Meet Spry — SpineUp", d: "Charge up and begin your spine-care journey with Spry." },
      "2": { t: "Track Your Curve — SpineUp", d: "Log daily progress and grow your streak." },
      "3": { t: "Level Up Your Routine — SpineUp", d: "Log brace time and earn XP for real health actions." },
      "4": { t: "You're set — SpineUp", d: "Connect with people who get it." },
    };
    const m = titles[params.step] ?? titles["1"];
    return {
      meta: [
        { title: m.t },
        { name: "description", content: m.d },
        { property: "og:title", content: m.t },
        { property: "og:description", content: m.d },
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
  const next = () => {
    if (n < 4) navigate({ to: "/onboarding/$step", params: { step: String(n + 1) } });
  };
  const composition = (`screen${n}` as "screen1" | "screen2" | "screen3" | "screen4");

  return (
    <>
      <LivingBackground composition={composition} />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <OnboardingTopBar step={n} />
        {n === 1 && <Screen1 onNext={next} />}
        {n === 2 && <Screen2 onNext={next} />}
        {n === 3 && <Screen3 onNext={next} />}
        {n === 4 && <Screen4Stub />}
      </div>
    </>
  );
}

function Screen1({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative flex flex-1 flex-col px-6 pb-10">
      <div className="relative pt-4">
        <h1 className="font-serif text-6xl font-black leading-[0.9] tracking-tight">
          <span className="block" style={{ color: "var(--warm-ink)" }}>LET'S</span>
          <motion.span
            className="block -rotate-2"
            style={{ color: "var(--coral)" }}
            animate={{ rotate: [-2, -1, -2] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            MOVE
          </motion.span>
          <motion.span
            className="block rotate-1"
            style={{ color: "var(--lavender)" }}
            animate={{ rotate: [1, 2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            TOGETHER.
          </motion.span>
        </h1>
        <p className="mt-6 max-w-[16rem] text-base font-bold" style={{ color: "var(--warm-ink-muted)" }}>
          Your spine-care journey, reinvented.
        </p>
        <div className="pointer-events-none absolute -right-6 top-24">
          <Spry pose="idle" size={220} />
        </div>
      </div>

      <div className="mt-auto flex justify-center">
        <ChargeHoldButton onComplete={onNext} />
      </div>
    </div>
  );
}

function Screen2({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative flex flex-1 flex-col px-6 pb-10">
      <h1 className="font-serif text-6xl font-black leading-[0.9] tracking-tight">
        <span className="block" style={{ color: "var(--warm-ink)" }}>TRACK</span>
        <span className="block" style={{ color: "var(--coral)" }}>YOUR</span>
        <span className="block" style={{ color: "var(--warm-ink)" }}>CURVE.</span>
      </h1>
      <p className="mt-5 max-w-[18rem] text-sm font-semibold" style={{ color: "var(--warm-ink-muted)" }}>
        Log your daily progress, track your symptom patterns over time, and watch your consistency grow to unlock new insights.
      </p>

      <div className="mt-6 flex-1">
        <DragPillar onComplete={onNext} />
      </div>
    </div>
  );
}

function Screen3({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative flex flex-1 flex-col items-center px-6 pb-10 text-center">
      <h1 className="font-serif text-6xl font-black leading-[0.9] tracking-tight">
        <span className="block" style={{ color: "var(--warm-ink)" }}>LEVEL UP</span>
        <span className="block" style={{ color: "var(--lavender)" }}>YOUR</span>
        <span className="block" style={{ color: "var(--lavender)" }}>ROUTINE.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-[18rem] text-sm font-semibold" style={{ color: "var(--warm-ink-muted)" }}>
        Wearing your brace is hard work. You deserve to get rewarded for it.
      </p>

      <div className="mt-6 flex flex-1 items-end pb-4">
        <ArcadeSmash onComplete={onNext} />
      </div>
    </div>
  );
}

function Screen4Stub() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Spry pose="waving" size={160} />
      <h2 className="font-serif text-3xl font-black">Screen 4 — coming next</h2>
      <p className="max-w-xs text-sm" style={{ color: "var(--warm-ink-muted)" }}>
        Connect with people who get it. This step will be planned once Screens 1–3 land.
      </p>
    </div>
  );
}