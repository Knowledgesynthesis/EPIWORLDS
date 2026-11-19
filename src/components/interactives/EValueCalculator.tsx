import { useState } from 'react';
import { eValues, type EffectMeasure } from '../../lib/epi';
import { Callout, Stat } from '../ui/Callout';
import { NumberField, Segmented, Toggle } from '../ui/controls';
import { LineChart } from '../viz/LineChart';

export function EValueCalculator() {
  const [measure, setMeasure] = useState<EffectMeasure>('RR');
  const [est, setEst] = useState(1.8);
  const [lo, setLo] = useState(1.3);
  const [hi, setHi] = useState(2.5);
  const [common, setCommon] = useState(false);
  const valid = est > 0 && lo > 0 && hi > 0 && lo <= est && est <= hi;
  const ev = valid ? eValues(est, lo, hi, measure, common) : null;

  // Curve of (RR_EU, RR_UD) pairs whose bounding factor equals the observed RR.
  const rrObs = ev ? (ev.rr >= 1 ? ev.rr : 1 / ev.rr) : 1;
  const xMax = ev ? Math.max(ev.point * 2.5, rrObs + 2) : 5;
  const curve =
    ev && rrObs > 1.001
      ? Array.from({ length: 80 }, (_, i) => {
          const x = rrObs + 0.02 + (i / 79) * (xMax - rrObs - 0.02);
          return { x, y: (rrObs * (x - 1)) / (x - rrObs) };
        })
      : [];

  return (
    <div className="space-y-5">
      <Segmented
        label="Effect measure"
        value={measure}
        onChange={setMeasure}
        options={[
          { value: 'RR', label: 'Risk ratio' },
          { value: 'OR', label: 'Odds ratio' },
          { value: 'HR', label: 'Hazard ratio' },
        ]}
      />
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Estimate" value={est} onChange={setEst} step={0.05} min={0.01} />
        <NumberField label="Lower 95% limit" value={lo} onChange={setLo} step={0.05} min={0.01} />
        <NumberField label="Upper 95% limit" value={hi} onChange={setHi} step={0.05} min={0.01} />
      </div>
      {measure !== 'RR' && (
        <Toggle
          checked={common}
          onChange={setCommon}
          label="Outcome is common (≥ ~15% by end of follow-up)"
          hint={measure === 'OR' ? 'Converts with RR ≈ √OR.' : 'Converts with RR ≈ (1 − 0.5^√HR)/(1 − 0.5^√(1/HR)).'}
        />
      )}
      {!valid ? (
        <Callout kind="bad" title="Check the inputs">The interval must contain the estimate and all values must be positive.</Callout>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="E-value for the estimate" value={ev!.point.toFixed(2)} tone="primary" sub={measure !== 'RR' && common ? `on RR scale ≈ ${ev!.rr.toFixed(2)}` : undefined} />
            <Stat label="E-value for the confidence limit" value={ev!.ci.toFixed(2)} sub={ev!.ci === 1 ? 'interval already includes the null' : 'limit closest to the null'} />
          </div>
          <p className="text-sm leading-6">
            To fully explain away the estimate, an unmeasured confounder would need to be associated with both the exposure and the outcome by a risk ratio of at least <strong>{ev!.point.toFixed(2)}</strong> each, above and beyond the measured covariates. To shift the confidence limit to the null, <strong>{ev!.ci.toFixed(2)}</strong> each would suffice.
          </p>
          {curve.length > 0 && (
            <LineChart
              title="Confounder strengths that could explain away the estimate"
              series={[{ id: 'c', label: 'Explains away the estimate', color: 'series-1', points: curve }]}
              xLabel="Confounder–exposure RR"
              yLabel="Confounder–outcome RR"
              xDomain={[1, xMax]}
              yDomain={[1, xMax]}
              xTicks={Array.from({ length: 5 }, (_, i) => +(1 + (i * (xMax - 1)) / 4).toFixed(1))}
              yTicks={Array.from({ length: 5 }, (_, i) => +(1 + (i * (xMax - 1)) / 4).toFixed(1))}
              fmtX={(v) => v.toFixed(1)}
              fmtY={(v) => v.toFixed(1)}
              marker={{ x: ev!.point, label: `E = ${ev!.point.toFixed(2)}` }}
            />
          )}
          <p className="text-xs text-muted-foreground">
            Any pair on or above the curve could fully account for the observed association; pairs below it could not. Compare with the strength of known measured confounders. An E-value is not a probability and does not address selection or measurement bias.
          </p>
        </>
      )}
    </div>
  );
}
