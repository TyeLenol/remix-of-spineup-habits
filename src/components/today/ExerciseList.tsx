import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { EXERCISES, type Exercise } from "@/lib/exercises";

export function ExerciseList({
  done,
  onToggle,
}: {
  done: string[];
  onToggle: (id: string, xp: number) => void;
}) {
  return (
    <section aria-labelledby="routine-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="routine-heading" className="font-serif text-xl font-black text-warm-ink">
          Today's routine
        </h2>
        <p className="text-sm font-semibold tabular-nums text-warm-ink-muted">
          {done.length} of {EXERCISES.length} done
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {EXERCISES.map((ex) => (
          <li key={ex.id}>
            <ExerciseRow ex={ex} done={done.includes(ex.id)} onToggle={onToggle} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExerciseRow({
  ex,
  done,
  onToggle,
}: {
  ex: Exercise;
  done: boolean;
  onToggle: (id: string, xp: number) => void;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div
      className={`overflow-hidden rounded-[24px] border transition-colors ${
        done
          ? "border-sage-ink/40 bg-sage-container/60"
          : "border-outline-variant bg-warm-surface"
      }`}
    >
      <div className="flex items-stretch">
        <motion.button
          type="button"
          onClick={() => onToggle(ex.id, ex.xp)}
          aria-pressed={done}
          aria-label={`${done ? "Mark not done" : "Mark done"}: ${ex.name}, ${ex.target}, ${ex.xp} XP`}
          whileTap={reduced ? undefined : { scale: 0.88, borderRadius: 14 }}
          transition={{ type: "spring", stiffness: 600, damping: 18 }}
          className="my-2 ml-2 flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              done
                ? "border-sage-ink bg-sage-ink text-warm-bg"
                : "border-outline text-transparent"
            }`}
            aria-hidden
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        </motion.button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-16 flex-1 items-center gap-3 py-3 pr-4 text-left outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
        >
          <span className="min-w-0 flex-1">
            <span
              className={`block font-semibold leading-tight text-warm-ink ${done ? "line-through opacity-70" : ""}`}
            >
              {ex.name}
            </span>
            <span className="block text-sm text-warm-ink-muted">
              {ex.target} · +{ex.xp} XP
            </span>
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 26 }}
            className="text-warm-ink-muted"
            aria-hidden
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.35, ease: [0.05, 0.7, 0.1, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-[4.25rem] text-sm text-warm-ink">
              <ol className="list-decimal space-y-1 pl-4">
                {ex.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-3 rounded-2xl bg-lavender-container px-3 py-2 text-lavender-ink">
                <span className="font-semibold">Posture cue: </span>
                {ex.cue}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
