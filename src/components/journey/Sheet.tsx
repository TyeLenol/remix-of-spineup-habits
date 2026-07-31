import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

/** Bottom sheet with M3 enter/exit motion, scrim, Escape and focus handling. */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("input, select, textarea, button")
        ?.focus();
    }, 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-on-sage/45"
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={
              reduced ? { duration: 0.25 } : { type: "spring", stiffness: 240, damping: 28 }
            }
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-warm-bg px-5 pb-8 pt-3 text-warm-ink"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-outline" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-serif text-2xl font-black leading-tight">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 grid h-12 w-12 shrink-0 place-items-center rounded-full text-warm-ink-muted outline-offset-2 hover:bg-warm-surface focus-visible:outline-3 focus-visible:outline-sage-ink"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function KeycapButton({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileTap={reduced ? undefined : { y: 3, borderRadius: 16 }}
      transition={{ type: "spring", stiffness: 560, damping: 26 }}
      className="mt-5 min-h-14 w-full rounded-full bg-sage-ink text-base font-bold text-warm-bg shadow-[0_5px_0_0_var(--on-sage)] outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink"
    >
      {children}
    </motion.button>
  );
}

export const fieldClass =
  "min-h-14 w-full rounded-[16px] border border-outline bg-transparent px-4 text-base font-semibold text-warm-ink outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink";
export const labelClass = "text-sm font-bold text-warm-ink";
