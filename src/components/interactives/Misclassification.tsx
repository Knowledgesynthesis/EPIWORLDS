import { useState } from 'react';
import { misclassifiedRisk, misclassifyExposure, oddsRatio, riskRatio, type ClassificationAccuracy, type Table2x2 } from '../../lib/epi';
import { Callout, Stat } from '../ui/Callout';
import { Segmented, Slider, Toggle } from '../ui/controls';
import { ForestPlot } from '../viz/ForestPlot';
import { TwoByTwo } from '../viz/TwoByTwo';

const pct = (v: number) => `${Math.round(v * 100)}%`;

function direction(truth: number, obs: number): { text: string; tone: 'good' | 'bad' | undefined } {
  const lt = Math.log(truth);
  const lo = Math.log(obs);
  if (Math.abs(lo - lt) < 0.01) return { text: 'essentially unbiased', tone: 'good' };
  if (Math.sign(lo) !== Math.sign(lt) && Math.abs(lo) > 0.01) return { text: 'crosses the null (direction reversed)', tone: 'bad' };
  return Math.abs(lo) < Math.abs(lt) ? { text: 'biased toward the null', tone: 'bad' } : { text: 'biased away from the null', tone: 'bad' };
}

function Accuracy({ title, acc, onChange }: { title: string; acc: ClassificationAccuracy; onChange: (a: ClassificationAccuracy) => void }) {
  return (
    <div className="space-y-3 rounded-lg border p-3">
      <p className="text-sm font-semibold">{title}</p>
      <Slider label="Sensitivity" value={acc.se} min={0.3} max={1} step={0.01} onChange={(se) => onChange({ ...acc, se })} format={pct} />
      <Slider label="Specificity" value={acc.sp} min={0.3} max={1} step={0.01} onChange={(sp) => onChange({ ...acc, sp })} format={pct} />
    </div>
  );
}

function ExposureMode() {
  const [trueOR, setTrueOR] = useState(3);
  const [p0, setP0] = useState(0.25);
  const [linked, setLinked] = useState(true);
  const [cases, setCases] = useState<ClassificationAccuracy>({ se: 0.8, sp: 0.9 });
  const [ctrls, setCtrls] = useState<ClassificationAccuracy>({ se: 0.8, sp: 0.9 });
  const odds1 = (p0 / (1 - p0)) * trueOR;
  const p1 = odds1 / (1 + odds1);
  const truth: Table2x2 = { a: 500 * p1, c: 500 * (1 - p1), b: 500 * p0, d: 500 * (1 - p0) };
  const obs = misclassifyExposure(truth, cases, linked ? cases : ctrls);
  const orObs = oddsRatio(obs).est;
  const dir = direction(trueOR, orObs);
  const nd = linked || (Math.abs(cases.se - ctrls.se) < 1e-9 && Math.abs(cases.sp - ctrls.sp) < 1e-9);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Slider label="True odds ratio" value={trueOR} min={0.25} max={5} step={0.05} onChange={setTrueOR} format={(v) => v.toFixed(2)} />
        <Slider label="True exposure prevalence in controls" value={p0} min={0.05} max={0.8} step={0.01} onChange={setP0} format={pct} />
        <Toggle checked={linked} onChange={setLinked} label="Non-differential (same accuracy in cases and controls)" hint="Turn off to model recall bias: cases remember better." />
        <Accuracy title={linked ? 'Exposure measurement (everyone)' : 'Exposure measurement in cases'} acc={cases} onChange={setCases} />
        {!linked && <Accuracy title="Exposure measurement in controls" acc={ctrls} onChange={setCtrls} />}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="True OR" value={trueOR.toFixed(2)} />
          <Stat label="Observed OR" value={orObs.toFixed(2)} tone={dir.tone} sub={dir.text} />
        </div>
        <ForestPlot title="True vs observed odds ratio" measure="OR" rows={[{ label: 'True', est: trueOR, color: 'muted' }, { label: 'Observed', est: orObs, color: 'series-2' }]} />
        <TwoByTwo t={obs} title="Observed table (500 cases, 500 controls)" columns={['Cases', 'Controls']} showRisk={false} />
        {nd && cases.se + cases.sp < 1 && (
          <Callout kind="pitfall" title="Se + Sp < 1">The classification is worse than a coin toss inverted: non-differential error now reverses the association. The "toward the null" rule assumes Se + Sp &gt; 1.</Callout>
        )}
        {nd && cases.se + cases.sp > 1 && (
          <p className="text-sm text-muted-foreground">Non-differential error moves the expected OR toward 1. Specificity matters most when exposure is rare in controls — try 25% → 5% prevalence with Sp 90%.</p>
        )}
        {!nd && <p className="text-sm text-muted-foreground">With differential error the bias can go either way. Higher sensitivity in cases (better recall) usually pushes the OR away from the null.</p>}
      </div>
    </div>
  );
}

function OutcomeMode() {
  const [r1, setR1] = useState(0.2);
  const [r0, setR0] = useState(0.1);
  const [linked, setLinked] = useState(true);
  const [ex, setEx] = useState<ClassificationAccuracy>({ se: 0.7, sp: 1 });
  const [un, setUn] = useState<ClassificationAccuracy>({ se: 0.7, sp: 1 });
  const o1 = misclassifiedRisk(r1, ex);
  const o0 = misclassifiedRisk(r0, linked ? ex : un);
  const t = { a: r1, b: 1 - r1, c: r0, d: 1 - r0 };
  const o = { a: o1, b: 1 - o1, c: o0, d: 1 - o0 };
  const rrT = riskRatio(t).est;
  const rrO = riskRatio(o).est;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Slider label="True risk, exposed" value={r1} min={0.01} max={0.6} step={0.01} onChange={setR1} format={pct} />
        <Slider label="True risk, unexposed" value={r0} min={0.01} max={0.6} step={0.01} onChange={setR0} format={pct} />
        <Toggle checked={linked} onChange={setLinked} label="Non-differential (same ascertainment in both groups)" hint="Turn off to model detection bias, e.g. exposed patients tested more often." />
        <Accuracy title={linked ? 'Outcome ascertainment (everyone)' : 'Outcome ascertainment in exposed'} acc={ex} onChange={setEx} />
        {!linked && <Accuracy title="Outcome ascertainment in unexposed" acc={un} onChange={setUn} />}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="RR true → observed" value={`${rrT.toFixed(2)} → ${rrO.toFixed(2)}`} tone={Math.abs(Math.log(rrO / rrT)) < 0.01 ? 'good' : 'bad'} sub={direction(rrT, rrO).text} />
          <Stat label="RD true → observed (per 100)" value={`${((r1 - r0) * 100).toFixed(1)} → ${((o1 - o0) * 100).toFixed(1)}`} />
        </div>
        <ForestPlot title="True vs observed risk ratio" measure="RR" rows={[{ label: 'True', est: rrT, color: 'muted' }, { label: 'Observed', est: rrO, color: 'series-1' }]} />
        <Callout kind="tip" title="Try this">Keep specificity at 100% and lower sensitivity: the RR stays exactly right while risks and the RD shrink. Now lower specificity to 95% — false positives add the same amount to both groups and pull the RR toward 1, especially for rare outcomes.</Callout>
      </div>
    </div>
  );
}

export function Misclassification() {
  const [mode, setMode] = useState<'exposure' | 'outcome'>('exposure');
  return (
    <div className="space-y-5">
      <Segmented label="What is misclassified" value={mode} onChange={setMode} options={[{ value: 'exposure', label: 'Exposure (case–control)' }, { value: 'outcome', label: 'Outcome (cohort)' }]} />
      {mode === 'exposure' ? <ExposureMode /> : <OutcomeMode />}
    </div>
  );
}
