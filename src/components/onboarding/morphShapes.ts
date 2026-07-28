// Real shape interpolation: every shape is sampled as the SAME topology —
// N radial control points at identical angles — so morphing is a numeric
// interpolation of the radii (a true path morph), never an opacity crossfade.

export const N = 72;

export type ShapeName = "blob" | "ring" | "burst" | "shield";

const TAU = Math.PI * 2;

function radiusFor(shape: ShapeName, a: number): number {
  switch (shape) {
    case "blob":
      return 1 + 0.095 * Math.sin(3 * a + 0.4) + 0.06 * Math.cos(2 * a + 1.1);
    case "ring":
      return 1;
    case "burst": {
      const spikes = 6;
      const t = Math.cos(spikes * a);
      // sharpen the lobes so it reads as a burst, not a flower
      const sharp = Math.sign(t) * Math.pow(Math.abs(t), 0.55);
      return 0.72 + 0.34 * sharp;
    }
    case "shield": {
      const down = Math.max(0, Math.sin(a)); // y-down: bottom of the shape
      const taper = 1 - 0.24 * Math.pow(down, 1.6);
      const shoulder = 1 - 0.16 * Math.pow(down, 2) * Math.abs(Math.cos(a));
      const crown = 1 + 0.05 * Math.pow(Math.max(0, -Math.sin(a)), 2);
      return taper * shoulder * crown;
    }
  }
}

// hole size (as a fraction of the outer radius) per shape
const INNER: Record<ShapeName, number> = { blob: 0, ring: 0.62, burst: 0.26, shield: 0 };

export const SHAPES: ShapeName[] = ["blob", "ring", "burst", "shield"];

export const RADII: Record<ShapeName, number[]> = Object.fromEntries(
  SHAPES.map((s) => [
    s,
    Array.from({ length: N }, (_, i) => radiusFor(s, (i / N) * TAU)),
  ]),
) as Record<ShapeName, number[]>;

export const INNER_SCALE = INNER;

function catmullRomClosed(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n === 0) return "";
  let d = `M ${pts[0][0].toFixed(3)} ${pts[0][1].toFixed(3)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(3)} ${c1y.toFixed(3)}, ${c2x.toFixed(3)} ${c2y.toFixed(3)}, ${p2[0].toFixed(3)} ${p2[1].toFixed(3)}`;
  }
  return d + " Z";
}

function ringToPath(radii: number[], scale: number, cx: number, cy: number, R: number) {
  const pts = radii.map((r, i) => {
    const a = (i / radii.length) * TAU;
    const rr = r * scale * R;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as [number, number];
  });
  return catmullRomClosed(pts);
}

/**
 * Build the morphed outline at a fractional shape index (e.g. 1.37 = 37% of
 * the way from `ring` into `burst`). Radii and hole size are lerped per
 * control point, then re-emitted as one continuous cubic path.
 */
export function morphPath(index: number, cx = 100, cy = 100, R = 78): string {
  const clamped = Math.max(0, Math.min(SHAPES.length - 1, index));
  const i0 = Math.floor(clamped);
  const i1 = Math.min(SHAPES.length - 1, i0 + 1);
  const t = clamped - i0;
  const a = RADII[SHAPES[i0]];
  const b = RADII[SHAPES[i1]];
  const outer = a.map((v, i) => v + (b[i] - v) * t);
  const inner = INNER[SHAPES[i0]] + (INNER[SHAPES[i1]] - INNER[SHAPES[i0]]) * t;

  const outerPath = ringToPath(outer, 1, cx, cy, R);
  if (inner < 0.02) return outerPath;
  // reversed inner loop + evenodd gives the hole
  const innerPath = ringToPath([...outer].reverse(), inner, cx, cy, R);
  return `${outerPath} ${innerPath}`;
}
