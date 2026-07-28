## Goal
Grow onboarding from 4 to 5 screens, add a Community screen, and rebuild the final Privacy screen so it no longer reads as a repeat of screen 1 — while keeping every existing animation that still serves the user (HCI-checked).

## New flow

| # | Theme | Hue family | Central shape | Motion signature |
|---|---|---|---|---|
| 1 | Welcome | Sage | Blob | Slow breathing loop (unchanged) |
| 2 | Tracking | Lavender | Wavy progress ring | Spring overfill + wave drift (unchanged) |
| 3 | Rewards | Coral | Burst + count-up | Spring scale-bounce (unchanged) |
| 4 | Community | **Azure (new family)** | Rosette / linked-nodes cluster | Nodes spring in one by one, links draw between them |
| 5 | Privacy | Lavender | Layered shield | No overshoot; slow inward settle |

## 1. New Community screen (4)
- New color family in `styles.css`: `--ob-azure-*`, solid `#155E75` with a same-hue edge `#082F3E` (dark-mode variant too), tints from the same family, all pairs checked for 4.5:1.
- New morph target `cluster` in `morphShapes.ts`: a 5-lobe rosette on the shared 72-point topology, so the coral burst genuinely morphs into it (still a real path morph, not a crossfade).
- Overlay layer: 5 satellite dots on a circle plus connecting chords. Dots spring in with staggered delay (M3 Expressive staggered container transform); chords draw via `pathLength` 0→1 after each dot lands. Reduced motion: everything static and faded in.
- Copy: headline "You're not doing this alone." / italic accent "Find your people."; subtext about connecting with others managing scoliosis — sharing progress, tips, and encouragement.

## 2. Redesigned Privacy screen (5)
Problem: shield + centered headline currently mirrors screen 1's silhouette and rhythm. Fixes:
- Shape becomes a **layered shield**: outer shield outline plus a smaller concentric inner shield and a short vertical "spine" line, drawn with an inward settle rather than a bounce — visually denser and clearly not the screen-1 blob.
- **Composition change**: shape scaled smaller and offset, with three short trust chips ("On your device", "Never sold", "Delete anytime") entering as a staggered vertical list under the headline — a different layout rhythm from the single-block screens.
- Keeps the no-overshoot rule; motion is a soft, certain settle.

## 3. HCI / M3 Expressive pass on existing motion
- Keep: breathing blob, spring ring overfill, burst bounce, shape-morph button press, keycap depth. These map to M3 Expressive's emphasized easing + spring physics and each communicates the screen's concept.
- Change (HCI-driven): the CountUp on screen 3 currently runs 1.1s — shorten to ~0.9s and ease out harder so the number is readable sooner (Doherty threshold / avoid waiting on decorative motion).
- Change: arrow-key navigation currently fires on every keydown without dependency scoping; make it explicit and skip when a control has focus and would handle the key itself.
- Add: staggered content entry (headline → subtext → CTA) with small offsets, giving hierarchy through motion instead of one block sliding up.
- Progress dots go 4 → 5 everywhere; announcer, aria-valuemax, loader bounds, and head metadata all updated for step 5.

## 4. Accessibility (carried forward and extended)
- New azure tokens contrast-verified; chips and links use tokens, not hardcoded colors.
- All new interactive/informative elements labeled; decorative dots/chords `aria-hidden`.
- Community node animation and chip stagger both disabled under `prefers-reduced-motion`.
- Focus still moves to the heading per step; 48px targets retained.

## Technical notes
- Files: `src/styles.css` (azure family), `src/components/onboarding/morphShapes.ts` (cluster shape + layered shield helper), `src/components/onboarding/MorphShape.tsx` (node/chord overlay, layered shield), `src/routes/onboarding.$step.tsx` (5 screens, new copy, chips, stagger, bounds), `src/components/onboarding/OnboardingChrome.tsx` (chip component, dots total).
- No backend or data changes.
