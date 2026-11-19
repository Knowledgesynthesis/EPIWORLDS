import { colorVar, type SeriesColor } from './colors';
import { useWidth } from './useWidth';

export interface ForestRow {
  label: string;
  est: number;
  lo?: number;
  hi?: number;
  color?: SeriesColor;
  /** Bold the row (e.g. a pooled estimate). */
  emphasis?: boolean;
}

interface ForestPlotProps {
  rows: ForestRow[];
  /** Vertical reference for the true causal effect. */
  truth?: number;
  measure?: string;
  domain?: [number, number];
  title: string;
}

const candidateTicks = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50];

/** Ratio estimates with 95% CIs on a log scale, with values printed per row. */
export function ForestPlot({ rows, truth, measure = 'RR', domain, title }: ForestPlotProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const finite = rows.filter((r) => Number.isFinite(r.est) && r.est > 0);
  const vals = finite.flatMap((r) => [r.est, r.lo ?? r.est, r.hi ?? r.est]).filter((v) => Number.isFinite(v) && v > 0);
  if (truth) vals.push(truth);
  vals.push(1);
  let [lo, hi] = domain ?? [Math.min(...vals) / 1.15, Math.max(...vals) * 1.15];
  lo = Math.max(lo, 0.05);
  hi = Math.min(Math.max(hi, lo * 1.5), 50);

  const labelW = Math.min(150, Math.max(84, width * 0.3));
  const valueW = width < 420 ? 92 : 120;
  const plotL = labelW + 8;
  const plotR = width - valueW - 8;
  const rowH = 30;
  const top = 8;
  const plotBottom = top + rows.length * rowH;
  const height = plotBottom + 40;
  const x = (v: number) => plotL + ((Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * (plotR - plotL);
  // Keep 1 and any tick at least 34px from the previous kept tick.
  const ticks: number[] = [];
  for (const t of candidateTicks.filter((v) => v >= lo && v <= hi)) {
    const prev = ticks[ticks.length - 1];
    if (prev === undefined || x(t) - x(prev) >= 34) ticks.push(t);
    else if (t === 1) ticks[ticks.length - 1] = 1;
  }
  const clampX = (v: number) => x(Math.min(hi, Math.max(lo, v)));

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height} role="img" aria-label={title} className="block text-[12px]">
        <title>{title}</title>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={top} y2={plotBottom} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={x(t)} y={plotBottom + 15} textAnchor="middle" fill="var(--chart-muted)" className="tabular">
              {t}
            </text>
          </g>
        ))}
        <line x1={x(1)} x2={x(1)} y1={top} y2={plotBottom} stroke="var(--chart-axis)" strokeWidth={1.5} />
        {truth !== undefined && (
          <g>
            <line x1={x(truth)} x2={x(truth)} y1={top} y2={plotBottom} stroke="var(--chart-ink-2)" strokeWidth={1.5} strokeDasharray="4 3" />
          </g>
        )}
        {rows.map((r, i) => {
          const cy = top + i * rowH + rowH / 2;
          const color = colorVar[r.color ?? 'series-1'];
          const ok = Number.isFinite(r.est) && r.est > 0;
          const hasCI = ok && r.lo !== undefined && r.hi !== undefined && Number.isFinite(r.lo) && Number.isFinite(r.hi);
          return (
            <g key={r.label + i}>
              <text x={0} y={cy + 4} fill="var(--chart-ink)" fontWeight={r.emphasis ? 600 : 400}>
                {r.label.length > 22 && width < 420 ? r.label.slice(0, 21) + '…' : r.label}
              </text>
              {hasCI && <line x1={clampX(r.lo!)} x2={clampX(r.hi!)} y1={cy} y2={cy} stroke={color} strokeWidth={2} strokeLinecap="round" />}
              {ok && (
                <rect
                  x={clampX(r.est) - (r.emphasis ? 6 : 5)}
                  y={cy - (r.emphasis ? 6 : 5)}
                  width={r.emphasis ? 12 : 10}
                  height={r.emphasis ? 12 : 10}
                  rx={r.emphasis ? 1 : 5}
                  fill={color}
                  stroke="var(--chart-surface)"
                  strokeWidth={2}
                  transform={r.emphasis ? `rotate(45 ${clampX(r.est)} ${cy})` : undefined}
                />
              )}
              <text x={width} y={cy + 4} textAnchor="end" fill="var(--chart-ink)" className="tabular" fontWeight={r.emphasis ? 600 : 400}>
                {ok ? r.est.toFixed(2) : '—'}
                {hasCI && <tspan fill="var(--chart-ink-2)">{` (${r.lo!.toFixed(2)}–${r.hi!.toFixed(2)})`}</tspan>}
              </text>
            </g>
          );
        })}
        <text x={(plotL + plotR) / 2} y={height - 4} textAnchor="middle" fill="var(--chart-muted)" fontSize={11}>
          {measure} (log scale){truth !== undefined ? ' · dashed = true effect' : ''}
        </text>
      </svg>
    </div>
  );
}
