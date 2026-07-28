## Goal
Upgrade the SpineUp onboarding to a more expressive, more accessible M3 Expressive flow.

## 1. Screen 2: squiggly progress ring
Replace the plain stroked circle with an M3-Expressive **wavy progress indicator**:
- Generate the ring path procedurally in `morphShapes.ts`: a circle radius R with a sine ripple (`r = R + amp*sin(k*θ)`), emitted as a smooth cubic path.
- The **filled portion** is squiggly; the remaining track is a flat low-opacity arc — matching M3's active-wave / flat-track behavior.
- Animate the wave phase slowly (continuous drift) plus the spring fill sweep already in place. Reduced motion: static wave, no drift, final progress set instantly.
- Rounded caps, same accent token, same 0.7 progress.

## 2. Subtext on every screen
Screens 1–3 get one short supporting line each (screen 4 already has one). Kept to a single sentence, muted tint, below the headline:
- 1: how daily tracking builds the picture of your curve
- 2: brace hours and exercises filling one daily ring
- 3: XP and streaks earned from real actions
Note: this reverses the earlier "no subtext on 1–3" instruction, per this request.

## 3. Back as an icon
Swap the "Back" word for a lucide `ArrowLeft` inside a circular icon button, `aria-label="Go back"`, minimum 48x48 target, visible focus ring.

## 4. Creative M3 Expressive buttons
Rework the CTA and secondary controls into a shared expressive button set:
- **Shape morph on press**: the CTA's border radius animates from pill to a squircle-ish smaller radius on press (M3 Expressive's signature shape-change), springing back on release — layered on top of the existing keycap depth press.
- Icon-button variants (back/skip) get the same shape-morph and a tonal container hover/press state.
- All motion spring-based, all disabled under reduced motion (opacity/fill state changes only).

## 5. Accessibility pass
- **Contrast**: verify every tint/tintSoft pair against its background reaches WCAG AA (4.5:1 body, 3:1 large); darken/lighten the affected tokens in `src/styles.css` rather than in components. `tintSoft` at italic-accent size and subtext size is the main risk.
- **Landmarks/headings**: keep exactly one `<main>` and one `<h1>` per screen; the layout route owns page structure.
- **Live region**: announce screen changes with a polite `aria-live` status ("Step 2 of 4: Every stretch counts") so screen-reader users get context on navigation.
- **Progress semantics**: give the ring itself `role="progressbar"` with `aria-valuenow/min/max` and a label; keep decorative shapes `aria-hidden`.
- **Focus management**: move focus to the heading on each step change so keyboard/SR users don't get dropped at the top of the document.
- **Keyboard**: Left/Right arrow keys navigate steps; all controls reachable in DOM order; `focus-visible` rings use a token with sufficient contrast against each screen's background (not `white/40` everywhere).
- **Targets**: all interactive elements ≥48x48 CSS px.
- **Motion**: honor `prefers-reduced-motion` everywhere, including the new wave drift.

## Technical notes
- New/changed: `morphShapes.ts` (wavy ring generator), `MorphShape.tsx` (WavyRingFill replaces RingFill), `OnboardingChrome.tsx` (expressive CTA + icon button + live region + progress dots labeling), `onboarding.$step.tsx` (subtexts, focus management, arrow-key nav, icon back), `styles.css` (contrast-fixed tint tokens, focus-ring token).
- No backend or data changes.
