import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { chooseDesign, chooserSteps, designs, type ChooserAnswer } from '../../data/designs';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function DesignChooser() {
  const [a, setA] = useState<ChooserAnswer>({});
  const steps = chooserSteps.filter((s) => !s.when || s.when(a));
  const result = chooseDesign(a);
  const answer = (id: string, v: string) => {
    // Changing an earlier answer clears later ones.
    const idx = chooserSteps.findIndex((s) => s.id === id);
    const next: ChooserAnswer = {};
    chooserSteps.slice(0, idx).forEach((s) => a[s.id] && (next[s.id] = a[s.id]));
    next[id] = v;
    setA(next);
  };
  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <fieldset key={s.id} className="space-y-2">
          <legend className="text-sm font-semibold">
            {i + 1}. {s.question}
          </legend>
          <div className="flex flex-wrap gap-2">
            {s.options.map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={a[s.id] === o.value}
                onClick={() => answer(s.id, o.value)}
                className={cn('rounded-md border px-3 py-2 text-left text-sm transition-colors', a[s.id] === o.value ? 'border-primary bg-accent font-medium' : 'hover:border-primary/60 hover:bg-accent/50')}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      {result && (
        <div className="space-y-3 rounded-lg border-2 border-primary/40 bg-accent/30 p-4">
          <p className="text-sm font-semibold">Recommended</p>
          <p className="text-sm">{result.why}</p>
          {result.designs.map((id) => {
            const d = designs.find((x) => x.id === id)!;
            return (
              <div key={id} className="rounded-md border bg-card p-3 text-sm">
                <p className="font-semibold">{d.name}</p>
                <p className="mt-1 text-muted-foreground">{d.estimates}</p>
                <p className="mt-2"><span className="font-medium">Watch for:</span> {d.threats.slice(0, 3).join('; ')}.</p>
                <Badge variant="outline" className="mt-2">Report with: {d.guideline}</Badge>
              </div>
            );
          })}
          <Button size="sm" variant="ghost" onClick={() => setA({})}>
            <RotateCcw className="h-4 w-4" /> Start over
          </Button>
        </div>
      )}
    </div>
  );
}
