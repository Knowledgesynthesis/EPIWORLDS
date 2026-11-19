import { useState } from 'react';
import { Stat } from '../ui/Callout';
import { Slider } from '../ui/controls';
import { LineChart } from '../viz/LineChart';

const orFrom = (r0: number, rr: number) => {
  const r1 = r0 * rr;
  return r1 / (1 - r1) / (r0 / (1 - r0));
};

/** Shows how far the odds ratio drifts from the risk ratio as the outcome becomes common. */
export function OrVsRr() {
  const [rr, setRr] = useState(2);
  const [r0, setR0] = useState(0.1);
  const maxR0 = Math.min(0.6, 0.95 / Math.max(rr, 1));
  const base = Math.min(r0, maxR0);
  const or = orFrom(base, rr);
  const pts = Array.from({ length: 60 }, (_, i) => 0.005 + (i / 59) * (maxR0 - 0.005));
  const yMax = Math.ceil(Math.max(orFrom(maxR0, rr), rr, 1 / Math.min(rr, 1)) + 0.5);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Slider label="True risk ratio" value={rr} min={0.25} max={4} step={0.05} onChange={setRr} format={(v) => v.toFixed(2)} />
        <Slider
          label="Risk in the unexposed"
          value={base}
          min={0.005}
          max={maxR0}
          step={0.005}
          onChange={setR0}
          format={(v) => `${(v * 100).toFixed(1)}%`}
          hint={`Capped at ${(maxR0 * 100).toFixed(0)}% so that risk in the exposed stays below 95%.`}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Risk in exposed" value={`${(base * rr * 100).toFixed(1)}%`} />
        <Stat label="Risk ratio" value={rr.toFixed(2)} />
        <Stat label="Odds ratio" value={or.toFixed(2)} tone="primary" sub={`${(((or - rr) / rr) * 100).toFixed(0)}% different from the RR`} />
      </div>
      <LineChart
        title="Odds ratio and risk ratio as baseline risk increases"
        series={[
          { id: 'or', label: 'Odds ratio', color: 'series-2', points: pts.map((x) => ({ x, y: orFrom(x, rr) })) },
          { id: 'rr', label: 'Risk ratio (fixed)', color: 'series-1', points: pts.map((x) => ({ x, y: rr })), dashed: true },
        ]}
        xLabel="Risk in the unexposed"
        yLabel="Ratio"
        xDomain={[0, maxR0]}
        yDomain={[rr < 1 ? 0 : 0.5, yMax]}
        xTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].filter((t) => t <= maxR0)}
        yTicks={Array.from({ length: 6 }, (_, i) => +((rr < 1 ? 0 : 0.5) + (i * (yMax - (rr < 1 ? 0 : 0.5))) / 5).toFixed(1))}
        fmtX={(v) => `${Math.round(v * 100)}%`}
        fmtY={(v) => v.toFixed(2)}
        marker={{ x: base, label: 'now' }}
      />
      <p className="text-sm text-muted-foreground">
        Below about 10% baseline risk the two nearly coincide. As the outcome becomes common, the OR moves further from 1 than the RR — never closer. Reporting an OR of {or.toFixed(1)} as "{or.toFixed(1)} times the risk" would overstate the effect.
      </p>
    </div>
  );
}
