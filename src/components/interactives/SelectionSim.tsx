import { useState } from 'react';
import { expectedCohort, oddsRatio, riskRatio, selectTable, selectionOddsFactor, type SelectionProbabilities, type Table2x2 } from '../../lib/epi';
import { Callout, Stat } from '../ui/Callout';
import { Segmented, Slider } from '../ui/controls';
import { DagFigure } from '../viz/DagDrawing';
import { ForestPlot } from '../viz/ForestPlot';
import { TwoByTwo } from '../viz/TwoByTwo';

const pct = (v: number) => `${Math.round(v * 100)}%`;

function Berkson() {
  const [pA, setPA] = useState(0.1);
  const [pB, setPB] = useState(0.1);
  const [h0, setH0] = useState(0.05);
  const [rA, setRA] = useState(0.5);
  const [rB, setRB] = useState(0.5);
  const N = 100000;
  // Independent diseases in the population.
  const pop: Table2x2 = { a: N * pA * pB, b: N * pA * (1 - pB), c: N * (1 - pA) * pB, d: N * (1 - pA) * (1 - pB) };
  // Noisy-OR admission: background h0, each disease independently causes admission.
  const h = (a: number, b: number) => 1 - (1 - h0) * (1 - rA) ** a * (1 - rB) ** b;
  const hosp = selectTable(pop, { a: h(1, 1), b: h(1, 0), c: h(0, 1), d: h(0, 0) });
  const orPop = oddsRatio(pop).est;
  const orHosp = oddsRatio(hosp).est;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <DagFigure
          title="Berkson's bias DAG"
          height={130}
          nodes={[
            { id: 'A', label: 'Disease A', x: 5, y: 0, role: 'exposure' },
            { id: 'B', label: 'Disease B', x: 95, y: 0, role: 'outcome' },
            { id: 'H', label: 'Hospitalised', x: 50, y: 100, adjusted: true },
          ]}
          edges={[{ from: 'A', to: 'H' }, { from: 'B', to: 'H' }]}
          caption="No arrow between A and B: they are independent. Studying only inpatients conditions on the collider (boxed)."
        />
        <Slider label="Prevalence of disease A" value={pA} min={0.02} max={0.5} step={0.01} onChange={setPA} format={pct} />
        <Slider label="Prevalence of disease B" value={pB} min={0.02} max={0.5} step={0.01} onChange={setPB} format={pct} />
        <Slider label="Admission without either disease" value={h0} min={0.01} max={0.3} step={0.01} onChange={setH0} format={pct} />
        <Slider label="Chance A alone leads to admission" value={rA} min={0} max={0.9} step={0.05} onChange={setRA} format={pct} />
        <Slider label="Chance B alone leads to admission" value={rB} min={0} max={0.9} step={0.05} onChange={setRB} format={pct} />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="OR in the population" value={orPop.toFixed(2)} />
          <Stat label="OR among inpatients" value={orHosp.toFixed(2)} tone={Math.abs(Math.log(orHosp)) > 0.05 ? 'bad' : undefined} />
        </div>
        <TwoByTwo t={pop} title={`Population (N = ${N.toLocaleString()})`} exposureLabel="Disease A" outcomeLabel="Disease B" rows={['A present', 'A absent']} columns={['B present', 'B absent']} showRisk={false} />
        <TwoByTwo t={hosp} title="Hospitalised patients only" exposureLabel="Disease A" outcomeLabel="Disease B" rows={['A present', 'A absent']} columns={['B present', 'B absent']} showRisk={false} />
        <p className="text-sm text-muted-foreground">
          Set either "leads to admission" slider to 0% and the bias disappears: the collider needs arrows from both sides. Higher background admission dilutes the bias.
        </p>
      </div>
    </div>
  );
}

const scenarios: { label: string; s: SelectionProbabilities; note: string }[] = [
  { label: 'Loss depends on exposure only', s: { a: 0.6, b: 0.6, c: 0.9, d: 0.9 }, note: 'Exposed people drop out more, but equally whether or not they develop the outcome. Risks within each group are unchanged: no bias, less precision.' },
  { label: 'Depends on outcome only', s: { a: 0.5, b: 0.9, c: 0.5, d: 0.9 }, note: 'People who develop the outcome drop out more, equally in both groups. The OR is unbiased (the selection factor cancels) but the RR is not — here it is slightly exaggerated. Selection on outcome alone is why case–control ORs work.' },
  { label: 'Depends on exposure and outcome', s: { a: 0.5, b: 0.9, c: 0.9, d: 0.9 }, note: 'Exposed people who develop the outcome are the most likely to be lost (e.g. side-effects and worsening). Both measures are biased toward the null here.' },
  { label: 'Volunteer bias in a case–control', s: { a: 0.9, b: 0.4, c: 0.6, d: 0.6 }, note: 'Exposed cases and unexposed controls are over-represented, inflating the OR by (sₐ·s_d)/(s_b·s_c).' },
];

function Retention() {
  const [r1, setR1] = useState(0.2);
  const [r0, setR0] = useState(0.1);
  const [s, setS] = useState<SelectionProbabilities>(scenarios[2].s);
  const [note, setNote] = useState(scenarios[2].note);
  const truth = expectedCohort(1000, 1000, r1, r0);
  const obs = selectTable(truth, s);
  const rrT = riskRatio(truth);
  const rrO = riskRatio(obs);
  const orT = oddsRatio(truth);
  const orO = oddsRatio(obs);
  const setK = (k: keyof SelectionProbabilities) => (v: number) => {
    setS((q) => ({ ...q, [k]: v }));
    setNote('');
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((sc) => (
          <button key={sc.label} type="button" onClick={() => { setS(sc.s); setNote(sc.note); }} className="rounded-full border px-3 py-1 text-xs hover:border-primary hover:bg-accent">
            {sc.label}
          </button>
        ))}
      </div>
      {note && <Callout kind="tip" title="Scenario">{note}</Callout>}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Slider label="True risk, exposed" value={r1} min={0.02} max={0.6} step={0.01} onChange={setR1} format={pct} />
          <Slider label="True risk, unexposed" value={r0} min={0.02} max={0.6} step={0.01} onChange={setR0} format={pct} />
          <p className="pt-2 text-sm font-medium">Probability of being included / retained</p>
          <Slider label="Exposed, outcome +" value={s.a} min={0.05} max={1} step={0.05} onChange={setK('a')} format={pct} />
          <Slider label="Exposed, outcome −" value={s.b} min={0.05} max={1} step={0.05} onChange={setK('b')} format={pct} />
          <Slider label="Unexposed, outcome +" value={s.c} min={0.05} max={1} step={0.05} onChange={setK('c')} format={pct} />
          <Slider label="Unexposed, outcome −" value={s.d} min={0.05} max={1} step={0.05} onChange={setK('d')} format={pct} />
        </div>
        <div className="space-y-4">
          <ForestPlot
            title="True versus observed measures after selection"
            measure="Ratio"
            rows={[
              { label: 'RR — true', est: rrT.est, color: 'muted' },
              { label: 'RR — observed', est: rrO.est, color: 'series-1' },
              { label: 'OR — true', est: orT.est, color: 'muted' },
              { label: 'OR — observed', est: orO.est, color: 'series-2' },
            ]}
          />
          <Stat label="Selection odds factor (sₐ·s_d)/(s_b·s_c)" value={selectionOddsFactor(s).toFixed(2)} sub="OR_observed = OR_true × this factor" />
          <TwoByTwo t={obs} title="Observed among those selected (expected counts from 1,000 per group)" />
        </div>
      </div>
    </div>
  );
}

export function SelectionSim() {
  const [tab, setTab] = useState<'berkson' | 'retention'>('berkson');
  return (
    <div className="space-y-5">
      <Segmented label="Selection scenario" value={tab} onChange={setTab} options={[{ value: 'berkson', label: "Berkson's bias" }, { value: 'retention', label: 'Selection & loss to follow-up' }]} />
      {tab === 'berkson' ? <Berkson /> : <Retention />}
    </div>
  );
}
