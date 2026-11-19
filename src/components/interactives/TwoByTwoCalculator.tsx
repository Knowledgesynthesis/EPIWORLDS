import { useState } from 'react';
import { chiSquare2x2, numberNeeded, oddsRatio, riskDifference, riskRatio, type Table2x2 } from '../../lib/epi';
import { wilson } from '../../lib/stats';
import { fmtCI, fmtP, fmtRatio } from '../../lib/utils';
import { Callout, Stat } from '../ui/Callout';
import { Segmented } from '../ui/controls';
import { TwoByTwo } from '../viz/TwoByTwo';

type DesignMode = 'cohort' | 'case-control' | 'cross-sectional';

const presets: { label: string; t: Table2x2; mode: DesignMode }[] = [
  { label: 'Trial: 8% vs 12% deaths', t: { a: 40, b: 460, c: 60, d: 440 }, mode: 'cohort' },
  { label: 'Cohort: RR 2', t: { a: 20, b: 80, c: 10, d: 90 }, mode: 'cohort' },
  { label: 'Doll & Hill 1950 (men)', t: { a: 647, b: 622, c: 2, d: 27 }, mode: 'case-control' },
  { label: 'Zero cell', t: { a: 0, b: 50, c: 6, d: 44 }, mode: 'cohort' },
];

export function TwoByTwoCalculator() {
  const [t, setT] = useState<Table2x2>(presets[1].t);
  const [mode, setMode] = useState<DesignMode>('cohort');
  const n1 = t.a + t.b;
  const n0 = t.c + t.d;
  const rr = riskRatio(t);
  const or = oddsRatio(t);
  const rd = riskDifference(t);
  const nn = numberNeeded(rd);
  const chi = chiSquare2x2(t);
  const [l1, u1] = wilson(t.a, n1);
  const [l0, u0] = wilson(t.c, n0);
  const corrected = rr.corrected || or.corrected;
  const isCC = mode === 'case-control';
  const word = mode === 'cross-sectional' ? 'Prevalence' : 'Risk';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Study design"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'cohort', label: 'Cohort / trial' },
            { value: 'case-control', label: 'Case–control' },
            { value: 'cross-sectional', label: 'Cross-sectional' },
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Example tables">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setT(p.t);
              setMode(p.mode);
            }}
            className="rounded-full border px-3 py-1 text-xs hover:border-primary hover:bg-accent"
          >
            {p.label}
          </button>
        ))}
      </div>

      <TwoByTwo
        t={t}
        editable
        onChange={setT}
        showRisk={!isCC}
        columns={isCC ? ['Cases', 'Controls'] : ['Outcome +', 'Outcome −']}
      />

      {isCC ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Odds ratio (Woolf 95% CI)" value={fmtRatio(or.est)} sub={fmtCI(or.lo, or.hi)} tone="primary" />
            <Stat label="Exposed among cases" value={`${((t.a / (t.a + t.c)) * 100).toFixed(1)}%`} sub={`${t.a} of ${t.a + t.c}`} />
            <Stat label="Exposed among controls" value={`${((t.b / (t.b + t.d)) * 100).toFixed(1)}%`} sub={`${t.b} of ${t.b + t.d}`} />
          </div>
          <p className="formula block overflow-x-auto whitespace-nowrap py-2">
            OR = (a·d)/(b·c) = ({t.a}·{t.d})/({t.b}·{t.c}) = {fmtRatio(or.est)}
          </p>
          <Callout kind="info" title="Why no risk ratio?">
            Cases and controls were sampled separately, so a/(a+b) is not a risk — it depends on how many controls you chose. The exposure odds ratio equals the disease odds ratio; with incidence-density (risk-set) sampling it estimates the rate ratio without a rare-disease assumption.
          </Callout>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label={`${word} ratio (Katz 95% CI)`} value={fmtRatio(rr.est)} sub={fmtCI(rr.lo, rr.hi)} tone="primary" />
            <Stat label={`${word} difference (Newcombe 95% CI)`} value={Number.isFinite(rd.est) ? (rd.est * 100).toFixed(1) + ' pts' : '—'} sub={Number.isFinite(rd.lo) ? `${(rd.lo * 100).toFixed(1)} to ${(rd.hi * 100).toFixed(1)}` : '—'} />
            <Stat label={mode === 'cohort' ? 'NNT (Altman)' : 'Odds ratio'} value={mode === 'cohort' ? nn.text : fmtRatio(or.est)} sub={mode === 'cohort' ? nn.ciText : fmtCI(or.lo, or.hi)} />
            <Stat label={`${word} in exposed (Wilson CI)`} value={n1 ? `${((t.a / n1) * 100).toFixed(1)}%` : '—'} sub={n1 ? `${(l1 * 100).toFixed(1)}–${(u1 * 100).toFixed(1)}%` : ''} />
            <Stat label={`${word} in unexposed (Wilson CI)`} value={n0 ? `${((t.c / n0) * 100).toFixed(1)}%` : '—'} sub={n0 ? `${(l0 * 100).toFixed(1)}–${(u0 * 100).toFixed(1)}%` : ''} />
            <Stat label="χ² test (1 df, no correction)" value={Number.isFinite(chi.chi2) ? chi.chi2.toFixed(2) : '—'} sub={`P = ${fmtP(chi.p)}`} />
          </div>
          <div className="space-y-1 overflow-x-auto text-sm">
            <p className="formula inline-block whitespace-nowrap">
              {word[0]}R = [a/(a+b)] / [c/(c+d)] = ({t.a}/{n1}) / ({t.c}/{n0}) = {fmtRatio(rr.est)}
            </p>
            <br />
            <p className="formula inline-block whitespace-nowrap">
              {word[0]}D = {t.a}/{n1} − {t.c}/{n0} = {Number.isFinite(rd.est) ? rd.est.toFixed(3) : '—'}
            </p>
            <br />
            <p className="formula inline-block whitespace-nowrap">
              OR = ad/bc = {fmtRatio(or.est)}
              {n0 > 0 && t.c / n0 > 0.1 && Number.isFinite(rr.est) ? ` — outcome is common, so the OR is further from 1 than the ${word[0]}R` : ''}
            </p>
          </div>
          {mode === 'cohort' && (
            <p className="text-xs text-muted-foreground">NNT assumes the exposure is the treatment and the outcome is undesirable. It applies to the follow-up period of the table.</p>
          )}
        </div>
      )}
      {corrected && (
        <Callout kind="pitfall" title="Zero cell">
          A cell is zero, so 0.5 was added to every cell to compute ratio measures and their intervals (Haldane–Anscombe). Treat these estimates as rough; exact methods are preferable with sparse data.
        </Callout>
      )}
    </div>
  );
}
