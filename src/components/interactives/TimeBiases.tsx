import { useMemo, useState } from 'react';
import { simulateImmortalTime } from '../../lib/sim';
import { Callout, Stat } from '../ui/Callout';
import { Slider } from '../ui/controls';
import { ForestPlot } from '../viz/ForestPlot';

/** Immortal time bias: naive "ever user" vs time-varying exposure classification. */
export function ImmortalTime() {
  const [deathRate, setDeathRate] = useState(0.25);
  const [start, setStart] = useState(0.5);
  const [delay, setDelay] = useState(1);
  const [hr, setHr] = useState(1);
  const res = useMemo(
    () => simulateImmortalTime({ n: 20000, deathRate, intendToStart: start, maxDelay: delay, followUp: 3, trueHR: hr, seed: 21 }),
    [deathRate, start, delay, hr]
  );
  return (
    <div className="space-y-5">
      <div className="space-y-2 rounded-lg border bg-card p-3 text-xs sm:text-sm">
        <p className="font-medium">One patient who starts the drug 8 months after cohort entry</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-muted-foreground sm:w-32">Naive "ever-user"</span>
            <div className="flex h-5 flex-1 overflow-hidden rounded">
              <div className="flex w-[22%] items-center justify-center bg-[var(--status-bad)] text-[10px] font-medium text-white">immortal</div>
              <div className="flex-1 bg-[var(--series-2)]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-muted-foreground sm:w-32">Time-varying</span>
            <div className="flex h-5 flex-1 overflow-hidden rounded">
              <div className="w-[22%] bg-[var(--series-1)]" />
              <div className="flex-1 bg-[var(--series-2)]" />
            </div>
          </div>
          <div className="flex gap-4 pl-[6.5rem] text-[11px] text-muted-foreground sm:pl-[8.5rem]">
            <span><span className="mr-1 inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--series-1)' }} />unexposed time</span>
            <span><span className="mr-1 inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--series-2)' }} />exposed time</span>
          </div>
        </div>
        <p className="text-muted-foreground">To be called a user the patient had to survive until the first prescription. The naive analysis credits that guaranteed-survival time to the drug.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Slider label="True hazard ratio of the drug" value={hr} min={0.5} max={1.5} step={0.05} onChange={setHr} format={(v) => v.toFixed(2)} hint="1.00 = the drug does nothing" />
        <Slider label="Death rate (per person-year)" value={deathRate} min={0.05} max={0.5} step={0.05} onChange={setDeathRate} format={(v) => v.toFixed(2)} />
        <Slider label="Patients who would start the drug" value={start} min={0.2} max={0.8} step={0.05} onChange={setStart} format={(v) => `${Math.round(v * 100)}%`} />
        <Slider label="Start occurs within (years after entry)" value={delay} min={0.25} max={2} step={0.25} onChange={setDelay} format={(v) => `${v} y`} />
      </div>
      <ForestPlot
        title="Rate ratio for death by analysis method"
        measure="Rate ratio"
        truth={hr}
        rows={[
          { label: 'Naive ever-user', est: res.naive.rateRatio, color: 'series-2' },
          { label: 'Time-varying exposure', est: res.timeVarying.rateRatio, color: 'series-3', emphasis: true },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Ever-users" value={res.everUsers.toLocaleString()} sub="of 20,000 patients" />
        <Stat label="Immortal person-years" value={Math.round(res.immortalPersonTime).toLocaleString()} sub="misattributed to the drug" />
        <Stat label="Naive estimate" value={res.naive.rateRatio.toFixed(2)} tone="bad" sub={`truth ${hr.toFixed(2)}`} />
      </div>
      <Callout kind="tip" title="Fixes">
        Classify exposure as time-varying, use a landmark analysis, or emulate a target trial in which eligibility, assignment and start of follow-up coincide (Suissa 2008; Hernán et al. 2016). ROBINS-I V2 now asks about immortal time explicitly.
      </Callout>
    </div>
  );
}

/** Lead-time bias: survival from diagnosis improves while age at death does not change. */
export function LeadTime() {
  const [lead, setLead] = useState(2);
  // 100 patients whose survival after clinical diagnosis is spread evenly from 1 to 10 years.
  const surv = Array.from({ length: 100 }, (_, i) => 1 + (9 * i) / 99);
  const fiveYear = (shift: number) => surv.filter((s) => s + shift >= 5).length / surv.length;
  const dx = 62;
  const death = 68;
  const span = { from: 52, to: 72 };
  const pos = (age: number) => `${((age - span.from) / (span.to - span.from)) * 100}%`;
  return (
    <div className="space-y-5">
      <Slider label="Lead time gained by screening" value={lead} min={0} max={6} step={0.5} onChange={setLead} format={(v) => `${v} years`} />
      <div className="space-y-4 rounded-lg border bg-card p-3 text-xs sm:text-sm">
        {[
          { label: 'No screening', start: dx },
          { label: 'Screening', start: dx - lead },
        ].map((r) => (
          <div key={r.label}>
            <p className="mb-1 font-medium">{r.label}: diagnosed at {r.start}, dies at {death} → survives {death - r.start} years after diagnosis</p>
            <div className="relative h-6 rounded bg-muted">
              <div className="absolute inset-y-0 rounded bg-[var(--series-1)]" style={{ left: pos(r.start), width: `calc(${pos(death)} - ${pos(r.start)})` }} />
              <div className="absolute inset-y-0 w-1 bg-[var(--chart-ink)]" style={{ left: pos(death) }} title="Death" />
            </div>
          </div>
        ))}
        <div className="flex justify-between text-[11px] text-muted-foreground"><span>age {span.from}</span><span>age {span.to}</span></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="5-year survival, clinical diagnosis" value={`${Math.round(fiveYear(0) * 100)}%`} />
        <Stat label="5-year survival, screen-detected" value={`${Math.round(fiveYear(lead) * 100)}%`} tone="primary" />
        <Stat label="Change in age at death" value="0 years" tone="bad" sub="mortality unchanged" />
      </div>
      <Callout kind="pitfall" title="Survival from diagnosis is the wrong yardstick">
        The survival clock simply starts earlier. Length-time bias (indolent tumours spend longer in the detectable phase) and overdiagnosis make it worse. Judge screening by mortality in randomised populations (Welch & Black 2010).
      </Callout>
    </div>
  );
}
