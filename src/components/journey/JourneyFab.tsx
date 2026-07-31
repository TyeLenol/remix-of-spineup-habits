import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarPlus, Plus, Ruler, X } from "lucide-react";

export function JourneyFab({
  open,
  onOpenChange,
  onLogAngle,
  onSchedule,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onLogAngle: () => void;
  onSchedule: () => void;
}) {
  const reduced = useReducedMotion();
  const fabRef = useRef<HTMLButtonElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) firstRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        fabRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const bouncy = reduced
    ? { duration: 0.25 }
    : ({ type: "spring", stiffness: 140, damping: 12 } as const);

  const actions = [
    { label: "Log Cobb angle", icon: Ruler, run: onLogAngle, ref: firstRef },
    { label: "Schedule appointment", icon: CalendarPlus, run: onSchedule, ref: undefined },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-30 bg-on-sage/40"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md flex-col items-end gap-3 px-4 pb-6">
        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              role="menu"
              aria-label="Journey actions"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
              transition={bouncy}
              className="pointer-events-auto flex flex-col items-end gap-2"
            >
              {actions.map((a) => (
                <button
                  key={a.label}
                  ref={a.ref}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onOpenChange(false);
                    a.run();
                  }}
                  className="flex min-h-12 items-center gap-2 rounded-full bg-warm-surface px-5 text-sm font-bold text-warm-ink shadow-[0_3px_0_0_var(--md-outline)] outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
                >
                  <a.icon className="h-4 w-4" aria-hidden />
                  {a.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={fabRef}
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={open ? "Close actions" : "Add to your journey"}
          onClick={() => onOpenChange(!open)}
          whileTap={reduced ? undefined : { y: 3, borderRadius: 18 }}
          transition={{ type: "spring", stiffness: 560, damping: 26 }}
          className="pointer-events-auto grid h-16 w-16 place-items-center rounded-[28px] bg-sage-ink text-warm-bg shadow-[0_5px_0_0_var(--on-sage)] outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
        >
          <motion.span
            animate={reduced ? undefined : { rotate: open ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <Plus className="h-6 w-6" aria-hidden />}
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}
