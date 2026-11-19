import { useMemo, useState } from 'react';
import { homogeneityTest, mhRiskRatio, riskRatio, type Table2x2 } from '../../lib/epi';
import { binomial, mulberry32 } from '../../lib/stats';
import { fmtP } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Callout, Stat } from '../ui/Callout';
import { Slider, Toggle } from '../ui/controls';
import { DagFigure, type EdgeTone } from '../viz/DagDrawing';
import { ForestPlot } from '../viz/ForestPlot';
import { TwoByTwo } from '../viz/TwoByTwo';

interface Params {
  pC: number;
  pE0: number;
  pE1: number;
  r00: number;
  rrC: number;
  rrE: number;
}

const presets: { label: string; p: Params; note: string }[] = [
  { label: 'Positive confounding', p: { pC: 0.5, pE0: 0.2, pE1: 0.7, r00: 0.05, rrC: 4, rrE: 1.5 }, note: 'C raises both the chance of exposure and the risk of the outcome: the crude RR exaggerates the effect.' },
  { label: 'Masking (negative)', p: { pC: 0.5, pE0: 0.7, pE1: 0.2, r00: 0.05, rrC: 4, rrE: 1.5 }, note: 'C makes exposure less likely but raises risk: the crude RR hides a real harmful effect.' },
  { label: 'Confounding by indication', p: { pC: 0.5, pE0: 0.1, pE1: 0.9, r00: 0.05, rrC: 6, rrE: 0.7 }, note: 'Sicker patients (C) are treated more often. A beneficial drug (RR 0.7) looks harmful in the crude analysis — Simpson\'s paradox.' },
  { label: 'No confounding', p: { pC: 0.5, pE0: 0.4, pE1: 0.4, r00: 0.05, rrC: 4, rrE: 1.5 }, note: 'C affects the outcome but not exposure, so it is not a confounder: crude ≈ adjusted (adjusting may still improve precision).' },
];

const N = 4000;

function tables(p: Params, noisy: boolean, seed: number): [Table2x2, Table2x2] {
  const rng = mulberry32(seed);
  const make = (c: 0 | 1): Table2x2 => {
    const nc = N * (c ? p.pC : 1 - p.pC);
    const pE = c ? p.pE1 : p.pE0;
    const rU = p.r00 * (c ? p.rrC : 1);
    const rE = rU * p.rrE;
    if (!noisy) {
      const n1 = nc * pE;
      const n0 = nc - n1;
      return { a: n1 * rE, b: n1 * (1 - rE), c: n0 * rU, d: n0 * (1 - rU) };
    }
    const n1 = binomial(rng, Math.round(nc), pE);
    const n0 = Math.round(nc) - n1;
    const a = binomial(rng, n1, rE);
    const cc = binomial(rng, n0, rU);
    return { a, b: n1 - a, c: cc, d: n0 - cc };
  };
  return [make(0), make(1)];
}

const sum = (s: Table2x2[]): Table2x2 => s.reduce((acc, t) => ({ a: acc.a + t.a, b: acc.b + t.b, c: acc.c + t.c, d: acc.d + t.d }), { a: 0, b: 0, c: 0, d: 0 });

export function ConfoundingSim() {
  const [p, setP] = useState<Params>(presets[0].p);
  const [noisy, setNoisy] = useState(false);
  const [seed, setSeed] = useState(1);
  const [note, setNote] = useState(presets[0].note);
  const set = (k: keyof Params) => (v: number) => {
    setP((q) => ({ ...q, [k]: v }));
    setNote('');
  };
  const maxRisk = p.r00 * Math.max(1, p.rrC) * Math.max(1, p.rrE);
  const strata = useMemo(() => tables(p, noisy, seed), [p, noisy, seed]);
  const crude = riskRatio(sum(strata));
  const s0 = riskRatio(strata[0]);
  const s1 = riskRatio(strata[1]);
  const mh = mhRiskRatio(strata);
  const homog = homogeneityTest(strata, 'RR');
  const bias = crude.est / mh.est;
  const orCE = p.pE1 / (1 - p.pE1) / (p.pE0 / (1 - p.pE0));
  const tone = (null_: boolean): EdgeTone => (null_ ? 'faded' : 'default');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {presets.map((pr) => (
          <button
            key={pr.label}
            type="button"
            onClick={() => {
              setP(pr.p);
              setNote(pr.note);
            }}
            className="rounded-full border px-3 py-1 text-xs hover:border-primary hover:bg-accent"
          >
            {pr.label}
          </button>
        ))}
      </div>
      {note && <Callout kind="tip" title="Scenario">{note}</Callout>}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <DagFigure
            title="Causal structure of the simulation"
            height={150}
            nodes={[
              { id: 'C', label: 'C (confounder)', x: 50, y: 0 },
              { id: 'E', label: 'Exposure', x: 4, y: 100, role: 'exposure' },
              { id: 'D', label: 'Outcome', x: 96, y: 100, role: 'outcome' },
            ]}
            edges={[
              { from: 'C', to: 'E', tone: tone(Math.abs(p.pE1 - p.pE0) < 1e-9) },
              { from: 'C', to: 'D', tone: tone(p.rrC === 1) },
              { from: 'E', to: 'D', tone: tone(p.rrE === 1) },
            ]}
            caption={`C→E: odds ratio ${orCE.toFixed(2)} · C→Outcome: RR ${p.rrC.toFixed(2)} · Exposure→Outcome: true RR ${p.rrE.toFixed(2)} (same in both strata). Faded arrow = no effect.`}
          />
          <Slider label="Prevalence of C" value={p.pC} min={0.1} max={0.9} step={0.05} onChange={set('pC')} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="P(exposed | C absent)" value={p.pE0} min={0.05} max={0.95} step={0.05} onChange={set('pE0')} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="P(exposed | C present)" value={p.pE1} min={0.05} max={0.95} step={0.05} onChange={set('pE1')} format={(v) => `${Math.round(v * 100)}%`} hint="Equal to the line above → C does not affect exposure → no confounding." />
          <Slider label="RR of C on the outcome" value={p.rrC} min={0.25} max={6} step={0.25} onChange={set('rrC')} format={(v) => v.toFixed(2)} />
          <Slider label="True causal RR of exposure" value={p.rrE} min={0.25} max={3} step={0.05} onChange={set('rrE')} format={(v) => v.toFixed(2)} />
          <Slider label="Baseline risk (unexposed, C absent)" value={p.r00} min={0.01} max={0.1} step={0.005} onChange={set('r00')} format={(v) => `${(v * 100).toFixed(1)}%`} />
          <div className="flex flex-wrap items-center gap-4">
            <Toggle checked={noisy} onChange={setNoisy} label="Add sampling noise" hint={`Draw one study of N = ${N.toLocaleString()} instead of expected counts.`} />
            {noisy && <Button size="sm" variant="outline" onClick={() => setSeed((x) => x + 1)}>New sample</Button>}
          </div>
        </div>

        <div className="space-y-4">
          {maxRisk > 1 ? (
            <Callout kind="bad" title="Impossible parameters">A risk would exceed 100% ({(maxRisk * 100).toFixed(0)}%). Lower the baseline risk or the RRs.</Callout>
          ) : (
            <>
              <ForestPlot
                title="Crude, stratum-specific and Mantel–Haenszel risk ratios"
                truth={p.rrE}
                rows={[
                  { label: 'Crude', est: crude.est, lo: crude.lo, hi: crude.hi, color: 'series-2' },
                  { label: 'C absent', est: s0.est, lo: s0.lo, hi: s0.hi, color: 'series-1' },
                  { label: 'C present', est: s1.est, lo: s1.lo, hi: s1.hi, color: 'series-1' },
                  { label: 'MH adjusted', est: mh.est, lo: mh.lo, hi: mh.hi, color: 'series-3', emphasis: true },
                ]}
              />
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Crude ÷ adjusted" value={bias.toFixed(2)} sub={Math.abs(Math.log(bias)) < 0.05 ? 'little confounding' : bias > 1 ? 'crude exaggerates' : 'crude understates'} />
                <Stat label="Homogeneity test" value={`P = ${fmtP(homog.p)}`} sub="low power; judge sizes too" />
              </div>
              <div className="grid gap-4">
                <TwoByTwo t={strata[0]} title="Stratum: C absent" />
                <TwoByTwo t={strata[1]} title="Stratum: C present" />
              </div>
              <p className="text-xs text-muted-foreground">
                Expected counts are shown unless noise is on; CIs are what a study of N = {N.toLocaleString()} would typically report.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
