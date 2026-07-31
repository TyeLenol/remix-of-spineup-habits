import { motion, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";

export function PrivacyBanner({ onDismiss }: { onDismiss: () => void }) {
  const reduced = useReducedMotion();
  return (
    <motion.aside
      role="note"
      aria-label="Privacy notice"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0 }}
      transition={
        reduced ? { duration: 0.25 } : { type: "spring", stiffness: 240, damping: 26 }
      }
      className="flex items-center gap-3 overflow-hidden rounded-[4px] bg-on-sage px-4 py-2 text-sage-container"
    >
      <Lock className="h-4 w-4 shrink-0" aria-hidden />
      <p className="flex-1 text-sm font-medium leading-snug">
        Your clinical data is stored locally on this device.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="-mr-2 min-h-12 shrink-0 rounded-[4px] px-3 text-sm font-bold text-sage underline-offset-4 outline-offset-2 hover:underline focus-visible:outline-3 focus-visible:outline-sage"
      >
        Dismiss
      </button>
    </motion.aside>
  );
}
