import { useMemo, useState } from 'react';
import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { repeatedStudies } from '../../lib/sim';
import { Button } from '../ui/Button';
import { Callout, Stat } from '../ui/Callout';
import { Slider } from '../ui/controls';
import { useWidth } from '../viz/useWidth';

const presets = [
  { label: 'Small randomised trials', n: 100, k: 1 },
  { label: 'Large randomised trials', n: 2000, k: 1 },
  { label: 'Large confounded cohorts', n: 2000, k: 1.4 },
];

const STUDIES = 100;

export function RepeatedSampling() {
  const [n, setN] = useState(200);
  const [p0, setP0] = useState(0.1);
  const [rr, setRr] = useState(1.5);
  const [k, setK] = useState(1);
  const [seed, setSeed] = useState(7);
  const studies = useMemo(() => repeatedStudies({ nPerGroup: n, baselineRisk: p0, trueRR: rr, confoundingFactor: k, studies: STUDIES, seed }), [n, p0, rr, k, seed]);
  const finite = studies.filter((s) => Number.isFinite(s.est) && Number.isFinite(s.lo));
  const coverage = finite.filter((s) => s.covers).length / Math.max(1, finite.length);
  const signif = finite.filter((s) => s.lo > 1 || s.hi < 1).length / Math.max(1, finite.length);
  const sorted = [...finite].map((s) => s.est).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? NaN;
  const [ref, outer] = useWidth<HTMLDivElement>();
  const width = outer - 16; // inside p-2 padding

  // Log-scale strip of 100 CIs.
  const H = 240;
  const m = { l: 40, r: 10, t: 10, b: 24 };
  const lo = Math.max(0.1, Math.min(rr, 1, ...finite.map((s) => s.lo)) / 1.1);
  const hi = Math.min(20, Math.max(rr * k, rr, 1, ...finite.map((s) => s.hi)) * 1.1);
  const sy = (v: number) => m.t + (1 - (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * (H - m.t - m.b);
  const sx = (i: number) => m.l + ((i + 0.5) / STUDIES) * (width - m.l - m.r);
  const ticks = [0.25, 0.5, 1, 2, 4, 8, 16].filter((t) => t >= lo && t <= hi);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p.label} type="button" onClick={() => { setN(p.n); setK(p.k); }} className="rounded-full border px-3 py-1 text-xs hover:border-primary hover:bg-accent">
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Slider label="Participants per group" value={n} min={50} max={5000} step={50} onChange={setN} format={(v) => v.toLocaleString()} />
        <Slider label="Risk in the unexposed" value={p0} min={0.02} max={0.3} step={0.01} onChange={setP0} format={(v) => `${Math.round(v * 100)}%`} />
        <Slider label="True causal risk ratio" value={rr} min={0.5} max={3} step={0.05} onChange={setRr} format={(v) => v.toFixed(2)} />
        <Slider
          label="Uncontrolled confounding (exposed group's baseline risk ×)"
          value={k}
          min={0.6}
          max={1.8}
          step={0.05}
          onChange={setK}
          format={(v) => (v === 1 ? 'none' : `×${v.toFixed(2)}`)}
          hint="1 = exchangeable groups, as randomisation provides on average."
        />
      </div>
      <div ref={ref} className="rounded-lg border bg-[var(--chart-surface)] p-2">
        <svg width={width} height={H} role="img" aria-label={`${STUDIES} simulated studies with 95% confidence intervals`} className="block text-[11px]">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={sy(t)} y2={sy(t)} stroke="var(--chart-grid)" />
              <text x={m.l - 6} y={sy(t) + 4} textAnchor="end" fill="var(--chart-muted)">{t}</text>
            </g>
          ))}
          <line x1={m.l} x2={width - m.r} y1={sy(1)} y2={sy(1)} stroke="var(--chart-axis)" strokeWidth={1.5} />
          {finite.map((s) => (
            <g key={s.index}>
              <line x1={sx(s.index)} x2={sx(s.index)} y1={sy(Math.min(hi, s.hi))} y2={sy(Math.max(lo, s.lo))} stroke={s.covers ? 'var(--status-good)' : 'var(--status-bad)'} strokeWidth={Math.max(1, Math.min(3, width / 260))} strokeLinecap="round" opacity={0.85} />
              <circle cx={sx(s.index)} cy={sy(Math.min(hi, Math.max(lo, s.est)))} r={1.8} fill="var(--chart-ink)" />
            </g>
          ))}
          <line x1={m.l} x2={width - m.r} y1={sy(rr)} y2={sy(rr)} stroke="var(--chart-ink)" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={width - m.r} y={sy(rr) - 6} textAnchor="end" fill="var(--chart-ink)" stroke="var(--chart-surface)" strokeWidth={4} paintOrder="stroke" fontWeight={600}>true RR {rr.toFixed(2)}</text>
          <text x={m.l} y={H - 6} fill="var(--chart-muted)">{STUDIES} identical studies, each with its 95% CI (log scale)</text>
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-2 pb-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-good" />CI contains the truth</span>
          <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-bad" />CI misses the truth</span>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="CI coverage of the truth" value={`${Math.round(coverage * 100)}%`} tone={coverage < 0.9 ? 'bad' : 'good'} sub="nominal: 95%" />
        <Stat label="Median estimate" value={median.toFixed(2)} sub={`truth ${rr.toFixed(2)}`} />
        <Stat label="CIs excluding RR = 1" value={`${Math.round(signif * 100)}%`} sub={rr === 1 && k === 1 ? 'type I error rate' : 'empirical power'} />
        <Button variant="outline" className="h-full min-h-[4.5rem]" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="h-4 w-4" /> Run 100 new studies
        </Button>
      </div>
      {k === 1 ? (
        <Callout kind="good" title="Random error only">
          About 95 of 100 intervals capture the truth whatever the sample size — larger studies just make them narrower. Individual small studies can still land far from the truth; that is what the CI expresses.
        </Callout>
      ) : (
        <Callout kind="bad" title="Systematic error">
          Every study estimates about {(rr * k).toFixed(2)} instead of {rr.toFixed(2)}. Increasing n narrows the intervals around the wrong value, so coverage falls toward 0%. Precision is not validity.
        </Callout>
      )}
    </div>
  );
}
