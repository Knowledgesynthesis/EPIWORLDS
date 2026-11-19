import { useState } from 'react';
import { interactionContrasts } from '../../lib/epi';
import { Callout, Stat } from '../ui/Callout';
import { Slider } from '../ui/controls';
import { LineChart } from '../viz/LineChart';

type Risks = { r00: number; r10: number; r01: number; r11: number };

const presets: { label: string; r: Risks; note: string }[] = [
  { label: 'Same RR, different RD', r: { r00: 0.05, r10: 0.1, r01: 0.2, r11: 0.4 }, note: 'RR = 2 in both strata (no multiplicative modification), but the exposure causes 5 vs 20 extra cases per 100: strong additive modification.' },
  { label: 'Same RD, different RR', r: { r00: 0.1, r10: 0.2, r01: 0.3, r11: 0.4 }, note: '10 extra cases per 100 in both strata (no additive modification) while the RR falls from 2.0 to 1.33.' },
  { label: 'Synergy (smoking × asbestos pattern)', r: { r00: 0.002, r10: 0.02, r01: 0.01, r11: 0.1 }, note: 'Each exposure multiplies risk (×10 and ×5) and jointly ×50: no multiplicative interaction, yet RERI = 36 — most joint cases need both exposures.' },
  { label: 'Qualitative (crossover)', r: { r00: 0.2, r10: 0.1, r01: 0.2, r11: 0.3 }, note: 'Exposure is protective when M is absent and harmful when present — modification on every scale.' },
];

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export function EffectModification() {
  const [r, setR] = useState<Risks>(presets[0].r);
  const [note, setNote] = useState(presets[0].note);
  const set = (k: keyof Risks) => (v: number) => {
    setR((q) => ({ ...q, [k]: v }));
    setNote('');
  };
  const ic = interactionContrasts(r.r00, r.r10, r.r01, r.r11);
  const rrM0 = r.r10 / r.r00;
  const rrM1 = r.r11 / r.r01;
  const rdM0 = r.r10 - r.r00;
  const rdM1 = r.r11 - r.r01;
  const tol = 0.02;
  const multHomog = Math.abs(Math.log(rrM1 / rrM0)) < tol;
  const addHomog = Math.abs(rdM1 - rdM0) < 0.002;
  const yMax = Math.max(0.05, Math.ceil(Math.max(r.r00, r.r10, r.r01, r.r11) * 10 + 0.5) / 10);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p.label} type="button" onClick={() => { setR(p.r); setNote(p.note); }} className="rounded-full border px-3 py-1 text-xs hover:border-primary hover:bg-accent">
            {p.label}
          </button>
        ))}
      </div>
      {note && <Callout kind="tip" title="Scenario">{note}</Callout>}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-medium">Risk of the outcome in each group</p>
          <Slider label="Unexposed, modifier absent (R₀₀)" value={r.r00} min={0.001} max={0.6} step={0.001} onChange={set('r00')} format={pct} />
          <Slider label="Exposed, modifier absent (R₁₀)" value={r.r10} min={0.001} max={0.9} step={0.001} onChange={set('r10')} format={pct} />
          <Slider label="Unexposed, modifier present (R₀₁)" value={r.r01} min={0.001} max={0.6} step={0.001} onChange={set('r01')} format={pct} />
          <Slider label="Exposed, modifier present (R₁₁)" value={r.r11} min={0.001} max={0.99} step={0.001} onChange={set('r11')} format={pct} />
        </div>
        <div className="space-y-4">
          <LineChart
            title="Risk by exposure within each stratum of the modifier"
            height={230}
            series={[
              { id: 'm0', label: 'Modifier absent', color: 'series-1', points: [{ x: 0, y: r.r00 }, { x: 1, y: r.r10 }] },
              { id: 'm1', label: 'Modifier present', color: 'series-2', points: [{ x: 0, y: r.r01 }, { x: 1, y: r.r11 }] },
            ]}
            xLabel="Exposure"
            yLabel="Risk"
            xDomain={[-0.15, 1.15]}
            yDomain={[0, yMax]}
            xTicks={[0, 1]}
            yTicks={Array.from({ length: 5 }, (_, i) => +((i * yMax) / 4).toFixed(3))}
            fmtX={(v) => (v === 0 ? 'Unexposed' : v === 1 ? 'Exposed' : '')}
            fmtY={(v) => `${Math.round(v * 1000) / 10}%`}
          />
          <p className="text-xs text-muted-foreground">Parallel lines = same risk difference (no additive modification).</p>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="RR, modifier absent" value={rrM0.toFixed(2)} sub={`RD ${(rdM0 * 100).toFixed(1)} per 100`} />
            <Stat label="RR, modifier present" value={rrM1.toFixed(2)} sub={`RD ${(rdM1 * 100).toFixed(1)} per 100`} />
            <Stat label="RERI (additive)" value={ic.reri.toFixed(2)} tone="primary" sub={Math.abs(ic.reri) < 0.05 ? 'no additive interaction' : ic.reri > 0 ? 'super-additive' : 'sub-additive'} />
            <Stat label="RR₁₁ / (RR₁₀·RR₀₁)" value={ic.multiplicative.toFixed(2)} sub={Math.abs(Math.log(ic.multiplicative)) < tol ? 'no multiplicative interaction' : ic.multiplicative > 1 ? 'super-multiplicative' : 'sub-multiplicative'} />
          </div>
        </div>
      </div>
      <Callout kind="info" title="Reading the result">
        {multHomog && addHomog && 'No modification on either scale — this only happens when one of the factors has no effect.'}
        {multHomog && !addHomog && 'No modification on the multiplicative scale, but there is on the additive scale. A pooled RR is fine to report, yet the absolute benefit of removing the exposure differs between strata.'}
        {!multHomog && addHomog && 'No modification on the additive scale (same RD), but the RRs differ. Whether "the effect differs" depends on the scale you choose — state it.'}
        {!multHomog && !addHomog && (Math.sign(rdM0) !== Math.sign(rdM1) ? 'The direction of effect differs between strata (qualitative interaction): report stratum-specific effects, never a pooled estimate.' : 'Modification on both scales. Report stratum-specific estimates on both scales (Knol & VanderWeele 2012).')}
      </Callout>
    </div>
  );
}
