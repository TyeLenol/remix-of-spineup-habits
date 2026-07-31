import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Activity, CalendarCheck, Flame, Ruler, Trophy } from "lucide-react";
import type { Highlight } from "@/lib/journey-store";

const ICONS = {
  flame: Flame,
  trophy: Trophy,
  ruler: Ruler,
  calendar: CalendarCheck,
  activity: Activity,
};

const TONES: Record<Highlight["tone"], string> = {
  sage: "bg-sage-container text-on-sage",
  coral: "bg-coral-container text-warm-ink",
  plain: "border border-outline-variant bg-warm-surface text-warm-ink",
};

export function HighlightsRail({ items }: { items: Highlight[] }) {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, i: number) => {
    const dir =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -99 : e.key === "End" ? 99 : 0;
    if (!dir) return;
    e.preventDefault();
    const cards = listRef.current?.querySelectorAll<HTMLLIElement>("[data-hl]");
    if (!cards?.length) return;
    const next =
      dir === -99 ? 0 : dir === 99 ? cards.length - 1 : Math.min(cards.length - 1, Math.max(0, i + dir));
    cards[next].focus();
    cards[next].scrollIntoView({ inline: "center", block: "nearest", behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="highlights-heading">
      <h2
        id="highlights-heading"
        className="text-xs font-bold uppercase tracking-wide text-warm-ink-muted"
      >
        Highlights &amp; badges
      </h2>
      <ul
        ref={listRef}
        aria-label="Highlights and badges, use arrow keys to browse"
        className="-mx-4 mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((h, i) => {
          const Icon = ICONS[h.icon];
          return (
            <motion.li
              key={h.id}
              data-hl
              tabIndex={0}
              onKeyDown={(e) => onKeyDown(e, i)}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduced
                  ? { duration: 0.3 }
                  : { type: "spring", stiffness: 260, damping: 24, delay: i * 0.05 }
              }
              className={`min-w-[10.5rem] shrink-0 snap-start rounded-[20px] px-4 py-3 outline-offset-2 focus-visible:outline-3 focus-visible:outline-sage-ink ${TONES[h.tone]}`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <p className="mt-2 font-serif text-base font-black leading-tight">
                {h.title}
              </p>
              <p className="text-xs font-medium opacity-80">{h.detail}</p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
