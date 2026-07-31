## Note on stack

This project is React + TanStack Start with Tailwind tokens and `motion/react` — not Flutter. Every Flutter piece maps to an existing equivalent here (no `fl_chart`, `CarouselView`, or `flutter_expandable_fab`): charts stay hand-drawn SVG (already in `CobbCard`), the carousel becomes a scroll-snap row, the FAB becomes a spring-animated expandable button, and the bottom sheet becomes an in-app sheet. Design intent, motion values, and accessibility rules carry over unchanged.

## Take 1 — Split Spotlight

Rebuild `/journey` in this order: header → privacy banner → highlights carousel → Cobb anchor card → filterable activity log, with an expandable action FAB.

### 1. Header
- Serif display "Your history." + smaller italic sage-tinted "one day at a time." on line two.
- Both lines inside one `<h1>` with a single accessible name (visually two lines, one node for screen readers).

### 2. Privacy banner
- Structural tonal strip, 4px radius (not a 24px card): dark sage fill, lightest sage text, small lock icon.
- Copy: "Your clinical data is stored locally on this device."
- Dismiss text button, 48px target, dismissal persisted in the journey store so it stays gone.

### 3. Highlights & badges carousel
- Horizontal scroll-snap row of chips/cards: streaks, level-ups, latest angle logged, check-in milestones — derived from existing streak/XP/measurement data, no new backend.
- Keyboard: arrow-key navigation across cards, `aria-roledescription` list semantics, no hidden focus traps.
- Gamification stays here so the log below is purely clinical.

### 4. Cobb angle anchor card (rework of `CobbCard`)
- Warm off-white surface, 24px radius.
- Region tabs stay; add a timeframe segmented control (7d / 30d / 90d / All), selected = filled sage ink, unselected = outlined transparent.
- "Compare with pain" toggle chip: when on, overlays a coral pain line on a secondary scale, with a small legend.
- Line morphs to new data on timeframe/region change with a calm spring (stiffness ~120, damping ~26); reduced motion → fade.
- Disclaimer inside the card, small text + info icon: "Manual entry only. For personal tracking, not a diagnostic tool."

### 5. Activity log (clinical only)
- Filter chips: All / Exercises / Journal / Cobb angle / Appointments.
- Grouped by human-readable day header ("Today", "Yesterday", "Jul 28"), vertical rail with circular nodes; sage-tinted icons for exercises/measurements, coral for journal entries.
- Completed appointments get an outlined-card treatment to distinguish them from habits.
- Milestone rows are removed from here (they now live in the carousel).
- Live region announces the filtered count.

### 6. Expandable action button
- Bottom-right sage keycap FAB (darker offset edge, compress-on-press).
- Opens with a bouncy spring (stiffness ~140, damping ~12) into two labelled actions: "Log Cobb angle" (ruler) and "Schedule appointment" (calendar).
- Background scrim fades in, focus moves into the menu, Escape closes and returns focus to the FAB.

### 7. Cobb entry sheet
- "Log Cobb angle" opens a bottom sheet (replaces the full-page `/journey/measurement` as the primary path; the route stays as a fallback link).
- Large outlined numeric field, region selector, date row defaulting to today with backdating, bottom keycap "Save measurement".
- Duplicate same-day entry shows a toast: "Measurement logged. Note: XP is only awarded for the first log of the day."

## Technical details
- New: `HighlightsRail.tsx`, `PrivacyBanner.tsx`, `JourneyFab.tsx`, `MeasurementSheet.tsx`, `AppointmentSheet.tsx` under `src/components/journey/`.
- Edited: `CobbCard.tsx` (timeframe + pain overlay + disclaimer), `ActivityLog.tsx` (day grouping, appointment rows, expanded filters), `journey.index.tsx` (new order), `journey-store.ts` (appointments, banner-dismissed flag, timeframe helpers).
- `JourneyStats` tiles are folded into the highlights rail and the stats section is dropped from the page.
- Colors only from existing sage / coral / warm tokens; both light and dark verified. Coral used solely for pain overlay, journal icons and alerts.
- All targets ≥48px, 4.5:1 contrast, and every animation has a `useReducedMotion` fade fallback.
