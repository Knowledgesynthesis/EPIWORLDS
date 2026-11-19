import { useState } from 'react';
import { powerTwoProportions, sampleSizeTwoProportions } from '../../lib/epi';
import { Stat } from '../ui/Callout';
import { Segmented, Slider } from '../ui/controls';
import { LineChart } from '../viz/LineChart';

export function PowerCalculator() {
  const [p0, setP0] = useState(0.1);
  const [rr, setRr] = useState(2);
  const [alpha, setAlpha] = useState<'0.05' | '0.01'>('0.05');
  const [power, setPower] = useState(0.8);
  const [dropout, setDropout] = useState(0.1);
  const p1 = Math.min(0.99, p0 * rr);
  const a = Number(alpha);
  const n = sampleSizeTwoProportions(p0, p1, a, power);
  const nInflated = Number.isFinite(n) ? Math.ceil(n / (1 - dropout)) : Infinity;
  const nMax = Number.isFinite(n) ? Math.max(50, Math.min(20000, Math.ceil(n * 2.5))) : 1000;
  const curve = Array.from({ length: 60 }, (_, i) => {
    const m = Math.max(5, Math.round(((i + 1) / 60) * nMax));
    return { x: m, y: powerTwoProportions(p0, p1, m, a) };
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Slider label="Risk in control group" value={p0} min={0.01} max={0.5} step={0.01} onChange={setP0} format={(v) => `${Math.round(v * 100)}%`} />
        <Slider label="Risk ratio to detect" value={rr} min={0.3} max={3} step={0.05} onChange={setRr} format={(v) => v.toFixed(2)} hint={`Treatment-group risk: ${(p1 * 100).toFixed(1)}%`} />
        <Slider label="Power (1 − β)" value={power} min={0.5} max={0.95} step={0.05} onChange={setPower} format={(v) => `${Math.round(v * 100)}%`} />
        <Slider label="Expected loss to follow-up" value={dropout} min={0} max={0.4} step={0.05} onChange={setDropout} format={(v) => `${Math.round(v * 100)}%`} />
      </div>
      <Segmented label="Two-sided α" value={alpha} onChange={setAlpha} options={[{ value: '0.05', label: 'α = 0.05' }, { value: '0.01', label: 'α = 0.01' }]} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Per group (analysable)" value={Number.isFinite(n) ? n.toLocaleString() : '∞'} tone="primary" />
        <Stat label="Per group to enrol" value={Number.isFinite(nInflated) ? nInflated.toLocaleString() : '∞'} sub={`inflated for ${Math.round(dropout * 100)}% loss`} />
        <Stat label="Expected events (both groups)" value={Number.isFinite(n) ? Math.round(n * (p0 + p1)).toLocaleString() : '—'} />
      </div>
      <LineChart
        title="Power as a function of sample size per group"
        series={[{ id: 'p', label: 'Power', color: 'series-1', points: curve }]}
        xLabel="Participants per group"
        yLabel="Power"
        xDomain={[0, nMax]}
        yDomain={[0, 1]}
        xTicks={[0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * nMax))}
        yTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        fmtX={(v) => v.toLocaleString()}
        fmtY={(v) => `${Math.round(v * 100)}%`}
        marker={Number.isFinite(n) ? { x: n, label: `n = ${n}` } : undefined}
      />
      <p className="formula block overflow-x-auto whitespace-nowrap py-2 text-xs sm:text-sm">
        n = [z₁₋α/₂·√(2p̄(1−p̄)) + z₁₋β·√(p₁(1−p₁) + p₀(1−p₀))]² / (p₁ − p₀)²
      </p>
      <p className="text-xs text-muted-foreground">Normal approximation without continuity correction (Fleiss, Levin & Paik 2003). Cluster, crossover and time-to-event designs need different formulas.</p>
    </div>
  );
}
