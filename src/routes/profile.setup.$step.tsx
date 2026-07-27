import { createFileRoute, useNavigate, notFound, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { TOTAL_STEPS, loadProfile } from "@/lib/profile-store";
import { StepConsent } from "@/components/profile/steps/StepConsent";
import { StepBasics } from "@/components/profile/steps/StepBasics";
import { StepBody } from "@/components/profile/steps/StepBody";
import { StepStory } from "@/components/profile/steps/StepStory";
import { StepCurve } from "@/components/profile/steps/StepCurve";
import { StepMaturity } from "@/components/profile/steps/StepMaturity";
import { StepBrace } from "@/components/profile/steps/StepBrace";
import { StepPt } from "@/components/profile/steps/StepPt";
import { StepSymptoms } from "@/components/profile/steps/StepSymptoms";
import { StepGoals } from "@/components/profile/steps/StepGoals";
import { StepCompanion } from "@/components/profile/steps/StepCompanion";
import { LivingBackground } from "@/components/onboarding/LivingBackground";
import { Spry } from "@/components/onboarding/Spry";

const DONE_STEP = TOTAL_STEPS + 1;

export const Route = createFileRoute("/profile/setup/$step")({
  head: ({ params }) => {
    const n = Number(params.step);
    const title = n === DONE_STEP ? "You're all set — SpineUp" : `Profile setup · Step ${n} — SpineUp`;
    const desc = "Private, on-device profile setup for your scoliosis journey. Every clinical field is optional.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  loader: ({ params }) => {
    const n = Number(params.step);
    if (!Number.isFinite(n) || n < 1 || n > DONE_STEP) throw notFound();
    return { n };
  },
  component: StepPage,
});

function StepPage() {
  const { n } = Route.useLoaderData();
  const navigate = useNavigate();

  const goStep = (target: number) =>
    navigate({ to: "/profile/setup/$step", params: { step: String(target) } });

  const next = () => {
    // If not in bracing-related stages, skip the brace step (step 7)
    if (n === 6) {
      const stage = loadProfile().story.treatmentStage;
      if (stage && stage !== "bracing" && stage !== "pre_op" && stage !== "post_op") {
        return goStep(8);
      }
    }
    goStep(n + 1);
  };

  const skip = () => next();

  switch (n) {
    case 1: return <StepConsent onNext={next} />;
    case 2: return <StepBasics onNext={next} />;
    case 3: return <StepBody onNext={next} onSkip={skip} />;
    case 4: return <StepStory onNext={next} onSkip={skip} />;
    case 5: return <StepCurve onNext={next} onSkip={skip} />;
    case 6: return <StepMaturity onNext={next} onSkip={skip} />;
    case 7: return <StepBrace onNext={next} onSkip={skip} />;
    case 8: return <StepPt onNext={next} onSkip={skip} />;
    case 9: return <StepSymptoms onNext={next} onSkip={skip} />;
    case 10: return <StepGoals onNext={next} />;
    case 11: return <StepCompanion onNext={() => goStep(DONE_STEP)} />;
    case DONE_STEP: return <Complete />;
    default: return null;
  }
}

function Complete() {
  const profile = typeof window !== "undefined" ? loadProfile() : null;
  return (
    <>
      <LivingBackground composition="screen1" />
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        >
          <Spry pose="excited" size={180} />
        </motion.div>

        <h1 className="mt-4 font-serif text-5xl font-black leading-[0.95]" style={{ color: "var(--warm-ink)" }}>
          <span className="block">YOU'RE</span>
          <span className="block -rotate-2" style={{ color: "var(--coral)" }}>SET.</span>
        </h1>

        <div
          className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black uppercase tracking-widest"
          style={{ background: "var(--sage-container)", color: "var(--on-sage)" }}
        >
          <Sparkles className="h-4 w-4" /> +250 XP · Profile complete
        </div>

        <p className="mt-4 max-w-xs text-sm font-semibold" style={{ color: "var(--warm-ink-muted)" }}>
          {profile?.companion.name ?? "Spry"} is ready to move with you. Let's head to your home base.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex min-h-14 items-center rounded-full px-8 text-base font-bold tracking-wide focus-visible:outline-none focus-visible:ring-4"
          style={{ background: "var(--sage)", color: "var(--on-sage)", boxShadow: "0 6px 0 0 var(--sage-ink)" }}
        >
          Enter SpineUp
        </Link>
      </div>
    </>
  );
}