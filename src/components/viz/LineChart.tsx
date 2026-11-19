import { useState } from 'react';
import { colorVar, type SeriesColor } from './colors';
import { useWidth } from './useWidth';

export interface LineSeries {
  id: string;
  label: string;
  color: SeriesColor;
  points: { x: number; y: number }[];
  dashed?: boolean;
}

interface LineChartProps {
  series: LineSeries[];
  title: string;
  xLabel: string;
  yLabel: string;
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  fmtX?: (v: number) => string;
  fmtY?: (v: number) => string;
  /** Vertical marker (e.g. the current setting). */
  marker?: { x: number; label: string };
  height?: number;
}

/** Multi-series line chart with a hover/touch crosshair readout. */
export function LineChart({ series, title, xLabel, yLabel, xDomain, yDomain, xTicks, yTicks, fmtX = String, fmtY = String, marker, height = 260 }: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hoverX, setHoverX] = useState<number | null>(null);
  const m = { l: 48, r: 14, t: 12, b: 42 };
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;
  const sx = (v: number) => m.l + ((v - xDomain[0]) / (xDomain[1] - xDomain[0])) * iw;
  const sy = (v: number) => m.t + ih - ((v - yDomain[0]) / (yDomain[1] - yDomain[0])) * ih;
  const path = (pts: { x: number; y: number }[]) =>
    pts
      .filter((p) => Number.isFinite(p.y))
      .map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(Math.min(yDomain[1], Math.max(yDomain[0], p.y))).toFixed(1)}`)
      .join('');

  const allX = series[0]?.points.map((p) => p.x) ?? [];
  const nearest = (px: number) => {
    const v = xDomain[0] + ((px - m.l) / iw) * (xDomain[1] - xDomain[0]);
    let best = allX[0];
    for (const x of allX) if (Math.abs(x - v) < Math.abs(best - v)) best = x;
    return best;
  };
  const onMove = (clientX: number, target: SVGSVGElement) => {
    const r = target.getBoundingClientRect();
    const px = clientX - r.left;
    if (px < m.l || px > width - m.r) return setHoverX(null);
    setHoverX(nearest(px));
  };

  const hoverRows = hoverX === null ? [] : series.map((s) => ({ s, p: s.points.find((p) => p.x === hoverX) }));
  const tipLeft = hoverX !== null && sx(hoverX) > width / 2;

  return (
    <div ref={ref} className="relative w-full">
      {series.length > 1 && (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legend">
          {series.map((s) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <svg width="18" height="8" aria-hidden>
                <line x1="1" x2="17" y1="4" y2="4" stroke={colorVar[s.color]} strokeWidth="2" strokeDasharray={s.dashed ? '4 3' : undefined} strokeLinecap="round" />
              </svg>
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={title}
        className="block touch-pan-y text-[11px]"
        onPointerMove={(e) => onMove(e.clientX, e.currentTarget)}
        onPointerDown={(e) => onMove(e.clientX, e.currentTarget)}
        onPointerLeave={() => setHoverX(null)}
      >
        <title>{title}</title>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={width - m.r} y1={sy(t)} y2={sy(t)} stroke="var(--chart-grid)" />
            <text x={m.l - 6} y={sy(t) + 4} textAnchor="end" fill="var(--chart-muted)" className="tabular">
              {fmtY(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={sx(t)} y={height - m.b + 16} textAnchor="middle" fill="var(--chart-muted)" className="tabular">
            {fmtX(t)}
          </text>
        ))}
        <line x1={m.l} x2={width - m.r} y1={m.t + ih} y2={m.t + ih} stroke="var(--chart-axis)" />
        <text x={m.l + iw / 2} y={height - 6} textAnchor="middle" fill="var(--chart-ink-2)">
          {xLabel}
        </text>
        <text transform={`translate(12 ${m.t + ih / 2}) rotate(-90)`} textAnchor="middle" fill="var(--chart-ink-2)">
          {yLabel}
        </text>
        {marker && (
          <g>
            <line x1={sx(marker.x)} x2={sx(marker.x)} y1={m.t} y2={m.t + ih} stroke="var(--chart-ink-2)" strokeDasharray="4 3" />
            <text x={sx(marker.x) + 4} y={m.t + 10} fill="var(--chart-ink-2)">
              {marker.label}
            </text>
          </g>
        )}
        {series.map((s) => (
          <path key={s.id} d={path(s.points)} fill="none" stroke={colorVar[s.color]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? '5 4' : undefined} />
        ))}
        {hoverX !== null && (
          <g>
            <line x1={sx(hoverX)} x2={sx(hoverX)} y1={m.t} y2={m.t + ih} stroke="var(--chart-axis)" />
            {hoverRows.map(({ s, p }) =>
              p && Number.isFinite(p.y) ? (
                <circle key={s.id} cx={sx(p.x)} cy={sy(Math.min(yDomain[1], Math.max(yDomain[0], p.y)))} r={4} fill={colorVar[s.color]} stroke="var(--chart-surface)" strokeWidth={2} />
              ) : null
            )}
          </g>
        )}
      </svg>
      {hoverX !== null && (
        <div
          className="pointer-events-none absolute top-8 z-10 min-w-[8rem] rounded-md border bg-card px-3 py-2 text-xs shadow-md"
          style={tipLeft ? { right: width - sx(hoverX) + 10 } : { left: sx(hoverX) + 10 }}
        >
          <p className="tabular mb-1 font-semibold">
            {xLabel}: {fmtX(hoverX)}
          </p>
          {hoverRows.map(({ s, p }) => (
            <p key={s.id} className="tabular flex items-center gap-1.5 text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: colorVar[s.color] }} />
              {s.label}: <span className="font-medium text-foreground">{p ? fmtY(p.y) : '—'}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
