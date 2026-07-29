import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { XpHero } from "@/components/today/XpHero";
import { CheckInCard } from "@/components/today/CheckInCard";
import { ExerciseList } from "@/components/today/ExerciseList";
import { DetailsPanel } from "@/components/today/DetailsPanel";
import { DAILY_XP_GOAL, EXERCISES } from "@/lib/exercises";
import { useToday } from "@/lib/today-store";

export const Route = createFileRoute("/today/")({
  head: () => ({
    meta: [
      { title: "Today — SpineUp daily scoliosis routine" },
      {
        name: "description",
        content:
          "Log your daily scoliosis check-in, work through eight guided rehab exercises, and watch your XP, level and streak grow.",
      },
      { property: "og:title", content: "Today — SpineUp daily scoliosis routine" },
      {
        property: "og:description",
        content:
          "Your daily scoliosis rehab home: check-in, guided exercises, streaks and XP — all stored on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TodayPage,
});

function greeting(h: number) {
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function TodayPage() {
  const reduced = useReducedMotion();
  const t = useToday();

  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const dailyXp = useMemo(
    () =>
      t.doneToday.reduce(
        (sum, id) => sum + (EXERCISES.find((e) => e.id === id)?.xp ?? 0),
        0,
      ) + (t.checkIn ? 25 : 0),
    [t.doneToday, t.checkIn],
  );

  const rise = (i: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: {
            type: "spring" as const,
            stiffness: 220,
            damping: 26,
            delay: i * 0.05,
          },
        };

  return (
    <main className="flex flex-col gap-4 px-4 pb-16 pt-6">
      <motion.header {...rise(0)}>
        <p className="text-sm font-semibold uppercase tracking-wide text-warm-ink-muted">
          {dateLabel}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-black leading-tight text-warm-ink">
          {greeting(now.getHours())}.{" "}
          <span className="italic text-sage-ink">Let's move.</span>
        </h1>
      </motion.header>

      <div role="status" aria-live="polite" className="sr-only">
        {t.hydrated
          ? `${dailyXp} of ${DAILY_XP_GOAL} daily XP earned. ${t.doneToday.length} of ${EXERCISES.length} exercises complete.`
          : ""}
      </div>

      <motion.div {...rise(1)}>
        <XpHero
          level={t.level}
          title={t.title}
          into={t.into}
          needed={t.needed}
          progress={t.progress}
          totalXp={t.state.xp}
          dailyXp={dailyXp}
          dailyGoal={DAILY_XP_GOAL}
        />
      </motion.div>

      <motion.div {...rise(2)}>
        <DetailsPanel
          completedToday={t.doneToday.length}
          streak={t.streak}
          appointment={t.state.appointment}
        />
      </motion.div>

      <motion.div {...rise(3)}>
        <CheckInCard checkIn={t.checkIn} />
      </motion.div>

      <motion.div {...rise(4)} className="mt-2">
        <ExerciseList done={t.doneToday} onToggle={t.toggleExercise} />
      </motion.div>
    </main>
  );
}
