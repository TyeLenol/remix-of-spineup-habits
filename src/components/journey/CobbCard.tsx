import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import {
  REGIONS,
  changeSummary,
  seriesFor,
  type CurveRegion,
  type Measurement,
} from "@/lib/journey-store";

const W = 320;
const H = 150;
const PAD = { top: 16, right: 14, bottom: 26, left: 30 };

/** Smooth Catmull-Rom-ish path through the points. */
function smoothPath(pts: Array<{ x: number; y: number }>) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

export function CobbCard({ measurements }: { measurements: Measurement[] }) {
  const reduced = useReducedMotion();
  const [region, setRegion] = useState<CurveRegion>("thoracic");

  const series = useMemo(() => seriesFor(measurements, region), [measurements, region]);
  const summary = changeSummary(series);

  const { pts, min, max } = useMemo(() => {
    if (series.length === 0) return { pts: [], min: 0, max: 0 };
    const values = series.map((m) => m.degrees);
    const lo = Math.max(0, Math.min(...values) - 6);
    const hi = Math.max(...values) + 6;
    const span = Math.max(1, hi - lo);
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    return {
      min: lo,
      max: hi,
      pts: series.map((m, i) => ({
        x:
          PAD.left +
          (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW),
        y: PAD.top + innerH - ((m.degrees - lo) / span) * innerH,
      })),
    };
  }, [series]);

  const path = smoothPath(pts);
  const area =
    pts.length > 1
      ? `${path} L ${pts[pts.length - 1].x} ${H - PAD.bottom} L ${pts[0].x} ${H - PAD.bottom} Z`
      : "";

  const DeltaIcon =
    summary?.direction === "improved"
      ? ArrowDownRight
      : summary?.direction === "increased"
        ? ArrowUpRight
        : Minus;

  return (
    <section
      aria-labelledby="cobb-heading"
      className="rounded-[28px] bg-sage-container p-5 text-on-sage"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="cobb-heading" className="font-serif text-xl font-black leading-tight">
            Curve tracking
          </h2>
          <p className="text-sm opacity-80">Cobb angle over time</p>
        </div>
        <motion.div
          whileTap={reduced ? undefined : { scale: 0.94, borderRadius: 14 }}
          transition={{ type: "spring", stiffness: 560, damping: 26 }}
          className="rounded-full"
        >
          <Link
            to="/journey/measurement"
            className="flex min-h-11 items-center gap-1.5 rounded-full bg-sage-ink px-4 text-sm font-bold text-warm-bg outline-offset-2 focus-visible:outline-3 focus-visible:outline-on-sage"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add
          </Link>
        </motion.div>
      </div>

      <div role="tablist" aria-label="Curve region" className="mt-4 flex gap-2">
        {REGIONS.map((r) => {
          const on = r.id === region;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setRegion(r.id)}
              className={`min-h-11 flex-1 rounded-full px-3 text-sm font-bold outline-offset-2 transition-colors focus-visible:outline-3 focus-visible:outline-sage-ink ${
                on ? "bg-on-sage text-warm-bg" : "bg-on-sage/10 text-on-sage"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {series.length === 0 ? (
        <p className="mt-5 rounded-[20px] bg-on-sage/8 px-4 py-5 text-sm font-medium">
          No {REGIONS.find((r) => r.id === region)?.label.toLowerCase()} measurements yet.
          Add one after your next clinic visit or X-ray report to start the trend.
        </p>
      ) : (
        <>
          <div className="mt-4 flex items-end gap-4">
            <p className="font-serif text-5xl font-black leading-none tabular-nums">
              {summary?.latest.degrees}
              <span className="text-2xl">°</span>
            </p>
            <p className="flex items-center gap-1 pb-1 text-sm font-bold">
              <DeltaIcon className="h-4 w-4" aria-hidden />
              {summary && summary.previous
                ? `${summary.delta > 0 ? "+" : ""}${summary.delta}° since ${fmt(summary.previous.date)}`
                : "First measurement"}
            </p>
          </div>
          {summary?.direction === "stable" && summary.previous && (
            <p className="mt-1 text-xs font-medium opacity-80">
              Under 5° — within normal measurement variation.
            </p>
          )}

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-3 w-full"
            role="img"
            aria-label={`${region} Cobb angle trend: ${series
              .map((m) => `${fmt(m.date)} ${m.degrees} degrees`)
              .join(", ")}`}
          >
            {[max, (max + min) / 2, min].map((v, i) => {
              const y = PAD.top + (i / 2) * (H - PAD.top - PAD.bottom);
              return (
                <g key={v}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth={1}
                    opacity={0.18}
                  />
                  <text
                    x={4}
                    y={y + 4}
                    fontSize={9}
                    fill="currentColor"
                    opacity={0.7}
                    fontWeight={700}
                  >
                    {Math.round(v)}°
                  </text>
                </g>
              );
            })}

            {area && <path d={area} fill="var(--sage)" opacity={0.35} />}

            <motion.path
              d={path}
              fill="none"
              stroke="var(--sage-ink)"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
              animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
              transition={
                reduced
                  ? { duration: 0.3 }
                  : { type: "spring", stiffness: 60, damping: 18 }
              }
            />

            {pts.map((p, i) => (
              <motion.circle
                key={series[i].id}
                cx={p.x}
                cy={p.y}
                r={i === pts.length - 1 ? 6 : 4}
                fill={i === pts.length - 1 ? "var(--coral)" : "var(--sage-ink)"}
                stroke="var(--sage-container)"
                strokeWidth={2}
                initial={reduced ? { opacity: 0 } : { scale: 0 }}
                animate={reduced ? { opacity: 1 } : { scale: 1 }}
                transition={
                  reduced
                    ? { duration: 0.3 }
                    : {
                        type: "spring",
                        stiffness: 420,
                        damping: 12,
                        delay: 0.25 + i * 0.06,
                      }
                }
              />
            ))}

            <text
              x={PAD.left}
              y={H - 6}
              fontSize={9}
              fill="currentColor"
              opacity={0.75}
              fontWeight={700}
            >
              {fmt(series[0].date)}
            </text>
            {series.length > 1 && (
              <text
                x={W - PAD.right}
                y={H - 6}
                fontSize={9}
                textAnchor="end"
                fill="currentColor"
                opacity={0.75}
                fontWeight={700}
              >
                {fmt(series[series.length - 1].date)}
              </text>
            )}
          </svg>
        </>
      )}
    </section>
  );
}
