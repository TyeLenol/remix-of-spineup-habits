# SpineUp Onboarding — Web Prototype Plan (M3 Expressive, Android-first)

Building a Figma-Make-style clickable prototype of the SpineUp onboarding in this TanStack Start + React project. The prototype **visually emulates Material 3 Expressive** as it would render on Android — same tokens, shapes, motion curves, and component anatomy — implemented in React + Tailwind so it can be shown in-browser. This is not a Flutter build; it's a faithful M3 look-and-feel preview.

## M3 Expressive commitments (applied everywhere)

- **Color roles**, not raw colors: `primary` (sage), `onPrimary`, `primaryContainer`, `onPrimaryContainer`, `secondary` (coral), `tertiary` (lavender), `surface`, `surfaceContainer`, `surfaceContainerHigh`, `outline`, `outlineVariant`, plus warm off-white `background`. Dark variant defined via M3 tonal logic (darker warm surfaces, brighter accents).
- **Shape scale**: `xs 4 / sm 8 / md 12 / lg 16 / xl 28 / xxl 36 / xxxl 48` — cards/surfaces sit at xl–xxxl (28–48dp), buttons at full/pill per Expressive.
- **Motion**: M3 Expressive spring tokens (spatial fast/default/slow, effects fast/default/slow) via Motion for React; page transitions use the "emphasized" easing `cubic-bezier(0.2, 0, 0, 1)` at 500ms.
- **Type scale**: M3 display/headline/title/body/label roles. Display-Large used for the big alignment-breaking headlines with per-word weight/tilt overrides for the Expressive personality.
- **Touch targets**: 48dp min everywhere, 56dp for primary CTAs, per Material accessibility.
- **State layers**: hover/focus/pressed overlays at M3's 8/10/12% opacity on the `on-` role.
- **Keycap button treatment** is layered on top of the M3 filled-button anatomy: opaque role fill + a darker-tonal offset shape beneath implying depth; press compresses the top layer into the offset and springs back on M3 spatial-fast.

## Scope of this pass

1. M3 token layer + shared onboarding shell (progress, back, skip, auto-advance)
2. Screen 1 — Meet Spry / press-and-hold Charge-Up
3. Screen 2 — Track Your Curve / drag-to-fill pillar
4. Screen 3 — Level Up Your Routine / arcade smash
5. Accessibility fallbacks on every gesture

Screen 4, account creation, real data model, dark-mode toggle UI are out of scope this pass (dark tokens exist, no switcher yet).

## Route + file layout

```text
src/routes/
  index.tsx                       -> redirects to /onboarding/1
  onboarding.tsx                  -> layout: living background + M3 top app bar (back/progress/skip) + <Outlet/>
  onboarding.$step.tsx            -> renders step 1|2|3 by param, guards range

src/components/onboarding/
  LivingBackground.tsx            -> two morphing blobs + drifting M3 shape-scale geometry (per-screen composition prop)
  Spry.tsx                        -> SVG mascot, pose prop: idle | charging | dragging | excited | waving
  KeycapButton.tsx                -> M3 filled-button anatomy + darker-tonal offset; press compresses to offset
  ChargeHoldButton.tsx            -> press-and-hold liquid fill + sparkles + haptic; tap fallback
  DragPillar.tsx                  -> vertical pillar, Spry as draggable knob; tap-to-fill fallback
  ArcadeSmash.tsx                 -> chunky offset-shadow button + LCD XP counter + geometric confetti
  OnboardingTopBar.tsx            -> M3 top app bar: back (hidden step 1), 4-dot progress, skip text button
  useAutoAdvance.ts               -> success -> celebrate delay -> navigate next
  useHaptics.ts                   -> navigator.vibrate wrapper, no-op when unsupported

src/styles.css                    -> M3 role tokens + shape scale + motion easing vars
```

## Design tokens (src/styles.css, oklch, M3 role names)

Added under `:root` and `.dark`, then registered in `@theme inline` as Tailwind utilities:

- Role colors: `--md-sys-color-primary` (sage), `--md-sys-color-on-primary`, `--md-sys-color-primary-container`, `--md-sys-color-secondary` (coral), `--md-sys-color-tertiary` (lavender), `--md-sys-color-surface`, `--md-sys-color-surface-container`, `--md-sys-color-surface-container-high`, `--md-sys-color-outline`, `--md-sys-color-outline-variant`, `--md-sys-color-background` (warm off-white)
- Tonal "ink" pairs for keycap offsets: `--sage-ink`, `--coral-ink`, `--lavender-ink`
- Shape: `--md-sys-shape-corner-xs..xxxl` mapped to Tailwind `rounded-*`
- Motion easing: `--md-easing-emphasized`, `--md-easing-emphasized-decel`, `--md-easing-emphasized-accel`
- Elevation: M3 tonal-elevation tokens for surface tint

Utility aliases (`bg-primary`, `bg-secondary`, `bg-surface-container`, etc.) resolve to the role vars so components read like M3.

## Shared shell

- **M3 top app bar** (small variant), pinned to safe-area top: back icon-button (hidden on step 1), 4-dot progress centered, "Skip" text button right
- **4-dot progress**: filled = complete, ringed = current, outline-variant = upcoming; Screen 4 slot pre-reserved
- **LivingBackground** with `composition` prop selects blob positions, palette (coral/lavender/sage mixes), drifting M3-shape-scale geometry (squircle, cookie-cutter, pentagon from the M3 Expressive shape family)

## Screen 1 — Meet Spry / Charge-Up

- Background composition: massive coral + lavender morphing blobs, mid-ground drifting M3 shapes
- Type: display-large headline, alignment-breaking, accent words tilted `-rotate-2` / `rotate-1`, per-word role color hits (sage / coral / lavender)
- Spry: large, overlaps type, right-edge anchored, `pose="idle"` with blink loop
- Interaction: `ChargeHoldButton` — pointer-down starts SVG-clip liquid fill on M3 spatial-slow spring, sparkles emit, haptic tick at full, auto-advance on release-at-full; release early drains
- **A11y fallback**: caption "or tap to continue" — tap runs the same success path in ~400ms then advances. Keyboard Space/Enter = tap path. `aria-label="Charge up to continue"`. Focus ring uses M3 focus indicator.

## Screen 2 — Track Your Curve / Drag Pillar

- Background: asymmetric blob bottom-right, blurred sphere top-left — same M3 shape language, new composition
- Type: "TRACK / YOUR / CURVE" massive tilted display stack
- Interaction: tall pillar right side; Spry is the drag knob. Pointer-y maps to glowing coral fill %; hit 100% → celebration (haptic, Spry `pose="excited"`), "DRAG UP TO LOG" fades out, "STREAK +1!" fades in, auto-advance
- **A11y fallback**: keycap "Tap to log" under the pillar fills to 100% via the same path. Keyboard ArrowUp/Down adjust in 10% steps, Enter commits at ≥100%. Pillar `role="slider"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax`.

## Screen 3 — Level Up Your Routine / Arcade Smash

- Background: third composition of the same language
- Chunky offset-shadow "LOG BRACE TIME" keycap, 56dp+ tall, generous width, single tap fires — no long-press, no force
- Below: LCD-styled XP display; tap runs slot-machine 0 → 150 XP tick-up over ~1.2s, neon flash frame, geometric confetti in sage/coral/lavender, Spry `pose="excited"` (rapid morph + arm flap)
- Auto-advance to `/onboarding/4` (renders a stub until Screen 4 is planned)
- **A11y**: real `<button>`, Space/Enter fire, M3 focus indicator visible, `aria-label="Log brace time and earn XP"`

## Motion

Motion for React drives fills, keycap compression, Spry pose morphs, confetti, and page transitions using M3 emphasized easing. `prefers-reduced-motion` short-circuits confetti, blob drift, and celebration morph while keeping the flow functional.

## After this ships

Once Screens 1–3 render in the preview and you've felt the pacing, I'll write the Screen 4 plan (warm calm step-down, Spry + 2–3 silhouette companions, connecting squiggle motif, auto-advance close-out) tuned to the actual energy of 1–3.

## Technical notes

- Placeholder `src/routes/index.tsx` becomes a redirect to `/onboarding/1`
- `bun add motion` for Motion for React
- All colors via M3 role tokens; no hardcoded hex in components
- `h-dvh` + safe-area insets on the top bar
- Each onboarding route sets its own `head()` title/description
- This is a **web prototype of an Android M3 experience** — not a real Flutter build; the target OS look is emulated, not native
