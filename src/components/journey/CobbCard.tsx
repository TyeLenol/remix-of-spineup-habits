import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Info, Minus } from "lucide-react";
import {
  REGIONS,
  TIMEFRAMES,
  changeSummary,
  painPoints,
  seriesFor,
  withinTimeframe,
  type CurveRegion,
  type Measurement,
  type Timeframe,
} from "@/lib/journey-store";
import type { TodayState } from "@/lib/today-store";

const W = 320;
const H = 160;
const PAD = { top: 16, right: 16, bottom: 26, left: 32 };

function smoothPath(pts: Array<{ x: number; y: number }>) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${
      p2.x - (p3.x - p1.x) / 6
    } ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const ms = (iso: string) => new Date(`${iso}T00:00:00`).getTime();

export function CobbCard({
  measurements,
  today,
}: {
  measurements: Measurement[];
  today: TodayState;
}) {
  const reduced = useReducedMotion();
  const [region, setRegion] = useState<CurveRegion>("thoracic");
  const [tf, setTf] = useState<Timeframe>("90d");
  const [overlay, setOverlay] = useState(false);

  const series = useMemo(
    () => withinTimeframe(seriesFor(measurements, region), tf),
    [measurements, region, tf],
  );
  const pain = useMemo(
    () => (overlay ? painPoints(today, tf) : []),
    [overlay, today, tf],
  );
  const summary = changeSummary(series);

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const { pts, painPts, min, max } = useMemo(() => {
    if (series.length === 0) return { pts: [], painPts: [], min: 0, max: 0 };
    const values = series.map((m) => m.degrees);
    const lo = Math.max(0, Math.min(...values) - 6);
    const hi = Math.max(...values) + 6;
    const span = Math.max(1, hi - lo);

    const times = [...series.map((s) => ms(s.date)), ...pain.map((p) => ms(p.date))];
    const t0 = Math.min(...times);
    const t1 = Math.max(...times);
    const xFor = (iso: string) =>
      t1 === t0 ? PAD.left + innerW / 2 : PAD.left + ((ms(iso) - t0) / (t1 - t0)) * innerW;

    return {
      min: lo,
      max: hi,
      pts: series.map((m) => ({
        x: xFor(m.date),
        y: PAD.top + innerH - ((m.degrees - lo) / span) * innerH,
      })),
      painPts: pain.map((p) => ({
        x: xFor(p.date),
        y: PAD.top + innerH - (p.pain / 10) * innerH,
      })),
    };
  }, [series, pain, innerW, innerH]);

  const path = smoothPath(pts);
  const painPath = smoothPath(painPts);
  const DeltaIcon =
    summary?.direction === "improved"
      ? ArrowDownRight
      : summary?.direction === "increased"
        ? ArrowUpRight
        : Minus;

  const calm = reduced
    ? { duration: 0.3 }
    : ({ type: "spring", stiffness: 120, damping: 26 } as const);

  return (
    <section
      aria-labelledby="cobb-heading"
      className="rounded-[24px] border border-outline-variant bg-warm-surface p-5 text-warm-ink"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="cobb-heading" className="font-serif text-xl font-black leading-tight">
            Cobb angle trend
          </h2>
          <p className="text-sm text-warm-ink-muted">Curve measurements over time</p>
        </div>
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
              className={`min-h-12 flex-1 rounded-full px-3 text-sm font-bold outline-offset-2 transition-colors focus-visible:outline-3 focus-visible:outline-sage-ink ${
                on
                  ? "bg-sage-ink text-warm-bg"
                  : "border border-outline-variant text-warm-ink"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Timeframe"
        className="mt-2 flex overflow-hidden rounded-full border border-outline-variant"
      >
        {TIMEFRAMES.map((t) => {
          const on = t.id === tf;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              aria-label={t.long}
              onClick={() => setTf(t.id)}
              className={`min-h-12 flex-1 text-sm font-bold outline-offset-[-3px] transition-colors focus-visible:outline-3 focus-visible:outline-sage-ink ${
                on ? "bg-sage-ink text-warm-bg" : "bg-transparent text-warm-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <motion.button
        type="button"
        aria-pressed={overlay}
        onClick={() => setOverlay((v) => !v)}
        whileTap={reduced ? undefined : { scale: 0.95, borderRadius: 14 }}
        transition={{ type: "spring", stiffness: 560, damping: 26 }}
        className={`mt-2 flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-bold outline-offset-2 focus-visible:outline-3 focus-visible:outline-coral-ink ${
          overlay
            ? "bg-coral-container text-warm-ink"
            : "border border-outline-variant text-warm-ink"
        }`}
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: overlay ? "var(--coral)" : "var(--md-outline-variant)" }}
          aria-hidden
        />
        Compare with pain levels
      </motion.button>

      {series.length === 0 ? (
        <p className="mt-4 rounded-[16px] bg-warm-surface-high px-4 py-5 text-sm font-medium text-warm-ink-muted">
          No {REGIONS.find((r) => r.id === region)?.label.toLowerCase()} measurements in
          this timeframe. Add one from your clinic report to start the trend.
        </p>
      ) : (
        <>
          <div className="mt-4 flex items-end gap-4">
            <p className="font-serif text-5xl font-black leading-none tabular-nums text-warm-ink">
              {summary?.latest.degrees}
              <span className="text-2xl">°</span>
            </p>
            <p className="flex items-center gap-1 pb-1 text-sm font-bold text-warm-ink-muted">
              <DeltaIcon className="h-4 w-4" aria-hidden />
              {summary && summary.previous
                ? `${summary.delta > 0 ? "+" : ""}${summary.delta}° since ${fmt(summary.previous.date)}`
                : "First measurement"}
            </p>
          </div>
          {summary?.direction === "stable" && summary.previous && (
            <p className="mt-1 text-xs font-medium text-warm-ink-muted">
              Under 5° — within normal measurement variation.
            </p>
          )}

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-3 w-full"
            role="img"
            aria-label={`${region} Cobb angle trend, ${TIMEFRAMES.find((t) => t.id === tf)?.long}: ${series
              .map((m) => `${fmt(m.date)} ${m.degrees} degrees`)
              .join(", ")}${
              overlay && pain.length
                ? `. Pain overlay: ${pain.map((p) => `${fmt(p.date)} ${p.pain} out of 10`).join(", ")}`
                : ""
            }`}
          >
            {[max, (max + min) / 2, min].map((v, i) => {
              const y = PAD.top + (i / 2) * innerH;
              return (
                <g key={v}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={y}
                    y2={y}
                    stroke="var(--md-outline-variant)"
                    strokeWidth={1}
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

            {overlay && painPts.length > 1 && (
              <motion.path
                key={`pain-${tf}`}
                d={painPath}
                fill="none"
                stroke="var(--coral)"
                strokeWidth={3}
                strokeDasharray="6 6"
                strokeLinecap="round"
                initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity: 1 }}
                animate={reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
                transition={calm}
              />
            )}

            <motion.path
              key={`cobb-${region}-${tf}`}
              d={path}
              fill="none"
              stroke="var(--sage-ink)"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
              animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
              transition={calm}
            />

            {pts.map((p, i) => (
              <circle
                key={series[i].id}
                cx={p.x}
                cy={p.y}
                r={4}
                fill="var(--sage-ink)"
                stroke="var(--warm-surface)"
                strokeWidth={2}
              />
            ))}
            {overlay &&
              painPts.map((p, i) => (
                <circle
                  key={`pp-${pain[i].date}`}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill="var(--coral)"
                />
              ))}

            <text x={PAD.left} y={H - 6} fontSize={9} fill="currentColor" opacity={0.75} fontWeight={700}>
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

          {overlay && (
            <p className="text-xs font-medium text-warm-ink-muted">
              <span className="text-sage-ink">Solid</span> = Cobb angle ·{" "}
              <span className="text-coral-ink">dashed</span> = daily pain (0–10)
            </p>
          )}
        </>
      )}

      <p className="mt-3 flex items-start gap-2 border-t border-outline-variant pt-3 text-xs font-medium text-warm-ink-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Manual entry only. For personal tracking, not a diagnostic tool.
      </p>
    </section>
  );
}
