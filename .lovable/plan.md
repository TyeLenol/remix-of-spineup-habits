## Goal
Build ONLY the TODAY page (`/today`) — the daily rehab + check-in home — in the app's existing M3 Expressive language (serif display, single-hue tonal surfaces, spring motion, keycap buttons), with accessibility as a first-class constraint. Uses the existing on-device profile store; no backend.

## Layout (mobile-first, single column, max-w-md, thumb-reachable)

```text
┌──────────────────────────────┐
│ Good morning, Ada       [av] │  greeting + date
│                              │
│ ╭──────── XP HERO ────────╮  │  sage tonal card
│ │ Lv 4 · Steady Riser     │  │
│ │ ((wavy progress arc))   │  │  reuses wavyArcPath
│ │ 240 / 400 XP  · today ▮▮│  │  daily goal bar
│ ╰─────────────────────────╯  │
│                              │
│ ╭─ CHECK-IN SUMMARY ──────╮  │  tap → /today/check-in
│ │ Not logged yet      →   │  │  or: pain 4/10 · Okay · 16h
│ ╰─────────────────────────╯  │
│                              │
│ Today's routine     3 / 8    │
│ ▸ Cat-Cow Mobilization  90s  │  8 expandable exercise rows
│ ▸ Side-Plank Core Hold  30s  │  each: check target, steps, cues
│ ...                          │
│                              │
│ ▾ Today's details            │  collapsible
│   stretches · streak · appt  │
└──────────────────────────────┘
```

Rationale (HCI): one primary action per band, progressive disclosure for exercise detail so the list stays scannable (Miller/chunking), status card above the fold answers "what do I owe today?" in under a second.

## Sections to build
1. **Header** — greeting by time of day, formatted date, streak flame chip.
2. **XP hero card** — level, level title, wavy M3 progress arc (reuse `wavyArcPath` from `morphShapes.ts`), total XP, and a separate daily-XP-goal linear indicator. Spring fill with slight overshoot; static under reduced motion.
3. **Check-in summary card** — single large tap target; shows "Not logged yet" or pain/10 · mood · brace hours. Opens a full-screen check-in flow route (pain slider 0–10, 5-point mood, pain locations, fatigue + tightness, conditional brace hours from profile brace status, notes). Saving awards XP and returns.
4. **Exercise library** — the 8 named exercises with duration, steps, posture cues. Row = accordion; checkbox marks complete (+XP), with spring check morph and haptic. Completed rows dim and reorder to bottom is NOT done (avoids disorienting motion) — they just get a completed treatment.
5. **Today's details** — collapsible: stretches completed today, active streak, next appointment countdown.

## Motion (M3 Expressive, reduced-motion safe)
- Emphasized-decelerate easing tokens already in `styles.css`.
- Card entry: staggered rise (40ms apart), spring.
- Exercise expand: height + opacity with emphasized easing; check mark springs with slight overshoot.
- XP arc: spring overfill and settle.
- Every animation collapses to a plain fade under `prefers-reduced-motion`.

## Accessibility
- Semantic `<main>`, one `<h1>`, sectioned `<h2>`s.
- Exercise checkboxes are real buttons with `aria-pressed`; accordions use `aria-expanded` + `aria-controls`.
- XP arc is `role="progressbar"` with value text; decorative SVG `aria-hidden`.
- Pain scale is a labelled slider with `aria-valuetext` ("4 out of 10"); mood is a radiogroup.
- 48px minimum targets, visible focus rings, `aria-live` for XP gains, tokens only for color (4.5:1 verified), `h-dvh` not `h-screen`.

## Data
- Extend the existing on-device store with a `today` slice: date-stamped exercise completions, check-in record, XP ledger, streak. Nothing leaves the device.

## Technical notes
- New: `src/routes/today.tsx` (+ `today.check-in.tsx`), `src/lib/today-store.ts`, `src/lib/exercises.ts`, components under `src/components/today/`.
- Reuses `morphShapes.ts` arc math and the keycap button treatment from onboarding.
- Route metadata: unique title/description/og tags for the Today page.
- Scope: only the TODAY domain — no Journey, Community, or Me pages.
